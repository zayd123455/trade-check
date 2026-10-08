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
    return { state: 'no', word: 'No', reason: `${losses.length} losses today. Done for today.` };
  }
  if (today.length === 0) {
    return { state: 'yes', word: 'Yes', reason: 'No trades today. You are inside your limits.' };
  }
  const roomLeft = rules.dailyLimit + todayTotal;
  const lossesLeft = rules.maxLosses - losses.length;
  return {
    state: 'yes',
    word: 'Yes',
    reason: `${money(roomLeft)} left before your daily limit, ${lossesLeft} ${lossesLeft === 1 ? 'loss' : 'losses'} left today.`,
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

  els.list.innerHTML = '';
  const shown = [...today].reverse(); // newest first
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
    li.append(time, ticker, result);
    els.list.appendChild(li);
  }
  els.empty.hidden = shown.length > 0;
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

els.tradeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTrade(Number(els.amount.value), els.ticker.value.trim());
  els.tradeForm.reset();
  els.amount.focus();
});

load();
render();
els.amount.focus();
