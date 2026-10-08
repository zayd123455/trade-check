---
version: alpha
name: Trade Check
colors:
  background: "#F4F5F6"
  surface: "#FFFFFF"
  ink: "#15181C"
  muted: "#5C636B"
  line: "#D7DBE0"
  go: "#146C3C"
  stop: "#A61F1A"
  wait: "#8A5A00"
typography:
  verdict:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: clamp(64px, 18vw, 112px)
    fontWeight: 800
    lineHeight: 1
  heading:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 14px
    fontWeight: 700
    letterSpacing: 0.06em
  body:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
  numbers:
    fontFamily: ui-monospace, "SF Mono", Menlo, Consolas, monospace
    fontSize: 17px
    fontWeight: 500
rounded:
  sm: 4px
spacing:
  unit: 8px
  gutter: 16px
  section: 40px
  column: 560px
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: 12px 20px
  button-primary-hover:
    backgroundColor: "#2B3036"
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    borderColor: "{colors.line}"
    rounded: "{rounded.sm}"
    padding: 8px 14px
  button-danger:
    backgroundColor: transparent
    textColor: "{colors.stop}"
    borderColor: "{colors.stop}"
    rounded: "{rounded.sm}"
    padding: 8px 14px
  input:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.line}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
  input-focus:
    borderColor: "{colors.ink}"
    outline: 2px solid {colors.ink}
  input-error:
    borderColor: "{colors.stop}"
  field-message:
    textColor: "{colors.stop}"
    fontSize: 15px
---

# Trade Check

## Overview

Who opens this: someone about to place a trade, on a phone, who needs one
answer in the first two seconds. Can I trade right now, yes or no?

The direction is a departure board at a train station. One line you can read
from across the room, then the details in small type for anyone who walks
closer. The answer is the page. Everything below it is there to explain it or
change it.

## Colors

- **background** is the page. A cool light gray, not cream, so the colored
  answer is the only warm thing on screen.
- **surface** is inside inputs only.
- **ink** is all text and the main button.
- **muted** is labels, times and helper text.
- **line** is the hairline between sections and rows, and input borders.
- **go**, **stop** and **wait** are used for the answer word and its reason line
  and nothing else, except stop for field messages and the Start over button.
  Each one passes 4.5:1 contrast on background.

## Typography

System fonts only. Nothing is loaded from a CDN.

- **verdict** is the Yes, No or Wait. Nothing else on the page comes close to its
  size.
- **heading** is the small uppercase label above each section, in muted.
- **body** is everything else.
- **numbers** is every dollar amount and time, so the digits line up in the list.

## Layout

One column, 560px wide at most, centered, with a 16px gutter on a phone.

Top to bottom:

1. The answer: "Can I trade?" label, the word, the reason line. On a phone this
   and today's numbers fit before any scroll.
2. Today in numbers: three lines, label on the left, number on the right.
3. Log a trade: result and ticker on one row on a laptop, stacked on a phone,
   then the button.
4. Trades: the filter dropdown, then rows of time, ticker, result, Delete.
5. My rules: four labeled numbers, then Save rules.
6. Reset: Clear today and Start over, side by side.

Sections are separated by space and a hairline, never by boxes.

## Elevation & Depth

None. No shadows, no cards, no layers. Depth comes from size and space.

## Shapes

One radius, 4px, on inputs and buttons. Everything else is square.

## Components

- **Main button** (Log trade, Save rules): ink background, white text. Hover goes
  one step lighter. Focus shows a 2px ink outline with 2px offset.
- **Quiet button** (Delete, Clear today): no fill, hairline border, ink text.
- **Danger button** (Start over): no fill, stop border and text.
- **Input:** white, hairline border. Focus turns the border ink with a 2px outline.
  An error turns the border stop.
- **Field message:** under the field, stop color, starts with the problem in
  plain words. No icon.
- **Dropdown:** styled like an input.

## Do's and Don'ts

- Do keep the answer the largest thing on the page. My own rule: the answer is
  the page, so nothing else uses its size or its colors. It costs me a colorful
  trades list, which I am fine with.
- Do write every message as a plain sentence with a number in it where it helps.
- Don't use cards, shadows, gradients or pill buttons.
- Don't use emoji or icons. Words carry the meaning.
- Don't color a win green or a loss red in the list. Plus and minus signs are
  enough, and green and red belong to the answer.
- Don't add a color, font or size that is not in this file.
