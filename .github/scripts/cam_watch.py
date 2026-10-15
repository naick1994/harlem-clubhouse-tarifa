"""Keep the Balneario cam on the site, every 30 minutes.

1. Find the channel's current live (the cam opens a new one after a long
   power cut) and point config.js at it, committing the change.
2. Set it up the way the site needs: auto stop off (so the next power cut
   pauses the live instead of ending it, and the id stays), DVR on (the VIP
   replay), embedding on (the site player).
3. Fail, which emails the owner, when the cam is not live.

Needs the repo secrets YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN,
made once by tools/yt-auth.py. Standard library only.
"""

import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://www.googleapis.com/youtube/v3"
CONFIG = "assets/js/config.js"
PAGES = ["index.html", "vip/index.html"]


def error(msg):
    print(f"::error::{msg}")


def warn(msg):
    print(f"::warning::{msg}")


def call(method, url, token=None, body=None, form=None):
    headers = {}
    data = None
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode()
    if form is not None:
        data = urllib.parse.urlencode(form).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{method} {url.split('?')[0]} -> {e.code} {e.read()[:300]!r}")


def access_token():
    return call("POST", "https://oauth2.googleapis.com/token", form={
        "client_id": os.environ["YT_CLIENT_ID"],
        "client_secret": os.environ["YT_CLIENT_SECRET"],
        "refresh_token": os.environ["YT_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    })["access_token"]


def current_broadcast(token):
    """The live the cam is feeding: live first, then one getting ready."""
    items = call("GET", f"{API}/liveBroadcasts?part=id,snippet,status,contentDetails"
                        f"&mine=true&maxResults=20", token).get("items", [])
    rank = {"live": 0, "liveStarting": 1, "testing": 2, "testStarting": 3, "ready": 4}
    items = [b for b in items if b["status"]["lifeCycleStatus"] in rank]
    if not items:
        return None
    items.sort(key=lambda b: (rank[b["status"]["lifeCycleStatus"]],
                              # newest first among equals
                              "".join(chr(255 - ord(c)) for c in
                                      b["snippet"].get("actualStartTime") or
                                      b["snippet"].get("publishedAt", ""))))
    return items[0]


def fix_broadcast(token, b):
    cd = b["contentDetails"]
    if cd.get("enableAutoStop") is False and cd.get("enableDvr") is True:
        return
    want = {
        "monitorStream": {
            "enableMonitorStream": cd.get("monitorStream", {}).get("enableMonitorStream", True),
            "broadcastStreamDelayMs": cd.get("monitorStream", {}).get("broadcastStreamDelayMs", 0),
        },
        "enableAutoStop": False,
        "enableDvr": True,
        "enableAutoStart": cd.get("enableAutoStart", True),
        "enableClosedCaptions": cd.get("enableClosedCaptions", False),
        "recordFromStart": cd.get("recordFromStart", True),
        "latencyPreference": cd.get("latencyPreference", "low"),
    }
    try:
        call("PUT", f"{API}/liveBroadcasts?part=contentDetails", token,
             body={"id": b["id"], "contentDetails": want})
        print("Set auto stop off and DVR on.")
    except RuntimeError as e:
        # some fields lock once a live is running; the next live gets them
        warn(f"Could not change the live settings now: {e}")


def fix_embed(token, video_id):
    items = call("GET", f"{API}/videos?part=status&id={video_id}", token).get("items", [])
    if not items:
        return
    status = items[0]["status"]
    if status.get("embeddable"):
        return
    body = {"id": video_id, "status": {
        "privacyStatus": status.get("privacyStatus", "unlisted"),
        "embeddable": True,
        "publicStatsViewable": status.get("publicStatsViewable", True),
        "selfDeclaredMadeForKids": status.get("madeForKids", False),
    }}
    if status.get("license"):
        body["status"]["license"] = status["license"]
    call("PUT", f"{API}/videos?part=status", token, body=body)
    print("Turned embedding on.")


def point_site_at(video_id):
    text = open(CONFIG).read()
    old = re.search(r'youtubeVideoId: "([^"]*)"', text).group(1)
    if old == video_id:
        return False
    open(CONFIG, "w").write(text.replace(f'youtubeVideoId: "{old}"', f'youtubeVideoId: "{video_id}"'))
    # new version number on config.js so browsers fetch the new id
    for page in PAGES:
        html = open(page).read()
        html = re.sub(r"config\.js\?v=(\d+)", lambda m: f"config.js?v={int(m.group(1)) + 1}", html)
        open(page, "w").write(html)
    git = lambda *a: subprocess.run(["git", *a], check=True)
    git("config", "user.name", "cam-watch")
    git("config", "user.email", "cam-watch@users.noreply.github.com")
    git("add", CONFIG, *PAGES)
    git("commit", "-m", f"Point the cam at the new live {video_id}\n\nYouTube opened a new live, found by the cam watch.")
    git("push")
    print(f"Site moved from {old} to {video_id}.")
    return True


def check_only(key):
    """Before the channel access exists: only check the id in config.js."""
    vid = re.search(r'youtubeVideoId: "([^"]*)"', open(CONFIG).read()).group(1)
    items = call("GET", f"{API}/videos?part=snippet,status&id={vid}&key={key}").get("items", [])
    if not items:
        error(f"The live {vid} does not exist any more. YouTube made a new one: put its video id in config.js.")
        return 1
    if items[0]["snippet"].get("liveBroadcastContent") != "live":
        error(f"The cam is OFFLINE. The live {vid} is not streaming. Check power and wifi at Balneario. "
              "If YouTube ended the live, the site needs the new video id.")
        return 1
    if not items[0]["status"].get("embeddable", True):
        error(f"The cam is live but YouTube blocks embedding. Tick 'Consenti incorporamento' on video {vid}.")
        return 1
    print(f"Cam is live and embeddable ({vid}).")
    return 0


def main():
    if not all(os.environ.get(k) for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN")):
        if os.environ.get("YT_API_KEY"):
            return check_only(os.environ["YT_API_KEY"])
        warn("No YouTube secrets, the cam watch cannot reach YouTube.")
        return 0

    token = access_token()
    b = current_broadcast(token)
    if not b:
        error("The cam is OFFLINE: the channel has no live and none getting ready. Check power and wifi at Balneario.")
        return 1

    vid, state = b["id"], b["status"]["lifeCycleStatus"]
    print(f"Current live {vid}: {state}")
    point_site_at(vid)
    fix_broadcast(token, b)
    fix_embed(token, vid)

    if state != "live":
        error(f"The cam is OFFLINE or stuck: live {vid} is '{state}', not streaming to viewers. "
              "If it stays like this, power cycle the cam.")
        return 1
    print("Cam is live, embeddable and on the site.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
