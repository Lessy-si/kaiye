/**
 * Teacher loop: pin what the learner cannot retrieve, drill until
 * two consecutive good ratings with a correct part of speech.
 * State lives on this device only (kaiye-loop-v1).
 */
const KEY = "kaiye-loop-v1";
const UNPIN_STREAK = 2;

function now() {
  return Date.now();
}

function load() {
  try {
    if (typeof localStorage === "undefined") return { seats: {} };
    return JSON.parse(localStorage.getItem(KEY) || '{"seats":{}}') || { seats: {} };
  } catch {
    return { seats: {} };
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

function packBucket(store, seatId, packId) {
  if (!store.seats) store.seats = {};
  if (!store.seats[seatId]) store.seats[seatId] = { packs: {} };
  if (!store.seats[seatId].packs) store.seats[seatId].packs = {};
  if (!store.seats[seatId].packs[packId]) {
    store.seats[seatId].packs[packId] = { cards: {}, skills: {} };
  }
  const bucket = store.seats[seatId].packs[packId];
  if (!bucket.cards) bucket.cards = {};
  if (!bucket.skills) bucket.skills = {};
  return bucket;
}

function freshCard() {
  return {
    pin: false,
    misses: 0,
    hits: 0,
    streak: 0,
    posMisses: 0,
    again: 0,
    hard: 0,
    lastReason: "",
    lastAt: 0
  };
}

function cardRec(bucket, cardId) {
  if (!bucket.cards[cardId]) bucket.cards[cardId] = freshCard();
  return bucket.cards[cardId];
}

function pinCard(rec, reason) {
  rec.pin = true;
  rec.streak = 0;
  rec.lastReason = reason;
  rec.lastAt = now();
}

export function observePos(seatId, packId, cardId, posOk) {
  if (posOk) return { pin: false, reason: "" };
  const store = load();
  const rec = cardRec(packBucket(store, seatId, packId), cardId);
  rec.posMisses += 1;
  rec.misses += 1;
  pinCard(rec, "pos");
  save(store);
  return { pin: true, reason: "pos", misses: rec.misses, first: rec.misses === 1 };
}

export function observeRate(seatId, packId, cardId, rating, posOk) {
  const store = load();
  const rec = cardRec(packBucket(store, seatId, packId), cardId);
  let freed = false;
  if (rating === "again" || rating === "hard" || !posOk) {
    rec.misses += 1;
    if (rating === "again") rec.again += 1;
    if (rating === "hard") rec.hard += 1;
    pinCard(rec, !posOk ? "pos" : rating);
  } else if (rating === "good") {
    rec.hits += 1;
    rec.streak += 1;
    rec.lastAt = now();
    if (rec.pin && rec.streak >= UNPIN_STREAK) {
      rec.pin = false;
      rec.lastReason = "freed";
      freed = true;
    }
  }
  save(store);
  return {
    pin: rec.pin,
    streak: rec.streak,
    need: rec.pin ? Math.max(0, UNPIN_STREAK - rec.streak) : 0,
    again: rec.again,
    freed,
    stubborn: rec.again >= 3
  };
}

function skillKey(kind, unitId) {
  return `${kind}:${unitId || "main"}`;
}

function freshSkill() {
  return { pin: false, misses: 0, lastNote: "", lastAt: 0 };
}

export function observeSpeak(seatId, packId, unitId, cover) {
  const hits = Number(cover.hits) || 0;
  const keys = Number(cover.keys) || 0;
  const askedBack = cover.askBack ? Boolean(cover.askedBack) : true;
  const weak = keys > 0 ? hits < Math.ceil(keys / 2) : false;
  const stuck = weak || !askedBack;
  const store = load();
  const bucket = packBucket(store, seatId, packId);
  const id = skillKey("speak", unitId);
  if (!bucket.skills[id]) bucket.skills[id] = freshSkill();
  const rec = bucket.skills[id];
  if (stuck) {
    rec.pin = true;
    rec.misses += 1;
    rec.lastNote = !askedBack ? "开口缺回问" : `开口要点只盖住 ${hits} / ${keys}`;
    rec.lastAt = now();
  } else {
    rec.pin = false;
    rec.lastNote = "开口要点已盖住";
    rec.lastAt = now();
  }
  save(store);
  return { pin: rec.pin, note: rec.lastNote };
}

export function observeRead(seatId, packId, unitId, correct) {
  const store = load();
  const bucket = packBucket(store, seatId, packId);
  const id = skillKey("read", unitId);
  if (!bucket.skills[id]) bucket.skills[id] = freshSkill();
  const rec = bucket.skills[id];
  if (!correct) {
    rec.pin = true;
    rec.misses += 1;
    rec.lastNote = "这篇阅读第一次没选对";
    rec.lastAt = now();
  } else {
    rec.pin = false;
    rec.lastNote = "这篇阅读已选对";
    rec.lastAt = now();
  }
  save(store);
  return { pin: rec.pin, note: rec.lastNote };
}

export function cardState(seatId, packId, cardId) {
  const store = load();
  return cardRec(packBucket(store, seatId, packId), cardId);
}

export function pinnedWordCards(seatId, packId, packCards) {
  const store = load();
  const bucket = packBucket(store, seatId, packId);
  return (packCards || [])
    .filter((c) => bucket.cards[c.id]?.pin)
    .sort((a, b) => {
      const ra = bucket.cards[a.id];
      const rb = bucket.cards[b.id];
      if (rb.misses !== ra.misses) return rb.misses - ra.misses;
      return (rb.lastAt || 0) - (ra.lastAt || 0);
    });
}

export function skillPins(seatId, packId) {
  const store = load();
  const bucket = packBucket(store, seatId, packId);
  return Object.entries(bucket.skills)
    .filter(([, rec]) => rec.pin)
    .map(([id, rec]) => {
      const [kind, unit] = id.split(":");
      return {
        id,
        kind,
        unit,
        note: rec.lastNote,
        misses: rec.misses,
        lastAt: rec.lastAt
      };
    })
    .sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0));
}

export function watchList(seatId, packId, packCards) {
  const cards = pinnedWordCards(seatId, packId, packCards).map((c) => {
    const rec = cardState(seatId, packId, c.id);
    return {
      id: c.id,
      lemma: c.lemma,
      sense: c.sense,
      misses: rec.misses,
      streak: rec.streak,
      need: Math.max(0, UNPIN_STREAK - rec.streak),
      reason: rec.lastReason,
      stubborn: rec.again >= 3
    };
  });
  return { cards, skills: skillPins(seatId, packId) };
}

export function mergeUnique(front, rest) {
  const seen = new Set();
  const out = [];
  for (const c of [...(front || []), ...(rest || [])]) {
    if (!c || seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

export function nextMove({ isChild, due, pins, skills, unseen, flags }) {
  const pinN = (pins || 0) + (skills || 0);
  if (!isChild && due > 0) {
    return {
      id: "srs",
      label: "先提取到期的词",
      why: "会了的词正在往下掉。先提取，再学新的。"
    };
  }
  if (pinN > 0) {
    return {
      id: "watch",
      label: `先钉牢 ${pinN} 个还不会的`,
      why: isChild ? "这几个还不会，先过再往下。" : "提取不出来的，先钉牢。"
    };
  }
  if (!flags?.review && unseen > 0) {
    return { id: "review", label: "1 开始新词", why: "" };
  }
  if (!flags?.review) {
    return { id: "preview", label: "本课新词已学完", why: "" };
  }
  if (!flags?.speak) {
    return { id: "speak", label: "2 开始口语", why: "" };
  }
  if (!flags?.read) {
    return { id: "read", label: "3 开始阅读", why: "" };
  }
  return { id: "progress", label: "查看进度", why: "今日预习已完成。盯牢空了才算真会。" };
}

export function exportLoop() {
  return JSON.stringify(load(), null, 2);
}

export function unpinNeed() {
  return UNPIN_STREAK;
}
