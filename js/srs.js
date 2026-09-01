/**
 * Spaced retrieval after Ebbinghaus (1885) + SM-2-style ease.
 * Review sits on the steep part of the forgetting curve:
 * 12h (same-night / next morning) → 2d → 4d → 8d → 16d → 32d.
 * "Again" resets to 12h and, once per session, returns the card to the queue.
 * Matches scripts/srs.py (adult-memory.md). Child packs use the same curve.
 * IELTS / KET cap new cards per day; Grade 5 takes the remaining textbook
 * list of the current unit in one preview (extras only after core is seen).
 */
const KEY = "kaiye-srs-v1";
const FIRST_HOURS = 12;
const MIN_EASE = 1.3;
const START_EASE = 2.1;
const NEW_CAP = { ielts: 20, ket: 12 };

function now() {
  return Date.now();
}

function load() {
  try {
    if (typeof localStorage === "undefined") return {};
    return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function save(store) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota / private mode */
  }
}

function keyOf(packId, cardId) {
  return `${packId}:${cardId}`;
}

function fresh() {
  return {
    ease: START_EASE,
    intervalHours: 0,
    reps: 0,
    lapses: 0,
    due: 0,
    seen: false
  };
}

function getEntry(store, packId, cardId) {
  const k = keyOf(packId, cardId);
  return store[k] || fresh();
}

export function ensureCards(packId, packCards) {
  const store = load();
  let dirty = false;
  for (const c of packCards) {
    const k = keyOf(packId, c.id);
    if (!store[k]) {
      store[k] = fresh();
      dirty = true;
    }
  }
  if (dirty) save(store);
  return store;
}

function capFor(packId) {
  if (packId === "g5") return null;
  return NEW_CAP[packId] ?? 12;
}

export function unseenAll(packId, packCards) {
  const store = ensureCards(packId, packCards);
  return packCards.filter((c) => !getEntry(store, packId, c.id).seen);
}

function todayNewPool(packId, packCards) {
  const unseen = unseenAll(packId, packCards);
  const core = unseen.filter((c) => c.track !== "extra");
  return core.length ? core : unseen;
}

export function unseenQueue(packId, packCards) {
  const pool = todayNewPool(packId, packCards);
  const cap = capFor(packId);
  return cap == null ? pool : pool.slice(0, cap);
}

export function reviewQueue(packId, packCards) {
  const store = ensureCards(packId, packCards);
  const t = now();
  const due = [];
  for (const c of packCards) {
    const s = getEntry(store, packId, c.id);
    if (s.seen && s.due <= t) due.push(c);
  }
  due.sort((a, b) => getEntry(store, packId, a.id).due - getEntry(store, packId, b.id).due);
  return due;
}

export function srsStats(packId, packCards) {
  const store = ensureCards(packId, packCards);
  const t = now();
  let due = 0;
  let unseen = 0;
  let waiting = 0;
  let nextDue = Infinity;
  for (const c of packCards) {
    const s = getEntry(store, packId, c.id);
    if (!s.seen) unseen += 1;
    else if (s.due <= t) due += 1;
    else {
      waiting += 1;
      if (s.due < nextDue) nextDue = s.due;
    }
  }
  const newToday = unseenQueue(packId, packCards).length;
  return {
    due,
    unseen,
    waiting,
    newToday,
    today: due + newToday,
    total: packCards.length,
    nextDue: nextDue === Infinity ? 0 : nextDue
  };
}

function applyRating(entry, rating) {
  const ease = Number(entry.ease) || START_EASE;
  const reps = Number(entry.reps) || 0;
  const interval = Number(entry.intervalHours) || 0;
  const next = { ...entry, seen: true };

  if (rating === "again") {
    next.lapses = (Number(entry.lapses) || 0) + 1;
    next.reps = 0;
    next.ease = Math.max(MIN_EASE, ease - 0.2);
    next.intervalHours = FIRST_HOURS;
  } else if (rating === "hard") {
    next.ease = Math.max(MIN_EASE, ease - 0.15);
    next.intervalHours = reps === 0 ? FIRST_HOURS * 1.5 : Math.max(FIRST_HOURS, interval * 1.2);
    next.reps = reps + 1;
  } else if (rating === "easy") {
    next.ease = ease + 0.1;
    next.intervalHours = reps === 0 ? 48 : Math.max(72, interval * (ease + 0.15));
    next.reps = reps + 1;
  } else {
    if (reps === 0) next.intervalHours = FIRST_HOURS;
    else if (reps === 1) next.intervalHours = 48;
    else next.intervalHours = Math.max(48, interval * ease);
    next.reps = reps + 1;
  }

  next.due = now() + next.intervalHours * 3600 * 1000;
  return next;
}

export function rateCard(packId, cardId, rating) {
  const store = load();
  const next = applyRating(getEntry(store, packId, cardId), rating);
  store[keyOf(packId, cardId)] = next;
  save(store);
  return next;
}

export function formatWait(ms) {
  if (!ms || ms <= 0) return "现在";
  const hours = ms / 3600000;
  if (hours < 1) return "不到 1 小时";
  if (hours < 20) return `${Math.round(hours)} 小时后`;
  const days = hours / 24;
  if (days < 1.6) return "明天";
  if (days < 10) return `${Math.round(days)} 天后`;
  return `${Math.round(days)} 天后`;
}

export function formatInterval(entry) {
  const hours = Number(entry?.intervalHours) || 0;
  if (hours <= 0) return "现在";
  if (hours < 20) return `${Math.round(hours)} 小时后`;
  const days = hours / 24;
  if (days < 1.6) return "明天";
  return `${Math.round(days)} 天后`;
}
