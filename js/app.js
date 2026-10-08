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

// The first visit has nothing saved, so the defaults stay. If what is saved
// is broken, or the browser blocks storage, the page still works from the defaults.
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      // Keep only trades that have the shape the page expects.
      trades = (Array.isArray(saved.trades) ? saved.trades : []).filter(
        (t) => t && Number.isFinite(t.amount) && !Number.isNaN(new Date(t.time).getTime()) && t.id != null,
      );
      rules = { ...DEFAULT_RULES, ...saved.rules };
      for (const k of Object.keys(DEFAULT_RULES)) {
        if (!(Number.isInteger(rules[k]) && rules[k] > 0)) rules[k] = DEFAULT_RULES[k];
      }
    }
  } catch {
    trades = [];
    rules = { ...DEFAULT_RULES };
  }
}

let storageWorks = true;

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ trades, rules }));
    storageWorks = true;
  } catch {
    // Storage is blocked or full. The page keeps working until it closes, and says so.
    storageWorks = false;
  }
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

// Summed in cents so -10.10 + -20.20 + -19.70 is exactly -50, not -49.999...
function total(list) {
  return Math.round(list.reduce((sum, t) => sum + t.amount * 100, 0)) / 100;
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
  // Cooldown: the last loss has to be at least `cooldown` minutes ago, even if
  // it was just before midnight.
  const allLosses = trades.filter((t) => t.amount < 0);
  if (allLosses.length > 0) {
    const lastLoss = Math.max(...allLosses.map((t) => new Date(t.time).getTime()));
    const clearAt = lastLoss + rules.cooldown * 60 * 1000;
    if (now.getTime() < clearAt) {
      return { state: 'wait', word: 'Wait', reason: `Cooling down after a loss. Clear at ${clock(clearAt)}.`, clearAt };
    }
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
  countdown: document.getElementById('countdown'),
  tiles: [...document.querySelectorAll('#flaps .tile')],
  dayFig: document.getElementById('day-fig'),
  dayFill: document.getElementById('day-fill'),
  needle: document.getElementById('needle'),
  weekFig: document.getElementById('week-fig'),
  weekFill: document.getElementById('week-fill'),
  dots: document.getElementById('dots'),
  rulesSummary: document.getElementById('rules-summary'),
  clock: document.getElementById('clock'),
  storageNote: document.getElementById('storage-note'),
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// "12:05" from a number of milliseconds.
function countdownText(ms) {
  const seconds = Math.ceil(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// The digits in the display face, "to go" small beside them.
function setCountdown(text) {
  if (!text) { els.countdown.replaceChildren(); return; }
  if (els.countdown.firstChild?.nodeType === Node.TEXT_NODE) {
    setText(els.countdown.firstChild, text);
    return;
  }
  const unit = document.createElement('span');
  unit.className = 'unit';
  unit.textContent = 'to go';
  els.countdown.replaceChildren(document.createTextNode(text), unit);
}

// Short money for the gauges: "$12.50" but "$50" when there are no cents.
function shortMoney(n) {
  return Number.isInteger(n) ? `$${n.toLocaleString('en-US')}` : money(n);
}

// The split-flap unit. Each tile is two halves. To change a letter, the top
// half of the old letter folds down, then the bottom half of the new letter
// folds into place. Tiles go left to right. Looks only: the answer itself is
// the hidden #verdict text, which screen readers read.
function flipTile(tile, letter) {
  const top = tile.querySelector('.top .ch');
  const bottom = tile.querySelector('.bottom .ch');
  const flipTop = tile.querySelector('.flip-top .ch');
  const flipBottom = tile.querySelector('.flip-bottom .ch');
  const old = tile.dataset.letter;
  tile.dataset.letter = letter;
  if (reduceMotion) {
    top.textContent = letter;
    bottom.textContent = letter;
    return;
  }
  top.textContent = letter;      // the new letter is already behind the fold
  bottom.textContent = old;      // the old bottom stays until the fold lands
  flipTop.textContent = old;
  flipBottom.textContent = letter;
  tile.classList.remove('flipping');
  void tile.offsetWidth;          // restart the animation if it is mid-flip
  tile.classList.add('flipping');
  clearTimeout(tile.cleanupTimer);
  tile.cleanupTimer = setTimeout(() => {
    bottom.textContent = letter;
    tile.classList.remove('flipping');
  }, 340);
}

function setFlaps(word) {
  const letters = word.toUpperCase().padEnd(els.tiles.length, ' ').split('');
  els.tiles.forEach((tile, i) => {
    if (tile.dataset.target === letters[i]) return; // already showing or on its way
    tile.dataset.target = letters[i];
    clearTimeout(tile.flipTimer);
    tile.flipTimer = setTimeout(() => flipTile(tile, letters[i]), i * 70);
  });
}

const DIAL_LENGTH = 251.4; // length of the half-circle path in the SVG

// The dial: fill from the left and swing the needle, both from the same share.
function setDial(used, limit) {
  const share = Math.min(used / limit, 1);
  els.dayFill.style.strokeDashoffset = DIAL_LENGTH * (1 - share);
  els.needle.style.transform = `rotate(${-90 + 180 * share}deg)`;
}

function setBar(fill, used, limit) {
  fill.style.width = `${Math.min(used / limit, 1) * 100}%`;
}

let lastAnswer = '';

// Only rewrite text that changed, so the live region is not re-announced every second.
function setText(el, text) {
  if (el.textContent !== text) el.textContent = text;
}

function renderAnswer(now) {
  const verdict = getVerdict(now);
  document.body.dataset.state = verdict.state;
  setText(els.verdict, verdict.word);
  setFlaps(verdict.word);
  setText(els.reason, verdict.reason);
  setCountdown(verdict.clearAt ? countdownText(verdict.clearAt - now.getTime()) : '');
  lastAnswer = verdict.state + verdict.reason;
}

function render() {
  const now = new Date();
  renderAnswer(now);

  const today = trades.filter((t) => isToday(t.time, now));
  const week = trades.filter((t) => new Date(t.time) >= startOfWeek(now));
  els.statToday.textContent = signedMoney(total(today));
  els.statWeek.textContent = signedMoney(total(week));
  const lossCount = today.filter((t) => t.amount < 0).length;
  els.statLosses.textContent = `${lossCount} of ${rules.maxLosses}`;

  // Gauges: how much of each limit is used. Being up counts as $0 lost.
  const lostToday = Math.max(0, -total(today));
  const lostWeek = Math.max(0, -total(week));
  els.dayFig.textContent = `${shortMoney(lostToday)} of ${shortMoney(rules.dailyLimit)}`;
  els.weekFig.textContent = `${shortMoney(lostWeek)} of ${shortMoney(rules.weeklyLimit)}`;
  setDial(lostToday, rules.dailyLimit);
  setBar(els.weekFill, lostWeek, rules.weeklyLimit);

  // One lamp per allowed loss, lit for each loss today.
  els.dots.replaceChildren();
  for (let i = 0; i < Math.min(rules.maxLosses, 20); i++) {
    const lamp = document.createElement('span');
    lamp.className = i < lossCount ? 'lamp on' : 'lamp';
    els.dots.appendChild(lamp);
  }

  els.rulesSummary.textContent =
    `${plural(rules.maxLosses, 'loss', 'losses')}, $${rules.dailyLimit} a day, $${rules.weeklyLimit} a week, ${rules.cooldown} min after a loss`;

  // Which trades the list shows depends on the dropdown. The data does not change.
  let shown;
  if (els.filter.value === 'today') shown = today;
  else if (els.filter.value === 'week') shown = week;
  else shown = trades;
  shown = [...shown].reverse(); // newest first

  const focusedId = document.activeElement?.dataset?.id; // a Delete button, if one has focus
  els.list.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = clock(t.time);
    const ticker = document.createElement('span');
    ticker.className = 'ticker';
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
    if (t.id === justAdded) li.className = 'new';
    li.append(time, ticker, result, del);
    els.list.appendChild(li);
  }
  if (focusedId) {
    const again = els.list.querySelector(`button[data-id="${focusedId}"]`);
    (again || els.list.querySelector('button') || els.filter).focus({ preventScroll: true });
  }
  els.storageNote.hidden = storageWorks;
  els.empty.hidden = shown.length > 0;
  if (trades.length === 0) els.empty.textContent = 'No trades yet. Log your first one above.';
  else if (els.filter.value === 'today') els.empty.textContent = 'No trades today.';
  else els.empty.textContent = 'No trades this week.';
}

// ---- Checking input ----

// Turns what was typed into a number, or returns a message saying what is wrong.
// Accepts things like "-12", "+30", "-$12.50" and "1,200".
function readAmount(text) {
  let cleaned = text.replace(/[$,\s]/g, '').replace(/[\u2212\u2013\u2014]/g, '-'); // typed minus signs
  if (cleaned === '') return { error: 'Enter the result, like -12 or 30.' };
  let negative = false;
  if (/^\(.+\)$/.test(cleaned)) { negative = true; cleaned = cleaned.slice(1, -1); } // (12) means a loss
  if (/\d-$/.test(cleaned)) { negative = true; cleaned = cleaned.slice(0, -1); }      // 12- too
  if (!/^[+-]?(\d+\.?\d{0,2}|\.\d{1,2})$/.test(cleaned)) return { error: 'Use a number, like -12.50.' };
  let amount = Number(cleaned);
  if (negative) amount = -Math.abs(amount);
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

let justAdded = null; // id of the newest trade, so its row can flash once

function addTrade(amount, ticker) {
  const trade = {
    id: trades.reduce((max, t) => Math.max(max, t.id), 0) + 1,
    amount,
    ticker: ticker.toUpperCase(),
    time: new Date().toISOString(),
  };
  trades.push(trade);
  save();
  justAdded = trade.id;
  render();
  justAdded = null;
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
    const limit = name === 'maxLosses' ? 20 : Infinity;
    if (!/^\d+$/.test(text) || Number(text) === 0 || Number(text) > limit) {
      showError(input, name === 'maxLosses' ? 'Use a whole number from 1 to 20.' : 'Use a whole number above 0.');
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
  els.rulesSaved.textContent = 'Rules saved. The board uses them now.';
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

// ---- Reset ----

function clearToday() {
  const now = new Date();
  trades = trades.filter((t) => !isToday(t.time, now));
  save();
  render();
  els.amount.focus();
}

function startOver() {
  trades = [];
  rules = { ...DEFAULT_RULES };
  els.filter.value = 'today';
  els.rulesSaved.textContent = '';
  save();
  fillRulesForm();
  render();
  els.amount.focus();
}

document.getElementById('clear-today').addEventListener('click', clearToday);

// Start over erases everything, so it takes two taps instead of a confirm() box.
const startOverButton = document.getElementById('start-over');
let armedUntil = 0;
startOverButton.addEventListener('click', () => {
  if (Date.now() < armedUntil) {
    armedUntil = 0;
    startOverButton.textContent = 'Start over';
    startOverButton.classList.remove('armed');
    startOver();
    return;
  }
  armedUntil = Date.now() + 4000;
  startOverButton.textContent = 'Tap again to erase everything';
  startOverButton.classList.add('armed');
  setTimeout(() => {
    if (Date.now() >= armedUntil) {
      startOverButton.textContent = 'Start over';
      startOverButton.classList.remove('armed');
    }
  }, 4000);
});

// Every second: if the answer itself changed (a cooldown ended, or midnight
// passed), redraw everything. Otherwise only the countdown moves.
let lastDay = new Date().toDateString();

function tick() {
  const now = new Date();
  els.clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const verdict = getVerdict(now);
  const day = now.toDateString();
  // Redraw everything when the answer changes or midnight passes (today's list
  // and this week's totals move with the date). Otherwise only the countdown.
  if (day !== lastDay || verdict.state + verdict.reason !== lastAnswer) {
    lastDay = day;
    render();
  } else {
    renderAnswer(now);
  }
}

// Another tab of this page saved something: pick it up so the limits hold everywhere.
window.addEventListener('storage', (e) => {
  if (e.key !== STORAGE_KEY) return;
  load();
  fillRulesForm();
  render();
});

load();
fillRulesForm();
render();
tick();
setInterval(tick, 1000);

