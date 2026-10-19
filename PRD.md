# PRD: Trade Check

## Goal

One page that answers "can I place another trade right now?" with yes, no or
wait, worked out from the trades I have logged and the rules I set.

## Audience and key action

A trader with daily rules, on a phone or a laptop, right before placing a
trade. Key action: read the answer at the top. Second action: log the trade
that just closed.

## Features

Version 1 is one page, `index.html`, top to bottom:

1. **The answer.** "Can I trade?" and one word under it, Yes, No or Wait, with
   one line saying why. Worked out in this order, first match wins:
   - This week's total is at or below minus the weekly limit: **No**, "Weekly
     loss limit reached. Back on Monday."
   - Today's total is at or below minus the daily limit: **No**, "Daily loss
     limit reached. Back tomorrow."
   - Losses today have reached the max: **No**, "2 losses today. Done for
     today."
   - The last loss was less than the cooldown ago, even if it was just before
     midnight: **Wait**, with the time it clears and a countdown that ticks
     every second.
   - Otherwise: **Yes**, with the room left: dollars left before the daily
     limit and losses left today.
2. **Today in numbers.** Today's total, this week's total (weeks start on
   Monday), losses today out of the max. Plain text on one line each.
3. **Log a trade.** A form with the result in dollars (required, plus or minus)
   and a ticker (optional). Submit with the button or Enter. The time is the
   moment it is logged.
4. **Trades list.** Newest first. Each row: time, ticker, result, and a Delete
   button. A dropdown above it switches between Today, This week and All.
5. **My rules.** A form with four numbers: max losses per day, daily loss limit,
   weekly loss limit, cooldown in minutes. Save rules re-checks the answer.
6. **Reset.** Clear today removes today's trades. Start over removes all trades
   and puts the rules back to the defaults. Neither reloads the page.

Defaults: 2 losses, $100 a day, $300 a week, 10 minutes. Set by me on 10/19.

## States

- **Empty (first visit, or no trades today):** the answer reads Yes, "No
  trades today. You are inside your limits." Today's numbers show $0. The list
  says "No trades yet. Log your first one above." and the cursor is in the
  result field.
- **Invalid input:** the message appears right under the field, in words, and
  nothing is saved. The field keeps what was typed so it can be fixed.
  - Empty result: "Enter the result, like -12 or 30."
  - Not a number: "Use a number, like -12.50."
  - Zero: "A $0 trade does not count. Enter a win or a loss."
  - A rule that is empty, zero, negative or not a whole number where one is
    needed: "Use a whole number above 0." under that rule.
- **In use:** the answer with its reason, today's numbers, and the list.
- **Locked (No):** same layout, the answer in the stop color, the reason, and
  when it opens again.
- **Waiting (Wait):** the answer in the wait color with a live countdown. When it
  reaches zero the answer turns to Yes without a reload.
- **After a reset:** Clear today returns to the empty state with the rules kept.
  Start over returns to the empty state with the default rules.

## Content and data

- Have: the four rules and their defaults, every message above.
- Data: an array of trades and an object of rules, in `js/app.js`, saved to
  localStorage under one key.
- Missing: nothing.

## Look

Follows DESIGN.md.

## Checks

1. On a first visit, the page says Yes and asks for the first trade.
2. Logging two losses turns the answer to No, and deleting one turns it back.
3. Logging a loss shows Wait with a countdown, and it turns to Yes on its own.
4. An empty or non-number result shows a message under the field and saves
   nothing.
5. After a refresh, the trades and rules are still there. After Start over, they
   are gone.

## Out of scope

Prices, charts, broker connections, accounts or logins, anything that needs a
server or an outside API. No frameworks, nothing from a CDN.

## Later

- Export the trade log to a file.
- Undo the last delete.
- A note on each trade for why I took it.
- A weekly summary: best day, worst day, how often I hit a limit.
