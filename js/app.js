// Trade Check
// All the data lives in two variables: `trades` and `rules`.
// Every action changes them, saves them, and calls render() to redraw the page.

const STORAGE_KEY = 'trade-check.v1';

const DEFAULT_RULES = {
  maxLosses: 2,     // losses allowed per day
  dailyLimit: 50,   // dollars you can lose in a day
  weeklyLimit: 150, // dollars you can lose in a week
  cooldown: 20,     // minutes to wait after a loss
};

// ---- State ----

let trades = []; // each trade: { id, amount, ticker, time }
let rules = { ...DEFAULT_RULES };

function load() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved) {
    trades = saved.trades;
    rules = saved.rules;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ trades, rules }));
}

// ---- Working out the answer ----

function isToday(time, now) {
  return new Date(time).toDateString() === now.toDateString();
}

// Weeks start on Monday at midnight.
function startOfWeek(now) {
  const start = new Date(now);
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

function total(list) {
  return list.reduce((sum, t) => sum + t.amount, 0);
}

function getVerdict(now) {
  const today = trades.filter((t) => isToday(t.time, now));
  const week = trades.filter((t) => new Date(t.time) >= startOfWeek(now));
  const losses = today.filter((t) => t.amount < 0);
  const todayTotal = total(today);
  const weekTotal = total(week);

  if (weekTotal <= -rules.weeklyLimit) {
    return { state: 'no', word: 'No', reason: 'Weekly loss limit reached. Back on Monday.' };
  }
  if (todayTotal <= -rules.dailyLimit) {
    return { state: 'no', word: 'No', reason: 'Daily loss limit reached. Back tomorrow.' };
  }
  if (losses.length >= rules.maxLosses) {
    return { state: 'no', word: 'No', reason: `${plural(losses.length, 'loss', 'losses')} today. Done for today.` };
  }
  if (today.length === 0) {
    return { state: 'yes', word: 'Yes', reason: 'No trades today. You are inside your limits.' };
  }
  const roomLeft = rules.dailyLimit + todayTotal;
  const lossesLeft = rules.maxLosses - losses.length;
  return {
    state: 'yes',
    word: 'Yes',
    reason: `${money(roomLeft)} left before your daily limit, ${plural(lossesLeft, 'loss', 'losses')} left today.`,
  };
}

// ---- Drawing the page ----

const els = {
  answer: document.getElementById('answer'),
  verdict: document.getElementById('verdict'),
  reason: document.getElementById('reason'),
  statToday: document.getElementById('stat-today'),
  statWeek: document.getElementById('stat-week'),
  statLosses: document.getElementById('stat-losses'),
  tradeForm: document.getElementById('trade-form'),
  amount: document.getElementById('amount'),
  ticker: document.getElementById('ticker'),
  list: document.getElementById('trades'),
  empty: document.getElementById('empty'),
  filter: document.getElementById('filter'),
  rulesForm: document.getElementById('rules-form'),
  rulesSaved: document.getElementById('rules-saved'),
};

function money(n) {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

function signedMoney(n) {
  return n > 0 ? `+${money(n)}` : money(n);
}

function clock(time) {
  return new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function render() {
  const now = new Date();
  const verdict = getVerdict(now);
  els.answer.dataset.state = verdict.state;
  els.verdict.textContent = verdict.word;
  els.reason.textContent = verdict.reason;

  const today = trades.filter((t) => isToday(t.time, now));
  const week = trades.filter((t) => new Date(t.time) >= startOfWeek(now));
  els.statToday.textContent = signedMoney(total(today));
  els.statWeek.textContent = signedMoney(total(week));
  els.statLosses.textContent = `${today.filter((t) => t.amount < 0).length} of ${rules.maxLosses}`;

  // Which trades the list shows depends on the dropdown. The data does not change.
  let shown;
  if (els.filter.value === 'today') shown = today;
  else if (els.filter.value === 'week') shown = week;
  else shown = trades;
  shown = [...shown].reverse(); // newest first

  els.list.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = clock(t.time);
    const ticker = document.createElement('span');
    ticker.textContent = t.ticker || '-';
    const result = document.createElement('span');
    result.className = 'result';
    result.textContent = signedMoney(t.amount);
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn-quiet';
    del.textContent = 'Delete';
    del.dataset.id = t.id;
    del.setAttribute('aria-label', `Delete the ${signedMoney(t.amount)} trade at ${clock(t.time)}`);
    li.append(time, ticker, result, del);
    els.list.appendChild(li);
  }
  els.empty.hidden = shown.length > 0;
  els.empty.textContent = trades.length === 0
    ? 'No trades yet. Log your first one above.'
    : 'No trades in this view.';
}

// ---- Checking input ----

// Turns what was typed into a number, or returns a message saying what is wrong.
// Accepts things like "-12", "+30", "-$12.50" and "1,200".
function readAmount(text) {
  const cleaned = text.replace(/[$,\s]/g, '');
  if (cleaned === '') return { error: 'Enter the result, like -12 or 30.' };
  if (!/^[+-]?\d+(\.\d{1,2})?$/.test(cleaned)) return { error: 'Use a number, like -12.50.' };
  const amount = Number(cleaned);
  if (amount === 0) return { error: 'A $0 trade does not count. Enter a win or a loss.' };
  return { amount };
}

function showError(input, message) {
  const msg = document.getElementById(`${input.id}-msg`);
  msg.textContent = message;
  if (message) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
}

// ---- Actions ----

function addTrade(amount, ticker) {
  trades.push({
    id: Date.now(),
    amount,
    ticker: ticker.toUpperCase(),
    time: new Date().toISOString(),
  });
  save();
  render();
}

function deleteTrade(id) {
  trades = trades.filter((t) => t.id !== id);
  save();
  render();
}

// One listener on the whole list catches every Delete button, even ones added later.
els.list.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-id]');
  if (button) deleteTrade(Number(button.dataset.id));
});

els.filter.addEventListener('change', render);

// ---- Rules ----

const RULE_FIELDS = ['maxLosses', 'dailyLimit', 'weeklyLimit', 'cooldown'];

function fillRulesForm() {
  for (const name of RULE_FIELDS) {
    const input = document.getElementById(name);
    input.value = rules[name];
    showError(input, '');
  }
}

els.rulesForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const next = {};
  let ok = true;
  for (const name of RULE_FIELDS) {
    const input = document.getElementById(name);
    const text = input.value.trim();
    if (!/^\d+$/.test(text) || Number(text) === 0) {
      showError(input, 'Use a whole number above 0.');
      ok = false;
    } else {
      showError(input, '');
      next[name] = Number(text);
    }
  }
  if (!ok) {
    els.rulesSaved.textContent = '';
    return; // nothing changes until every rule is valid
  }
  rules = next;
  save();
  render();
  els.rulesSaved.textContent = 'Rules saved. The answer above uses them now.';
});

els.tradeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const result = readAmount(els.amount.value);
  if (result.error) {
    showError(els.amount, result.error); // keep what was typed so it can be fixed
    els.amount.focus();
    return;
  }
  showError(els.amount, '');
  addTrade(result.amount, els.ticker.value.trim());
  els.tradeForm.reset();
  els.amount.focus();
});

load();
fillRulesForm();
render();
els.amount.focus();
