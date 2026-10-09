/* ============================================================
   HARLEM CLUBHOUSE TARIFA - SITE CONFIG
   This is the only file you need to edit.
   Everything on the site is driven from here: links, webcam,
   wind, events, partners, footer and every visible word.
   Rules: keep the quotes, keep the commas, never remove a key.
   ============================================================ */

window.SITE = {

  /* ---------- 1. SITE ---------- */
  site: {
    title: "Balneario Live Webcam | Harlem Clubhouse Tarifa",
    description: "Live webcam and wind from Balneario Beach Club, Tarifa. Check the conditions, join the family, ride together."
  },

  /* ---------- 2. LINKS ---------- */
  links: {
    whatsapp: "TODO",                                              // TODO: paste the WhatsApp group invite link (https://chat.whatsapp.com/...)
    instagram: "https://www.instagram.com/harlemclubhouse.tarifa/",
    contactEmail: "TODO"                                           // TODO: email for sponsor requests, no "mailto:" needed
  },

  /* ---------- 2b. VENUE ----------
     The house the Clubhouse lives in. Its logo sits next to ours in the
     header. Leave logo: "" to show only the Clubhouse logo. */
  venue: {
    name: "Balneario Beach Club Tarifa",
    url: "https://balneariobeachclubtarifa.com/",
    logo: "assets/img/logo-balneario.png"
  },

  /* ---------- 2c. MAIN BUTTON ----------
     Where every main button on the site points.
     "instagram" while the WhatsApp group is not ready.
     Change to "whatsapp" once links.whatsapp above is filled in. */
  cta: {
    target: "instagram"
  },

  /* ---------- 2d. SECTIONS ----------
     false hides a whole section, nothing is lost. Set one to true and
     it comes back exactly as it was. */
  sections: {
    wind: false,
    join: false,
    events: false,
    partners: true
  },

  /* ---------- 3. LOCATION (used by the wind) ---------- */
  location: {
    name: "Balneario Beach Club, Tarifa",
    lat: 36.0110,                                                  // TODO: verify exact coordinates of the cam spot
    lon: -5.6080
  },

  /* ---------- 4. FORECAST LINKS ---------- */
  forecast: {
    windguru: "TODO",                                              // TODO: paste the Windguru spot URL
    windfinder: "TODO"                                             // TODO: paste the Windfinder spot URL
  },

  /* ---------- 5. WEBCAM ----------
     provider: "none" | "youtube" | "iframe" | "hls"
     Switch the cam live by changing provider and filling the
     matching field. Nothing else on the site needs to change.
     "hls" is our own relay (cam-relay/): it tries webrtcUrl first,
     falls back to hlsUrl, and shows the head count from viewersUrl.
     None of these addresses carry the cam password, they are public. */
  webcam: {
    provider: "youtube",                                   // set to "hls" once the relay on cam.clubhousetarifa.com is up
    youtubeChannelId: "",                              // preferred for YouTube: survives stream restarts
    youtubeVideoId: "QqzfEnuAec4",   // alternative to the channel id
    iframeUrl: "",               // generic embed url from a webcam service
    hlsUrl: "https://cam.clubhousetarifa.com/live/balneario/index.m3u8",   // .m3u8 stream
    webrtcUrl: "https://cam.clubhousetarifa.com/live/balneario/whep",         // WHEP address, under a second of delay
    viewersUrl: "https://cam.clubhousetarifa.com/presence",                    // head counter, leave "" to hide it
    overlayLogos: [                                       // logos laid over the live picture, [] for none
      "assets/img/logo-clubhouse-white.png",
      "assets/img/logo-balneario-white.png"
    ],
    overlayPosition: "top-left",                          // "top-left" | "top-right" | "bottom-left" | "bottom-right"
    poster: "assets/img/cam-poster-1600.jpg",   // the photo the window shows while there is no video
    liveHours: { start: "", end: "", timezone: "Europe/Madrid" }   // empty start and end: live 24/7
  },

  /* ---------- 6. WIND ---------- */
  wind: {
    embedHtml: "",               // optional: paste a widget or partner station embed here to replace the numbers
    refreshMinutes: 10,
    levante: { from: 45, to: 135 },
    poniente: { from: 225, to: 315 }
  },

  /* ---------- 7. EVENTS ----------
     Only the next upcoming event is shown. Past events disappear
     on their own, you can leave them in the list.
     date: "YYYY-MM-DD", time: "HH:MM" (24h, Tarifa time)
     url and image are optional, leave "" if you have none. */
  events: [
    {
      title: "TODO: first Clubhouse session",                      // TODO: replace this example event
      date: "2026-11-15",
      time: "16:00",
      place: "Balneario Beach Club, Tarifa",
      description: "Example event. Replace it with the real one.",
      url: "",
      image: ""
    }
  ],

  /* ---------- 8. PARTNERS ----------
     category is a short label: Ride, Gear Rent & Buy, Eat, Night, Train, Travel, Compete
     perk is optional, leave "" to show nothing.
     Never write a perk or a discount code you have not agreed with the partner.
     logo: path to a file in assets/img/, leave "" for the text badge. */
  partners: [
    {
      slug: "harlem",
      name: "Harlem Kitesurfing",
      category: "Ride",
      description: "The gear we ride.",
      perk: "",                                                    // keep empty, no discount code on the Harlem card
      url: "https://harlemkitesurfing.com",
      logo: "assets/img/partners/harlem.png"
    },
    {
      slug: "lorenzo-casati-shop",
      name: "Lorenzo Casati Shop",
      category: "Gear, Rent & Buy",
      description: "Test, rent and buy gear in Tarifa.",
      perk: "",                                                    // TODO: confirm the perk with the shop before showing it
      url: "https://shop.lorenzocasati.com/",
      logo: "assets/img/partners/lorenzo-casati-shop.png"
    },
    {
      slug: "balneario",
      name: "Balneario Beach Club",
      category: "Eat",
      description: "Our home on the beach. Eat, chill, drink.",
      perk: "",                                                    // TODO: confirm the perk with Balneario before showing it
      url: "https://balneariobeachclubtarifa.com/",                // TODO: their site answered an error on 2 Oct, check it is back up
      logo: "assets/img/partners/balneario.png"
    },
    {
      slug: "dunna",
      name: "Dunna Playa Tarifa",
      category: "Eat",
      description: "Restaurant and pool facing the sea.",
      perk: "",
      url: "https://dunnaplayatarifa.com/",
      logo: "assets/img/partners/dunna.png"
    },
    {
      slug: "la-teteria",
      name: "La Teteria de Tarifa",
      category: "Night",
      description: "Cocktails and a patio in the old town.",
      perk: "",
      url: "https://lateteriadetarifa.com/",
      logo: "assets/img/partners/la-teteria.png"
    },
    {
      slug: "mombassa",
      name: "Mombassa",
      category: "Night",
      description: "Where the session ends.",
      perk: "",                                                    // TODO: confirm the perk with Mombassa before showing it
      url: "https://mombassatarifa.com/",
      logo: "assets/img/partners/mombassa.png"
    },
    {
      slug: "aura-sport-club",
      name: "Aura Sport Club",
      category: "Train",
      description: "Training, wellness and padel.",
      perk: "",
      url: "https://aurasportclub.es/",
      logo: "assets/img/partners/aura.svg"
    },
    {
      slug: "tribala",
      name: "Tribala",
      category: "Travel",
      description: "Sport trips with your tribe.",
      perk: "",
      url: "https://tribala.travel/",
      logo: "assets/img/partners/tribala.svg"
    },
    {
      slug: "the-wind-games",
      name: "The Wind Games",
      category: "Compete",
      description: "Track your jumps, climb the ranking.",
      perk: "",
      url: "https://thewindgames.app",
      logo: "assets/img/partners/the-wind-games.svg"
    }
  ],

  /* ---------- 8b. PHOTOS ----------
     A quiet strip of real photos near the bottom. Drop files in
     assets/img/photos/ and list them here. Empty array hides the band. */
  photos: [
    { src: "assets/img/photos/clubhouse-01.jpg", alt: "The Clubhouse seen from the sand, kite in the air", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-02.jpg", alt: "A rider with a glass of rose at the Clubhouse", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-03.jpg", alt: "Balneario lanyards on a table", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-04.jpg", alt: "The crew at a table facing the water", w: 900, h: 671 },
    { src: "assets/img/photos/clubhouse-05.jpg", alt: "Walking the kite down the beach", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-27.jpg", alt: "Sunset crowd under the Balneario sign", w: 768, h: 768 },
    { src: "assets/img/photos/clubhouse-06.jpg", alt: "The Clubhouse from the beach path", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-07.jpg", alt: "Two of the crew on the terrace", w: 600, h: 900 },
    { src: "assets/img/photos/clubhouse-08.jpg", alt: "Board, bag and shirt on the bar", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-28.jpg", alt: "The DJ and a full house at the bar", w: 768, h: 768 },
    { src: "assets/img/photos/clubhouse-09.jpg", alt: "Glasses raised at the Clubhouse", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-10.jpg", alt: "Harlem flag beside the Balneario sign", w: 600, h: 900 },
    { src: "assets/img/photos/clubhouse-11.jpg", alt: "The terrace with the Clubhouse banners", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-12.jpg", alt: "A rider still in the wetsuit, glass in hand", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-13.jpg", alt: "A cold beer at the bar", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-14.jpg", alt: "The room watching the session", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-15.jpg", alt: "Kites laid out on the sand", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-16.jpg", alt: "Faces of the Clubhouse", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-17.jpg", alt: "A board waiting by the window", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-18.jpg", alt: "Talking at the bar", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-19.jpg", alt: "The Balneario sign above Los Lances", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-20.jpg", alt: "Hoodies at the door of the beach club", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-21.jpg", alt: "Gear and a quiet moment on the deck", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-22.jpg", alt: "The crowd at the Clubhouse", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-23.jpg", alt: "Harlem flag on the dune", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-24.jpg", alt: "A seat in the sun after the session", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-25.jpg", alt: "The DJ and the kit behind the bar", w: 900, h: 600 },
    { src: "assets/img/photos/clubhouse-26.jpg", alt: "Two riders toasting after the session", w: 900, h: 600 }
  ],

  /* ---------- 8c. CLOSING IMAGE ----------
     One wide photograph just before the footer. Leave src: "" to hide it. */
  closing: {
    src: "assets/img/tarifa-tower.jpg",
    alt: "A kiter above the old tower at Tarifa"
  },

  /* ---------- 9. FOOTER BRANDS ---------- */
  footer: {
    privacyUrl: "",                                                // set to "privacy.html" to show the privacy link in the footer again
    taglineLogo: "assets/img/change-the-tide-white.png",           // leave "" to show the words instead
    brands: []                                                   // add { id, name, url } here to show links in the footer
  },

  /* ---------- 10. WEBCAM SPONSOR ----------
     null = show the "want your brand here" line.
     To add a sponsor:
     sponsor: { name: "Brand", logo: "assets/img/sponsor.png", url: "https://..." } */
  sponsor: null,

  /* ---------- 11. ANALYTICS ----------
     Plausible only, no cookies. Leave "" to load nothing at all. */
  analytics: {
    plausibleDomain: ""                                            // TODO: your domain, for example "clubhousetarifa.com"
  },

  /* ---------- 12. TEXTS ----------
     Every visible word on the site. Translate here later. */
  copy: {
    buttons: {
      whatsapp: "Join on WhatsApp",
      instagram: "Follow on Instagram"
    },
    header: {
      logoAlt: "Harlem Clubhouse Tarifa",
      logoFallback: "HARLEM CLUBHOUSE TARIFA",
      instagram: "Instagram"
    },
    notice: {
      title: "Expert riders only",
      short: "Offshore wind, no rescue service. Know your level.",
      text1: "This is a demanding spot for experienced riders. With Levante the wind is offshore and there is no rescue service: if you get in trouble, the wind takes you out to sea. Make sure your level is appropriate for the conditions and for the spot before entering the water.",
      text2: "Please follow the spot's riding rules. Respect professional riders who are training on the spot, and give them priority when needed.",
      text4: "We rescue each other. If you can't provide kite, board and rider rescue, this is not your spot.",
      text3: "Ride safe. Respect the spot and the local community."
    },
    webcam: {
      statusLive: "Live",
      statusSoon: "Coming soon",
      statusSleeping: "Sleeping",
      statusConnecting: "Connecting",
      statusRetrying: "Reconnecting",
      statusDown: "Offline",
      downText: "The cam is offline. Back soon.",
      loadingText: "Loading the live",
      viewersOne: "1 watching",
      viewersMany: "{n} watching",
      fullscreen: "Full screen",
      frameTitle: "Live webcam, Balneario Beach Club, Tarifa",
      soonTitle: "Live cam coming soon.",
      soonText: "Join the family and be the first to know when it's live.",
      offlineTitle: "The cam is sleeping.",
      offlineText: "Back at first light. Meanwhile, check what's next."
    },
    wind: {
      title: "Wind now",
      unit: "kn",
      gusts: "gusts",
      note: "Model data, not a station.",
      forecastLabel: "Full forecast",
      windguru: "Windguru",
      windfinder: "Windfinder",
      levante: "Levante",
      poniente: "Poniente",
      directionPrefix: "Wind from"
    },
    join: {
      title: "Join the family.",
      text: "Sessions, events, challenges and wind calls. All in one WhatsApp group.",
      secondary: "Follow @harlemclubhouse.tarifa"
    },
    events: {
      title: "Next up",
      details: "Details",
      emptyTitle: "Next event coming soon.",
      emptyText: "Join the family to hear first."
    },
    partners: {
      title: "Tarifa by the Clubhouse",
      subtitle: "Where we ride, train, eat and party."
    },
    dates: {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    photos: {
      close: "Close",
      openHint: "Open photo"
    },
    footer: {
      line1: "Harlem Clubhouse Tarifa. A home for the kite community.",
      line2: "Change the tide.",
      sponsorLabel: "Webcam powered by",
      sponsorEmpty: "Want your brand here? Let's talk.",
      notice: "Live panoramic view. Nothing is recorded.",
      privacy: "Privacy",
      credit: "Built and developed by Nicholas Baruffaldi"
    }
  }
};
