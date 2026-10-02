# Audit of the current design

Written against the 12 screenshots in `/design/before/`, captured at 390x844 and
1440x900 for every webcam state, with and without an upcoming event.

The verdict in one line: the page is competent, readable and completely
anonymous. Swap the logo and it could sell dental software. Nothing on it comes
from Tarifa, from wind, or from a beach club. Below is what is wrong, by section.

---

## 1. The webcam, which is supposed to be the whole point

| # | Problem | Where |
|---|---------|-------|
| 1.1 | A teal radial gradient is painted behind the empty states. Decorative glow, the most common generated-page tell, and it makes a window look like a backlit television. | `.cam__frame[data-state="soon"]::before` |
| 1.2 | On desktop the black 16:9 box sits inside a 1120px wrapper inside a black band. Frame and band are the same colour, so the hero reads as a void with 160px of dead black either side, not as a window. | `.cam .wrap`, `.cam__frame` |
| 1.3 | A 1px white border is drawn around the thing that should have no frame at all. | `.cam__frame` at `min-width: 720px` |
| 1.4 | The state is a pill badge with `border-radius: 999px`. Pill badges are decoration pretending to be information. | `.cam__status` |
| 1.5 | The place name is a tracked-out all-caps eyebrow, 11px at `letter-spacing: .14em`. It wraps onto two lines at 390px, which is the width most people will see. | `.cam__place` |
| 1.6 | The empty states are centre aligned while every other block on the page is left aligned. Two alignment systems, one page. | `.cam__card` |
| 1.7 | A 16:9 box is held open even when there is no video in it. On desktop that is roughly 450px of empty black carrying three short lines. | `.cam__frame` |
| 1.8 | The CTA is a teal rounded rectangle floating in the middle of that emptiness, anchored to nothing. | `.cam__card .btn` |

## 2. The wind, which is the second reason anyone opens the page

| # | Problem | Where |
|---|---------|-------|
| 2.1 | It is the most squeezed block on the page: 34px of vertical padding against 88px for the partner wall. The page spends its space on the least useful section. | `.wind` vs `.tarifa` |
| 2.2 | Four unrelated type treatments sit in one row: 64px number, 18px grey unit, 15px "Gusts 30kn", 12px pill. No baseline, no hierarchy, no grid. | `.wind__speed`, `.wind__unit`, `.wind__gusts`, `.wind__name` |
| 2.3 | Figures are not tabular. The row reflows every time 15 knots becomes 9 or 22. An instrument that moves is not an instrument. | `#wind-knots`, `#wind-gusts` |
| 2.4 | Levante is a pill with a 1px border and a 999px radius. Second pill on the page. | `.wind__name` |
| 2.5 | The direction indicator is a 22px filled triangle from a generic icon vocabulary. It carries no bearing, no scale, no reference to north. | `.wind__arrow` |
| 2.6 | "WIND NOW" is another tracked all-caps eyebrow. Third one on the page. | `.section__label` |
| 2.7 | The honesty line and the forecast links are joined with a middle dot and set at 13px grey. The most credible thing on the page is styled as a disclaimer nobody reads. | `.wind__note`, `#wind-forecast` |
| 2.8 | `--color-muted #6B7572` on white is 4.6:1. Legal, but thin for a number a rider reads on a phone in hard Tarifa sun. | token |

## 3. Join the family

| # | Problem | Where |
|---|---------|-------|
| 3.1 | A 64px extra-bold uppercase headline makes this the loudest element on the page, louder than the webcam. Boldness spent in the wrong place. | `.join__title` |
| 3.2 | The block is about 320px tall and roughly 70% empty, because the section padding is applied uniformly whatever the content. | `.join` |

## 4. Next up

| # | Problem | Where |
|---|---------|-------|
| 4.1 | One event is placed in a bordered rounded box identical to a partner card. Same radius, same border, same padding. A date is not a product. | `.card`, `.event` |
| 4.2 | "NEXT UP" is the fourth tracked all-caps eyebrow. | `.section__label` |
| 4.3 | The meta row is three tracked all-caps strings in a row, with the date in teal. The accent is being used as decoration. | `.event__meta`, `.event__date` |
| 4.4 | "Details" is a bare underlined link with a 44px tap box, visually an afterthought. | `.link--arrow` |

## 5. The partner wall, the single most templated thing here

| # | Problem | Where |
|---|---------|-------|
| 5.1 | Nine identical rounded cards: same 1px border, same 4px radius, same padding, same internal order. This is the textbook generated layout. | `.partner` |
| 5.2 | Every card repeats logo, tracked all-caps category, name, one line. Nine more eyebrows stacked down the page, thirteen in total. | `.partner__category` |
| 5.3 | A hover effect on every card, border colour plus logo opacity. | `.partner:hover` |
| 5.4 | On mobile this is roughly 2400px of scrolling through nine boxes with no grouping. Nothing tells a rider that Mombassa and La Teteria are both night, or that Harlem and the shop are both gear. The categories exist in the data and are thrown away by the layout. | `.partners` |
| 5.5 | The section header puts a subtitle beside the title with a hairline under both. A subtitle under every heading and a decorative rule, two defaults in one component. | `.section__head` |
| 5.6 | Logos are normalised onto one canvas, which is right, then shown at 90% opacity on white, which makes nine brands look faded. | `.partner__logo` |

## 6. Footer

| # | Problem | Where |
|---|---------|-------|
| 6.1 | The Change The Tide logo sits directly under a line of 15px grey body copy with nothing between them. Two voices stacked without a pause. | `.footer__tagline--logo` |
| 6.2 | "Want your brand here? Let's talk." is teal, right aligned, and is the entire right column. The accent is spent on the lowest value link on the page. | `.sponsor__ask .link` |
| 6.3 | The page ends on a legal disclaimer rather than on anything about the place. | `.footer__notice` |

## 7. System wide

| # | Problem |
|---|---------|
| 7.1 | **The accent is sprayed.** Teal appears on: the top rule, the status dot, the status pill, the CTA, the Levante pill, the event date, the Details underline, the sponsor link, text selection, and the partner hover border. Ten uses. A brand colour used ten times is a background colour. |
| 7.2 | **One radius for everything.** `--radius: 4px` is applied to buttons, cards, the logo tile, the video frame and the perk strip. When every corner is the same, nothing has rank. |
| 7.3 | **Every section has the same padding and the same left edge.** 52 / 72 / 88px applied uniformly. No section earns more room than another, so the eye has no idea what matters. |
| 7.4 | **Everything shouts.** `h1, h2, h3 { text-transform: uppercase }` is global. Five uppercase extra-bold headings on one page is not confidence, it is noise. |
| 7.5 | **The typeface is a habit.** Archivo ExtraBold uppercase plus system-ui body plus a teal accent on black is the default startup kit of the last three years. |
| 7.6 | **Thirteen tracked all-caps labels** across the page: section labels, the cam place, nine partner categories, the event meta. |
| 7.7 | **Heading structure disagrees with the visuals.** A visually hidden `h2` "Live webcam" sits above a visible "Wind now" styled as a small label, so screen reader order and visual order tell different stories. |
| 7.8 | **No photography, no place.** There is not one image of Tarifa, of the water, of the club, of a kite. The page describes a beach club without ever showing one. Real photographs of the venue exist in the parent folder and are unused. |
| 7.9 | **One stray icon.** The Instagram glyph is the only icon in the design and matches nothing else in it. |
| 7.10 | **Mobile is 3,700px tall** in the full configuration, most of it the card wall, with no landmark to scroll towards. |

---

## What is worth keeping

- The logo normalisation system. Every partner logo already sits on one canvas at
  equal optical weight. That work survives the refactor unchanged.
- Full bleed webcam on mobile. The instinct was right, the execution is not.
- Everything driven from `config.js`. No change.
- The header lockup, Clubhouse next to Balneario. It says where you are.
- The honesty of "Model data, not a station." Keep the sentence, give it respect.
