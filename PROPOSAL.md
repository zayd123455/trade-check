# Trade Check

## What I am building

A page that remembers the trades you log and tells you if you are still allowed
to place another one today.

## Who it is for

Anyone who trades with rules like "stop after two losses" or "stop if I am down
$20 today". Setting rules like that is easy. Following them in the moment is the
hard part, because that is exactly when you talk yourself into one more trade.
The tool does the math and gives a plain yes or no, so the decision is made
before the moment, not during it. I am building it for myself first.

## What it remembers

- The list of trades: when each one happened, the ticker (optional), and the
  result in dollars, plus for a win or minus for a loss.
- The rules: max losses per day, daily loss limit in dollars, weekly loss limit
  in dollars, and how many minutes to wait after a loss.

## Where the data lives

The trades and the rules are state in my JavaScript, saved to localStorage so
they survive a refresh. Only I write it and only I need to see it, on my own
browser.

## What each action changes

- **Log a trade:** a new trade joins the list. Today's total, this week's total
  and the loss count go up or down, and the answer at the top can flip from yes
  to no or to wait.
- **Delete a trade:** that trade leaves the list and every total is worked out
  again, so a mistake does not lock me out.
- **Change my rules:** the limits change, and the answer is checked again against
  the trades already logged today.
- **Switch the list between today, this week and all trades:** only what is shown
  changes. The data stays the same.
- **Clear today / start over:** clear today removes today's trades. Start over
  removes every trade and puts the rules back to the defaults.

## Features

1. A big yes, no or wait at the top that answers "can I trade right now?" and
   says why.
2. A countdown after a loss, until the cooldown is over.
3. Today's total, this week's total and losses left today, worked out from the
   list.
4. Rules I can change myself, without touching code.
5. A list of trades with a filter and a delete button on each one.

## What I do not know yet

- How to work with dates in JavaScript: what counts as "today", and when a week
  starts.
- How to make the countdown update every second without breaking the rest of the
  page.
- How saving and loading from localStorage works, and what happens the first time
  when there is nothing saved.
- How to stop a bad number from getting into the list.
