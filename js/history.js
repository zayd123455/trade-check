// All trades page. Reads the same saved data as the board and lists every
// trade ever logged, grouped by day, newest day first. It changes nothing.

const STORAGE_KEY = 'trade-check.v1';

let trades = [];
let state = 'yes';

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved) {
    trades = (Array.isArray(saved.trades) ? saved.trades : []).filter(
      (t) => t && Number.isFinite(t.amount) && !Number.isNaN(new Date(t.time).getTime()),
    );
    if (saved.state) state = saved.state;
  }
} catch {
  trades = [];
}

document.body.dataset.state = state;

function money(n) {
  const sign = n < 0 ? '-' : '';
  const digits = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sign}$${digits}`;
}

function signedMoney(n) {
  return n > 0 ? `+${money(n)}` : money(n);
}

function clock(time) {
  return new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function total(list) {
  return Math.round(list.reduce((sum, t) => sum + t.amount * 100, 0)) / 100;
}

// Group by calendar day. toDateString() gives one key per local day.
const byDay = new Map();
for (const t of trades) {
  const key = new Date(t.time).toDateString();
  if (!byDay.has(key)) byDay.set(key, []);
  byDay.get(key).push(t);
}

document.getElementById('sum-count').textContent = trades.length;
document.getElementById('sum-net').textContent = signedMoney(total(trades));
document.getElementById('sum-losses').textContent = trades.filter((t) => t.amount < 0).length;

const days = document.getElementById('days');
const dayKeys = [...byDay.keys()].sort((a, b) => new Date(b) - new Date(a)); // newest first

for (const key of dayKeys) {
  const list = byDay.get(key);
  const section = document.createElement('section');
  section.className = 'day';

  const head = document.createElement('div');
  head.className = 'day-head';
  const title = document.createElement('h2');
  title.textContent = new Date(key).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const net = document.createElement('span');
  net.className = 'fig';
  net.textContent = signedMoney(total(list));
  head.append(title, net);

  const ul = document.createElement('ul');
  ul.className = 'tape';
  for (const t of [...list].reverse()) {
    const li = document.createElement('li');
    li.className = 'plain';
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = clock(t.time);
    const ticker = document.createElement('span');
    ticker.className = 'ticker';
    ticker.textContent = t.ticker || '-';
    const result = document.createElement('span');
    result.className = 'result';
    result.textContent = signedMoney(t.amount);
    li.append(time, ticker, result);
    ul.appendChild(li);
  }

  section.append(head, ul);
  days.appendChild(section);
}

document.getElementById('empty').hidden = trades.length > 0;
