---
version: alpha
name: Trade Check
colors:
  bg-go: "#071A10"
  bg-wait: "#1C1204"
  bg-stop: "#1F0705"
  go: "#3DF28A"
  wait: "#FFB01F"
  stop: "#FF4B3E"
  face: "#182420"
  face-wait: "#2A1E0C"
  face-stop: "#2E100D"
  hinge: "#050807"
  text: "#F2F5F3"
  text-muted: "#93A39B"
  well: "rgba(255, 255, 255, 0.06)"
  edge: "rgba(255, 255, 255, 0.16)"
  on-signal: "#07110B"
typography:
  display:
    fontFamily: '"DIN Condensed", "Bahnschrift Condensed", Bahnschrift, "Arial Narrow", sans-serif'
    fontSize: clamp(96px, 26vw, 260px)
    fontWeight: 700
    lineHeight: 1
    textTransform: uppercase
  figures:
    fontFamily: '"DIN Alternate", Bahnschrift, system-ui, sans-serif'
    fontVariantNumeric: tabular-nums
    fontWeight: 700
  countdown:
    fontFamily: '"DIN Condensed", "Bahnschrift Condensed", Bahnschrift, "Arial Narrow", sans-serif'
    fontSize: clamp(56px, 14vw, 96px)
    fontWeight: 700
  heading:
    fontFamily: '"DIN Condensed", "Bahnschrift Condensed", Bahnschrift, "Arial Narrow", sans-serif'
    fontSize: 30px
    fontWeight: 700
    textTransform: uppercase
    letterSpacing: 0.02em
  body:
    fontFamily: '"Helvetica Neue", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: 17px
    lineHeight: 1.5
  scale:
    small: 15px
    body: 17px
    large: 21px
    heading: 30px
    amount: 34px
rounded:
  tile: 10px
  control: 6px
  lamp: 50%
spacing:
  unit: 8px
  gutter: 20px
  section: 40px
  column: 1240px
components:
  flap-tile:
    faceColor: "{colors.face}"
    hingeColor: "{colors.hinge}"
    rounded: "{rounded.tile}"
    gap: clamp(6px, 1.5vw, 12px)
    blankOpacity: 0.45
    flipDuration: 160ms per half
  dial:
    trackColor: "{colors.face}"
    fillColor: signal
    needleColor: "{colors.text}"
    strokeWidth: 14 for track and fill, 3 for the needle, 2 for ticks
  lamp:
    offColor: "{colors.face}"
    onColor: "{colors.stop}"
    size: 26px
    gap: 8px
    insetShadow: inset 0 2px 5px rgba(0, 0, 0, 0.6)
    ring: 0 0 0 1px {colors.edge}
  bar:
    height: 24px
    rounded: "{rounded.control}"
  button-primary:
    backgroundColor: signal
    textColor: "{colors.on-signal}"
    rounded: "{rounded.control}"
    padding: 16px 26px
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.text}"
    borderColor: "{colors.edge}"
  button-danger:
    textColor: "{colors.stop}"
    borderColor: "{colors.stop}"
  input:
    height: 56px, every well and select the same
    backgroundColor: "{colors.well}"
    borderColor: "{colors.edge}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
  input-focus:
    borderColor: signal
    outline: 2px solid signal
  input-error:
    borderColor: "{colors.stop}"
  field-message:
    textColor: "{colors.stop}"
---

# Trade Check

## Overview

Who opens this: someone about to place a trade, on a phone, who needs one
answer in the first two seconds. Can I trade right now?

The direction is a station annunciator seen from the platform at night. The
whole screen is the signal. The page goes deep green when you can trade, deep
amber while you wait, and deep red when you are done. The answer is a real
split-flap unit: each tile has a top and a bottom half, and the top half folds
down to reveal the next letter, the way a mechanical board changes. Under it
sit three instruments: an analog dial for today's limit with a needle, a row of
lamps for losses, and a marked bar for the week. A clock ticks in the corner.
Everything you type goes into dark wells cut into the same surface.

Third pass, 2026-10-08. The first look was plain text. The second put the
answer on a dark board inside a light page, which split the attention. Now
there is one surface and one color at a time.

## Colors

- **bg-go**, **bg-wait** and **bg-stop** are the page background, one per
  answer. The change fades over half a second.
- **go**, **wait** and **stop** are the signal, used for the flap letters, the
  reason line, the countdown, the dial fill, the primary button and focus
  rings. Only the current signal color appears, except stop, which also lights
  the loss lamps and marks errors in any state.
- **face** (and its wait and stop variants) is the flap faces, dial track, lamp
  off state and bar track, one step lighter than the page.
- **hinge** is the split line across each tile.
- **text** and **text-muted** are all other type.
- **well** and **edge** are input fills and borders. **on-signal** is text on a
  signal-colored button.

## Typography

No web fonts. DIN Condensed and DIN Alternate on a Mac, Bahnschrift on Windows.

- **display** is the flap letters. They are the largest thing on any screen.
- **countdown** is the cooldown clock, in the same condensed face, so it reads
  like a departure time.
- **heading** is section titles, condensed caps, because every sign on a
  platform is set that way. This is the one place caps are allowed outside the
  tiles.
- **figures** is every dollar amount, time and the clock, with lining digits.
- **body** is sentences, labels and messages.
- The scale is five sizes: 15 for labels and helper text, 17 for body and
  figures, 21 for the reason, the net totals and the small "to go" beside the
  countdown, 30 for headings, 34 for the result field. Nothing else.

## Layout

A thin header: the name on the left, the live clock on the right.

Phone, one column: the flap unit edge to edge, the reason and countdown, then
the three instruments in a row (dial, lamps, bar), then net today and this
week. Then Log a trade, Trades as a tape, My rules folded, Reset.

Laptop (960px and up): two columns inside 1240px, and the whole page fits the
window with no page scroll at 100% zoom. Zayd's call, 2026-10-19. The signal
unit on the left fills the height, with the instruments pushed to the bottom
and the net totals under the instrument columns. The right column stacks Log
a trade, then the tape, which takes whatever height is left and scrolls
inside itself, then My rules and Reset on one footer row. The flap letters
scale with the window height so the column never overflows. Every button and
select is at least 44px tall.

A second page, `trades.html`, lists every trade ever logged, grouped by day
with a total per day, newest day first. Same surface, same type, no
instruments. It reads the same saved data and changes nothing. The main
page's tape links to it, and it links back.

## Icon

The favicon is one flap tile: a green rounded tile on the dark page color,
split by the hinge line, no letter. It reads at 16px where a letter would not.

## Elevation & Depth

One surface. Depth comes from the flap halves rotating in 3D, the inset ring
on each lamp, and the wells. No drop shadows on anything flat, no gradients
used as decoration. A faint film grain overlays the page so large flat areas do
not band; it is an inline SVG filter at 5% opacity.

## Shapes

Tiles 10px, controls 6px, lamps round. The dial is a half circle with round
caps.

## Motion

- The flap: the top half of the old letter folds down over 110ms, then the
  bottom half of the new letter folds into place over 110ms. One fold per
  change, straight from the old letter to the new one. Tiles go left to
  right, 70ms apart. It runs on load from blank, and whenever the answer
  changes. When a trade is logged and the answer stays the same, every tile
  still folds once onto the same letter, so the board acknowledges the entry.
  Zayd's call, 2026-10-19: the earlier version spun through random letters
  before landing, and he cut it. The fold stays, the flicker goes.
- The dial needle and fill ease to their new value over 600ms.
- The result field is not focused on load, because that pops a phone keyboard
  over the signal.
- The page color fades over 500ms.
- Logging a trade is the one orchestrated moment, and every part of it answers
  the action: the result well pulses once in the signal color as it clears
  (400ms); the amount itself lifts out of the well and flies to its new row
  in the tape (550ms, easing out), and the row settles under it; every
  figure that changed rolls from its old number to its new one (500ms,
  easing out) instead of jumping; the dial needle swings with a spring and a
  small overshoot (700ms); a lamp that turns on pops in from small (360ms,
  slight overshoot); when the reason line changes it rises into place
  (400ms). Deleting a row folds it shut (220ms) before it goes. Nothing loops
  and nothing moves unprompted.
- With reduced motion on, letters change in place and nothing eases.

## Components

- **Flap unit:** four tiles, letters padded with blank tiles. Blank tiles sit
  at 45% so they read as spare slots, not missing letters.
- **Dial:** half circle, five ticks, fill from the left, needle from the hub.
  The figure under it reads "$30 of $50".
- **Lamps:** one per allowed loss, up to twenty, lit stop for each loss today.
  Each has an inset shadow and a 1px edge ring so unlit lamps stay visible.
- **Bar:** the week, with tick marks every 25%.
- **Primary button:** signal fill, dark text. Hover brightens by a step with
  no other effect.
- **Quiet button:** edge border, light text. **Danger button:** stop border and
  text; solid stop with dark text when armed.
- **Input:** a well, 56px tall everywhere. The result field is a large figure
  with a dollar sign fixed at its left, and the rule boxes use the figures face
  too, so every number on the page is set the same way. Focus draws a signal
  ring.
- **Tape:** the trades list, rows separated by hairlines, times and results in
  figures. Delete is underlined muted text, not a button, so the amounts are
  what reads.
- **Rules:** folded behind one line that says them in words, with Edit.

## Do's and Don'ts

- Do let the page color carry the answer. My own rule: there is one surface
  and one signal color at a time, so nothing else on the page gets a color of
  its own. It costs me colored wins and losses in the tape, which I accept.
- Do keep every instrument honest: the needle shows the actual share of the
  limit, never a decorative value.
- Don't use cards, drop shadows, glows, glass, gradients, emoji or icons.
- Don't use caps outside the tiles and section headings.
- Don't add a color, font or size that is not in this file.
