# Trade Check

Who opens this: someone about to place a trade, who needs to know in two
seconds if they are still inside their own rules.

**Live:** https://zayd123455.github.io/trade-check/

## What it does

You log each trade as it closes, as a plus or minus dollar amount. The page
remembers them and answers one question in big split-flap letters: can I trade
right now? The whole screen turns green, amber or red with the answer.

- **Yes**, with how much room is left today.
- **Wait**, with a countdown, if your last loss was too recent.
- **No**, with the reason, once you hit your max losses, your daily loss limit
  or your weekly loss limit.

The trades and your rules are saved in your browser, so they are still there
after a refresh. Nothing is sent anywhere.

## How to use it

1. Open **My rules** with Edit and set them: max losses per day, daily loss limit,
   weekly loss limit, and how long to wait after a loss. Save rules.
2. When a trade closes, type the result under **Log a trade**, like `-12` or
   `30`, and press Enter or Log trade. The ticker is optional.
3. Read the signal before the next one: the letters, the reason under them,
   the dial for today's limit, the lamps for losses and the bar for the week.
4. Made a mistake? Delete that trade from the list. The dropdown switches the
   list between today, this week and all trades.
5. **Clear today** removes today's trades. **Start over** removes everything
   and puts the default rules back. It asks for a second tap first.

## Files

- `PROPOSAL.md`: what I planned before any code.
- `PRD.md`: the plan in detail, with every state of the page.
- `DESIGN.md`: colors, type and layout. The CSS only uses values from it.
- `AGENTS.md`: the rules the agent follows.
- `index.html`, `css/styles.css`, `js/app.js`: the tool. All the data lives in
  `trades` and `rules` in `js/app.js`.

## Design direction

I did not make the three trial pages first. I compared directions by building
the whole page three times instead, and each time DESIGN.md was committed
before the CSS changed: a plain one-column look (`0234f92`), a dark board inside
a light page (`2577802`), and the one that stayed, where the whole screen is the
signal (`623403f`). The first two are still in the history.

## Where it differed from what I expected

I expected the countdown to redraw the whole page every second. It only redraws
the answer at the top, and redraws everything only when the answer itself
changes, so typing in a form is not interrupted while the clock runs.

## The required question

**What did the AI give me, what did I change, and how did I know?**

The first working version (commit `66c71ff`) passed the result field straight
to `Number()`. Before adding anything else I tested the invalid states listed in
PRD.md. An empty field logged a $0 trade that showed up in the list, and typing
`abc` made today's total read `$NaN`. After a refresh the NaN quietly turned
into nothing, so the total looked fine again even though a bad trade was still
saved. Commit `4f9a110` adds `readAmount()`, which cleans the input, rejects
empty, non-number and $0 entries with a message under the field, and keeps what
was typed so it can be fixed. Nothing is saved until the number is valid.
