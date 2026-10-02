# Design plan

One sentence: build a window onto the spot with an instrument panel under it,
and let everything else get out of the way.

---

## 1. Colour

Six values. The dark is not black, and the accent is rationed.

| Token | Hex | Role |
|---|---|---|
| `--surface` | `#FFFFFF` | The page. Tarifa whitewash. Nothing else is a background. |
| `--ink` | `#101619` | All primary text. A cool near-black, the colour of wet slate, never pure `#000`. |
| `--sea` | `#0B2B33` | The webcam band and the footer. Deep Atlantic off Los Lances, not a neutral dark grey. This is the one colour that makes the page recognisable. |
| `--mute` | `#4F6166` | Secondary text and the honesty line. 7.1:1 on white, chosen so wind data stays readable in hard sun. |
| `--sand` | `#E3DED3` | Hairlines and the directory rules. Warm, so the page never feels like a dashboard. |
| `--accent` | `#00C1B0` | Harlem teal. **Two uses only**, listed below. |

Contrast: ink on surface 16.8:1, mute on surface 7.1:1, surface on sea 14.2:1,
accent on sea 6.6:1, ink on accent 8.6:1. All above AA, the wind figures well above.

**The accent budget, spent in full**
1. The live dot, and only when the cam is genuinely live.
2. The WhatsApp button, the one action the site is asking for.

Everything else that is teal today loses it: the top rule, the status pill, the
Levante tag, the event date, the Details link, the sponsor line, text selection,
the partner hover. Dropping teal from nine places is what will make the two
remaining uses mean something.

## 2. Type

**Familjen Grotesk** (Google Fonts, variable, weights 400 and 600), one family,
two weights, nothing else.

Why this one: it is a Northern European grotesque with tight apertures and
narrow sidebearings, which is what keeps 13px legible on a phone in direct sun.
Its uppercase is compact enough to sit beside the Harlem stencil wordmark
without competing, and its lowercase has enough character that the page does not
read as a default. It is not Inter, Roboto, Poppins, Montserrat or Space Grotesk,
and it is not Archivo, which is the font I reached for the first time out of
habit. If its tabular figures turn out to be unreliable I will set the wind
readout on a fixed `ch` grid rather than add a second family.

**Scale** (mobile → desktop, all line heights unitless)

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Wind reading | 76 → 104 | 600 | 0.9 | -0.035em |
| Section title | 26 → 36 | 600 | 1.1 | -0.02em |
| Partner name, event title | 17 → 18 | 600 | 1.25 | -0.01em |
| Body | 16 → 17 | 400 | 1.5 | 0 |
| Secondary, meta, honesty line | 14 | 400 | 1.4 | 0 |
| Directory gutter label | 13 | 600 | 1.2 | 0 |

Sentence case throughout. The only uppercase left on the page is inside the
Harlem wordmark itself. Measure capped at 62 characters.

## 3. Layout

**Grid.** 16px gutters on mobile, 40px on desktop, content capped at 1180px.
Everything hangs off one left edge except the webcam, which has no gutters at all.

**Spacing scale.** 4 8 12 16 24 32 48 64 96. Sections do not share a value:
the cam gets 0, the instrument strip 20/28, the directory 64/96, the join block
40/56. Space is given to what matters.

**Mobile, 390**

```
┌────────────────────────────────┐
│ Harlem Clubhouse      Balneario│  52px, hairline under
├────────────────────────────────┤
│                                │
│   THE WINDOW                   │  full bleed, zero gutters
│   4:3 on mobile, more sky      │  photo or live video, never a box
│                                │
│ ● Live    Balneario, Tarifa    │  one line, set on the image, bottom left
├────────────────────────────────┤
│ 18  knots                      │  the reading, hanging on the left edge
│     gusts 27   ENE 68°  Levante│  satellites on its baseline
│ Model data, not a station.     │
│ Windguru   Windfinder          │
├────────────────────────────────┤
│ Next up                        │  no box, no border
│ Sat 15 Nov, 17:30              │
│ Sunset session                 │
├────────────────────────────────┤
│ Tarifa by the Clubhouse        │
│ ──────────────────────────────  │
│ Ride    [logo] Harlem          │  category in the gutter, once per group
│                The gear we ride│
│ ──────────────────────────────  │
│ Gear    [logo] Lorenzo Casati  │
│ ...                            │
├────────────────────────────────┤
│ Join the family.               │
│ Sessions, wind calls, one group│
│ [ Join on WhatsApp ]           │  the only teal object on the page
│ Follow on Instagram            │
├────────────────────────────────┤
│ sea coloured footer            │
└────────────────────────────────┘
```

**Desktop, 1440**

```
┌──────────────────────────────────────────────────────────────┐
│ Harlem Clubhouse                                    Balneario│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│           THE WINDOW, edge to edge, 2.4:1                    │
│                                                              │
│ ● Live   Balneario Beach Club, Tarifa                        │
├──────────────────────────────────────────────────────────────┤
│ 18 knots      gusts 27    ENE 68°   Levante                  │
│               Model data, not a station.  Windguru Windfinder│
├──────────────────────────────────────────────────────────────┤
│ Next up          Sat 15 Nov, 17:30                           │
│                  Sunset session, Balneario Beach Club        │
├──────────────────────────────────────────────────────────────┤
│ Tarifa by the Clubhouse                                      │
│ ──────────────────────────────────────────────────────────── │
│ Ride     [logo] Harlem Kitesurfing      The gear we ride.    │
│ ──────────────────────────────────────────────────────────── │
│ Gear     [logo] Lorenzo Casati Shop     Test, rent, talk gear│
│ ──────────────────────────────────────────────────────────── │
│ Eat      [logo] Balneario Beach Club    Our home on the beach│
│          [logo] Dunna Playa Tarifa      Restaurant and pool  │
│ ──────────────────────────────────────────────────────────── │
│ Night    [logo] La Teteria de Tarifa    Cocktails, old town  │
│          [logo] Mombassa                Where the session ends│
│ ...                                                          │
├──────────────────────────────────────────────────────────────┤
│ Join the family.                        [ Join on WhatsApp ] │
│ Sessions, events and wind calls.        Follow on Instagram  │
├──────────────────────────────────────────────────────────────┤
│ sea coloured footer                                          │
└──────────────────────────────────────────────────────────────┘
```

**The directory.** No cards. A list where the category lives once in a left
gutter and holds its group, the way a chart legend or a beach club menu board
works. It uses the grouping that already exists in `config.js` and that the
current grid throws away. Rows are separated by a `--sand` hairline, nothing else.
Logos keep the normalised canvas, shown at full opacity, 120px wide.

## 4. The one memorable element

The window and its instrument.

The webcam runs edge to edge with no frame, no card, no radius and no overlay
except a single line set on the image itself: a dot, the state, the place.
Directly under it, with no section break, sits the wind reading at 76 to 104px
hanging off the same left edge, gusts and bearing on its baseline. The two read
as one object: look through the window, read the instrument.

When there is no video the window does not become an empty black box. It shows a
real photograph of the spot, `Harlem Clubhouse_215.jpg` from the parent folder,
the teal Balneario structure with a kite over Los Lances, darkened with a flat
scrim so the one line of text stays readable. **This needs your approval**: it
means copying two or three of your own photographs into `/brand/photos/`.
If you would rather not, the fallback is flat `--sea` with the same single line,
and no gradient.

The direction indicator is drawn as a thin chart rose: a 1px circle with a single
radial tick at the true bearing and a hairline north mark, not an icon-library
arrow. It is the only drawn mark on the page.

## 5. Motion

None on scroll. Nothing fades, nothing slides. One moment only: the live dot
breathes, and only in the live state, removed entirely under
`prefers-reduced-motion`. Hover states are a colour change on links, nothing on cards.

---

## 6. Challenging the plan

I asked of every choice: would I produce this for any other site with a similar brief?

| Choice | Verdict | What I changed |
|---|---|---|
| Near-black band | Yes, it is the default. | Changed to `--sea #0B2B33`, taken from the water at Los Lances. The dark is now specific to this place. |
| Archivo kept | Yes. It was my first pick and it is everywhere. | Changed to Familjen Grotesk, chosen for small-size legibility in sun and for not being a habit. |
| Uppercase headings | Yes, every brand site does this. | Dropped entirely. The only uppercase left is the logo. |
| Three stat tiles for wind, knots / gusts / direction | Yes, that is the standard dashboard row. | Changed to one dominant reading with satellites on its baseline. Not three equal boxes. |
| Teal rule across the top | Yes, pure decoration. | Removed. It was costing one third of the accent budget. |
| Partners in two columns of cards | Yes, same wall, fewer columns. | Changed to the gutter list, which uses the categories as structure instead of as labels. |
| Hairline rules | Partly. A page of hairlines is the broadsheet default. | Kept only inside the directory, where they separate rows of an actual list. No rule under section titles, none across the page. |
| "Live" as a tracked all-caps label | Yes, it is the tell I listed in the audit. | Sentence case, next to the dot. |
| An arrow icon for direction | Yes, every weather widget. | Drawn as a chart rose with a real bearing in degrees. |

Two risks I am carrying knowingly:

1. **Familjen Grotesk.** If its tabular figures are unreliable the wind readout
   will twitch. Fallback is a fixed `ch` grid, decided during the build, not a
   second font.
2. **The photograph.** It is the thing that will make the page feel like Tarifa,
   and it is the one item I cannot do without your go-ahead, because it means
   putting your photos in the repo.

---

## 7. What I need from you

1. Approve or reject the plan.
2. Say yes or no to the photograph in the empty webcam state.
3. Confirm the two accent uses are the right two: live dot and WhatsApp button.

Nothing has been implemented. `index.html`, `style.css`, `main.js` and
`config.js` are untouched.
