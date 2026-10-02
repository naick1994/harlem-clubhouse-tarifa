# Harlem Clubhouse Tarifa

Live webcam, wind and crew page for Harlem Clubhouse Tarifa at Balneario Beach Club.

Plain HTML, CSS and JavaScript. No build step, no npm, no framework.
**Everything you edit lives in one file: `assets/js/config.js`.**

---

## 1. Edit the site

Open `assets/js/config.js` in any text editor. Keep the quotes and the commas.
Anything marked `TODO` still needs a real value.

### Links

```js
links: {
  whatsapp: "https://chat.whatsapp.com/XXXXXXXXXXXX",
  instagram: "https://www.instagram.com/harlemclubhousetarifa/",
  contactEmail: "hola@clubhousetarifa.com"
}
```

### Events

Only the next upcoming event is shown. Old events disappear by themselves, you can leave
them in the list. `url` and `image` are optional, leave `""` if you have none.

```js
events: [
  {
    title: "Sunset session",
    date: "2026-10-18",
    time: "17:30",
    place: "Balneario Beach Club, Tarifa",
    description: "Meet at the Clubhouse, ride together until dark.",
    url: "",
    image: ""
  }
]
```

### Partners

`category` must be one of: `Ride`, `Gear & Rental`, `Eat`, `Night`, `Compete`.
Cards appear in the order you write them. `perk` is optional, leave `""` to show nothing.

```js
{
  slug: "mombassa",
  name: "Mombassa",
  category: "Night",
  description: "Where the session ends.",
  perk: "Free shot with your Clubhouse wristband.",
  url: "https://www.instagram.com/mombassatarifa/",
  logo: "assets/img/partner-mombassa.png"
}
```

Never write a perk or a discount code you have not agreed with the partner.
The Harlem card never carries a discount code.

### Texts

Every visible word is in the `copy` block at the bottom of `config.js`.
Change a word there and it changes on the site. To make a Spanish version later,
copy that block and translate it.

---

## 2. Switch the webcam on

The site works and looks finished without a cam. When the cam is ready, change
`webcam` in `config.js`. Nothing else needs to change.

**YouTube channel (recommended).** The embed keeps working even when the stream
restarts, because it follows the channel and not a single video.

```js
webcam: {
  provider: "youtube",
  youtubeChannelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
  youtubeVideoId: "",
  iframeUrl: "",
  hlsUrl: "",
  liveHours: { start: "07:30", end: "21:30", timezone: "Europe/Madrid" }
}
```

**A webcam service that gives you an embed link.**

```js
webcam: {
  provider: "iframe",
  youtubeChannelId: "",
  youtubeVideoId: "",
  iframeUrl: "https://player.example.com/embed/balneario",
  hlsUrl: "",
  liveHours: { start: "07:30", end: "21:30", timezone: "Europe/Madrid" }
}
```

**A direct stream (.m3u8 link).**

```js
webcam: {
  provider: "hls",
  youtubeChannelId: "",
  youtubeVideoId: "",
  iframeUrl: "",
  hlsUrl: "https://stream.example.com/balneario/index.m3u8",
  liveHours: { start: "07:30", end: "21:30", timezone: "Europe/Madrid" }
}
```

`liveHours` are Tarifa hours. Outside them the page shows "The cam is sleeping."
and loads no video at all. Set `start: "00:00"` and `end: "23:59"` to stay live all day.

To turn the cam off again, set `provider: "none"`.

---

## 3. Add a partner logo

1. Save the logo as PNG or SVG, transparent background, around 200 px wide.
2. Put it in `assets/img/` and name it `partner-<slug>.png`, for example `partner-balneario.png`.
3. In `config.js`, set `logo: "assets/img/partner-balneario.png"` on that partner.

Leave `logo: ""` and the card shows a clean text badge instead. Same idea for the
webcam sponsor logo in the `sponsor` block.

---

## 4. Run it on your computer

Open Terminal, go to this folder and run:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Stop it with `Ctrl + C`.

Opening `index.html` by double click also works, but the wind block needs the
local server to load.

---

## 5. Where the site lives

The site is online at **https://harlem.clubhousetarifa.com**, hosted on GitHub Pages
from the repository `naick1994/harlem-clubhouse-tarifa`. Every push to the `main`
branch updates the live site in about a minute.

The domain `clubhousetarifa.com` is registered at GoDaddy. The subdomain is one
DNS record: `CNAME  harlem  ->  naick1994.github.io`. The `CNAME` file in this
folder tells GitHub which domain to answer on, so do not delete it.

### If you ever move to Cloudflare Pages

1. Push this folder to a GitHub repository.
2. Go to Cloudflare, Workers and Pages, **Create**, **Pages**, **Connect to Git**.
3. Pick the repository.
4. Framework preset: **None**. Build command: **leave empty**. Output directory: **/**
5. **Save and Deploy**. You get a `*.pages.dev` address in about a minute.
6. Custom domain: open the project, **Custom domains**, **Set up a domain**, type your
   domain, and follow the DNS step Cloudflare shows you.

Every time you push a change to GitHub, the site updates by itself.

Netlify and GitHub Pages work the same way: no build command, publish the root folder.

---

## 6. Before going live

- [ ] `links.whatsapp` points to the real WhatsApp group
- [ ] `links.contactEmail` is a real inbox
- [ ] `location.lat` and `location.lon` match the cam spot
- [ ] `forecast.windguru` and `forecast.windfinder` point to the Tarifa spot
- [ ] Footer brand links are complete, Flight Mode included
- [ ] Partner perks agreed with each partner, or left empty
- [ ] Partner logos added
- [ ] Example event replaced with a real one
- [ ] `privacy.html` reviewed by someone legal, company name and address filled in
- [ ] `analytics.plausibleDomain` set, or left empty on purpose
- [x] Open Graph image and URL updated with the real domain in `index.html`

---

## Files

```
index.html          the page
privacy.html        privacy notice
assets/css/style.css   colours and fonts at the top
assets/js/config.js    the only file you edit
assets/js/main.js      the logic, leave it alone
assets/img/            logos, favicon, social image
brand/                 source brand files
```
