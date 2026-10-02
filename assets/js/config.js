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
    title: "Tarifa Live Webcam | Harlem Clubhouse Tarifa",
    description: "Live webcam and wind from Balneario Beach Club, Tarifa. Check the conditions, join the crew, ride together."
  },

  /* ---------- 2. LINKS ---------- */
  links: {
    whatsapp: "TODO",                                              // TODO: paste the WhatsApp group invite link (https://chat.whatsapp.com/...)
    instagram: "https://www.instagram.com/harlemclubhousetarifa/",
    contactEmail: "TODO"                                           // TODO: email for sponsor requests, no "mailto:" needed
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
     matching field. Nothing else on the site needs to change. */
  webcam: {
    provider: "none",
    youtubeChannelId: "",        // preferred for YouTube: survives stream restarts
    youtubeVideoId: "",          // alternative to the channel id
    iframeUrl: "",               // generic embed url from a webcam service
    hlsUrl: "",                  // .m3u8 stream
    liveHours: { start: "07:30", end: "21:30", timezone: "Europe/Madrid" }
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
     category must be one of: Ride, Gear & Rental, Eat, Night, Compete
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
      logo: ""                                                     // TODO: add assets/img/partner-harlem.png
    },
    {
      slug: "lorenzo-casati-shop",
      name: "Lorenzo Casati Shop",
      category: "Gear & Rental",
      description: "Test, rent and talk gear in Tarifa.",
      perk: "",                                                    // TODO: confirm the perk with the shop before showing it
      url: "https://shop.lorenzocasati.com",
      logo: ""                                                     // TODO: add assets/img/partner-lorenzo-casati-shop.png
    },
    {
      slug: "balneario",
      name: "Balneario Beach Club",
      category: "Eat",
      description: "Our home on the beach.",
      perk: "",                                                    // TODO: confirm the perk with Balneario before showing it
      url: "https://www.instagram.com/balneariotarifa/",
      logo: ""                                                     // TODO: add assets/img/partner-balneario.png
    },
    {
      slug: "mombassa",
      name: "Mombassa",
      category: "Night",
      description: "Where the session ends.",
      perk: "",                                                    // TODO: confirm the perk with Mombassa before showing it
      url: "https://www.instagram.com/mombassatarifa/",
      logo: ""                                                     // TODO: add assets/img/partner-mombassa.png
    },
    {
      slug: "the-wind-games",
      name: "The Wind Games",
      category: "Compete",
      description: "Track your jumps, climb the ranking.",
      perk: "",
      url: "https://thewindgames.app",
      logo: ""                                                     // TODO: add assets/img/partner-the-wind-games.png
    }
  ],

  /* ---------- 9. FOOTER BRANDS ---------- */
  footer: {
    brands: [
      { id: "harlem", name: "Harlem", url: "https://harlemkitesurfing.com" },
      { id: "lorenzo-casati-shop", name: "Lorenzo Casati Shop", url: "https://shop.lorenzocasati.com" },
      { id: "flight-mode", name: "Flight Mode", url: "TODO" }      // TODO: paste the Flight Mode url
    ]
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
    header: {
      logoAlt: "Harlem Clubhouse Tarifa",
      logoFallback: "HARLEM CLUBHOUSE TARIFA",
      instagram: "Instagram"
    },
    webcam: {
      liveLabel: "LIVE · Balneario Beach Club, Tarifa",
      frameTitle: "Live webcam, Balneario Beach Club, Tarifa",
      soonTitle: "Live cam coming soon.",
      soonText: "Join the crew and be the first to know when it's live.",
      soonButton: "Join on WhatsApp",
      offlineTitle: "The cam is sleeping.",
      offlineText: "Back at first light. Meanwhile, check what's next."
    },
    wind: {
      title: "Wind now",
      unit: "kn",
      gusts: "Gusts",
      note: "Model data, not a station.",
      forecastLabel: "Full forecast:",
      windguru: "Windguru",
      windfinder: "Windfinder",
      levante: "Levante",
      poniente: "Poniente",
      directionPrefix: "Wind from"
    },
    join: {
      title: "Join the crew.",
      text: "Sessions, events, challenges and wind calls. All in one WhatsApp group.",
      primary: "Join on WhatsApp",
      secondary: "Follow @harlemclubhousetarifa"
    },
    events: {
      title: "Next up",
      details: "Details",
      emptyTitle: "Next event coming soon.",
      emptyText: "Join the crew to hear first.",
      emptyButton: "Join on WhatsApp"
    },
    partners: {
      title: "Tarifa by the Clubhouse",
      subtitle: "Where we ride, eat and party."
    },
    dates: {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    footer: {
      line1: "Harlem Clubhouse Tarifa. A home for the community.",
      line2: "Change the tide.",
      sponsorLabel: "Webcam powered by",
      sponsorEmpty: "Want your brand here? Let's talk.",
      notice: "Live panoramic view. Nothing is recorded.",
      privacy: "Privacy"
    }
  }
};
