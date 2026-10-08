---
version: alpha
name: Trade Check
colors:
  page: "#E8EBEF"
  surface: "#FFFFFF"
  ink: "#18202A"
  muted: "#5A6573"
  line: "#CDD3DA"
  board: "#1C2733"
  tile: "#273546"
  hinge: "#121A23"
  board-text: "#EEF2F6"
  board-muted: "#9AA8B8"
  go: "#52C98A"
  wait: "#F5B83D"
  stop: "#FF6B5B"
  error: "#B42318"
typography:
  display:
    fontFamily: '"DIN Condensed", "Bahnschrift Condensed", Bahnschrift, "Arial Narrow", sans-serif'
    fontSize: clamp(72px, 22vw, 132px)
    fontWeight: 700
    lineHeight: 1
  figures:
    fontFamily: '"DIN Alternate", Bahnschrift, system-ui, sans-serif'
    fontVariantNumeric: tabular-nums
    fontWeight: 700
  heading:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 20px
    fontWeight: 700
  body:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontSize: 15px
rounded:
  tile: 6px
  board: 14px
  control: 8px
spacing:
  unit: 8px
  gutter: 16px
  section: 32px
  column: 1080px
components:
  flap-tile:
    backgroundColor: "{colors.tile}"
    hingeColor: "{colors.hinge}"
    rounded: "{rounded.tile}"
  gauge-track:
    backgroundColor: "{colors.tile}"
    height: 10px
    rounded: 5px
  button-primary:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-text}"
    rounded: "{rounded.control}"
    padding: 14px 22px
  button-primary-hover:
    backgroundColor: "{colors.tile}"
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    borderColor: "{colors.line}"
    rounded: "{rounded.control}"
  button-danger:
    textColor: "{colors.error}"
    borderColor: "{colors.error}"
  input:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.line}"
    rounded: "{rounded.control}"
  input-focus:
    outline: 3px solid {colors.board}
  input-error:
    borderColor: "{colors.error}"
  field-message:
    textColor: "{colors.error}"
---

# Trade Check

## Overview

Who opens this: someone about to place a trade, on a phone, who needs one
answer in the first two seconds. Can I trade right now?

The direction is a split-flap departure board at a train station. The answer
sits on a dark board in big flap tiles, and the tiles flip letter by letter
when the answer changes, the way a board changes when a train is cancelled.
Below the answer, still on the board, three gauges show how close today and
this week are to the limits. Everything outside the board is quiet: light gray,
plain type, forms that stay out of the way.

Redesigned 2026-10-08. The first version had the right layout but the answer
was only big green text. The board makes the answer feel like a signal you obey,
not a sentence you read.

## Colors

- **page** is the background outside the board. Cool gray, not cream.
- **surface** is inside inputs.
- **ink** is text outside the board. **muted** is helper text and times.
- **line** is hairlines between list rows and input borders.
- **board** is the board and the main buttons. **tile** is each flap tile and
  the empty part of a gauge. **hinge** is the split line across each tile.
- **board-text** and **board-muted** are text on the board.
- **go**, **wait** and **stop** only appear on the board: the answer letters,
  the reason line and the filled part of the gauges.
- **error** is field messages and the Start over button, on the light page.

## Typography

No web fonts. Every face is already on the computer: DIN on a Mac, Bahnschrift
on Windows, which is the same kind of face.

- **display** is the flap letters, condensed DIN, all caps because a departure
  board is.
- **figures** is every dollar amount, time and countdown, with numbers that
  line up.
- **heading** is section titles in sentence case. No all-caps labels and no
  monospace labels anywhere.
- **body** is everything else.

## Layout

On a phone, one column: the board, then Log a trade, then the trades list, then
My rules, then Reset. The board and the log form fit before any scroll.

On a laptop (900px and up), two columns inside 1080px: the board on the left,
which stays in place while you scroll, and the form, list, rules and reset on
the right.

On the board, top to bottom: "Can I trade?", the flap tiles, the reason line,
the countdown if there is one, then three gauges: lost today out of the daily
limit, one dot per allowed loss, lost this week out of the weekly limit.

## Elevation & Depth

The board is the only raised thing on the page, shown by its dark color, not by
a shadow. Each flap tile has a 1px hinge line across the middle. No shadows,
no gradients, no glass.

## Shapes

Three radii, by size: 6px tiles, 8px controls, 14px for the board. Gauges are
round-ended bars.

## Motion

One moment: the tiles flip when the answer changes, one after another, about
60ms apart. It happens because the user did something, so it shows what
changed. The gauges slide to their new length. Nothing moves on its own except
the countdown digits. With reduced motion turned on, the letters change with no
flip.

## Components

- **Flap tile:** a fixed-width tile with one letter. Four tiles, so YES, NO and
  WAIT all fit, padded with blank tiles.
- **Gauge:** a label and a figure on one line ("Lost today", "$12.50 of $50"),
  the bar under it. The bar is go below 60%, wait from 60%, stop at 100%.
- **Loss dots:** one dot per allowed loss, filled stop for each loss today.
- **Main button** (Log trade, Save rules): board color, light text.
- **Quiet button** (Delete, Clear today): no fill, hairline border.
- **Danger button** (Start over): no fill, error border and text.
- **Input:** white, hairline border, 3px board outline on focus, error border on
  a problem. The result field is large, in figures, because it is the action.
- **Rules:** closed by default behind one line that says the current rules in
  words. Open it to edit.

## Do's and Don'ts

- Do keep the board the only dark, colorful thing on the page. My own rule: the
  answer is the page, so nothing outside the board uses go, wait or stop.
- Do say every rule and limit in words with numbers, like "$12.50 of $50".
- Don't color wins green or losses red in the list. Plus and minus are enough.
- Don't use cards, shadows, gradients, pill buttons, emoji or icons.
- Don't use all caps outside the flap tiles.
- Don't add a color, font or size that is not in this file.
