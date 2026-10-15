"""One time: let the cam watch manage the Harlem Clubhouse Tarifa live.

Run it yourself on the Mac:
    python3 tools/yt-auth.py ~/Downloads/client_secret_XXXX.json

It opens Google sign in in the browser. Pick the account that owns the
Harlem Clubhouse Tarifa channel, allow access, and the script saves three
GitHub secrets (YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN) with the
gh command line. Nothing is printed and nothing is written to disk.
Standard library only.
"""

import http.server
import json
import secrets
import subprocess
import sys
import urllib.parse
import webbrowser

SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl"
REPO = "naick1994/harlem-clubhouse-tarifa"
PORT = 8723


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python3 tools/yt-auth.py <client_secret JSON from Google Cloud>")
    conf = json.load(open(sys.argv[1]))
    conf = conf.get("installed") or conf.get("web")
    client_id, client_secret = conf["client_id"], conf["client_secret"]
    redirect = f"http://127.0.0.1:{PORT}/"
    state = secrets.token_urlsafe(16)

    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
        "client_id": client_id, "redirect_uri": redirect, "response_type": "code",
        "scope": SCOPE, "access_type": "offline", "prompt": "consent", "state": state,
    })

    got = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if q.get("state", [""])[0] == state and "code" in q:
                got["code"] = q["code"][0]
                msg = "Done. You can close this tab and go back to the terminal."
            else:
                msg = "Something went wrong, run the script again."
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(msg.encode())

        def log_message(self, *a):
            pass

    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
    print("Opening Google sign in. Choose the account of the Harlem Clubhouse Tarifa channel.")
    webbrowser.open(url)
    while "code" not in got:
        server.handle_request()

    data = urllib.parse.urlencode({
        "code": got["code"], "client_id": client_id, "client_secret": client_secret,
        "redirect_uri": redirect, "grant_type": "authorization_code",
    }).encode()
    # the Mac's curl, not urllib: a python.org Python often has no
    # certificates installed. The form goes in on stdin, never on the
    # command line, so the secret does not show up in the process list.
    out = subprocess.run(["curl", "-s", "--data-binary", "@-", "https://oauth2.googleapis.com/token"],
                         input=data, capture_output=True, check=True)
    tokens = json.loads(out.stdout)
    if "refresh_token" not in tokens:
        sys.exit("Google gave no refresh token. Run the script again.")

    for name, value in (("YT_CLIENT_ID", client_id), ("YT_CLIENT_SECRET", client_secret),
                        ("YT_REFRESH_TOKEN", tokens["refresh_token"])):
        subprocess.run(["gh", "secret", "set", name, "--repo", REPO], input=value.encode(), check=True)
    print("Saved on GitHub. The cam watch can now manage the live.")


if __name__ == "__main__":
    main()
