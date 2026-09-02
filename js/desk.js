const KEY = "kaiye-desk-v1";
const BOX_PRICE = 40;
const BAN = /免日课|代点亮|补打卡|请假条|买请假|现金|红包|跳过复习|不学今天/;

function shanghaiParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    h: Number(get("hour"))
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export function dayKey(date = new Date()) {
  const p = shanghaiParts(date);
  let { y, m, d, h } = p;
  if (h < 4) {
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() - 1);
    y = dt.getUTCFullYear();
    m = dt.getUTCMonth() + 1;
    d = dt.getUTCDate();
  }
  return `${y}-${pad(m)}-${pad(d)}`;
}

function shiftDay(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function prevDay(key) {
  return shiftDay(key, -1);
}

function nextDay(key) {
  return shiftDay(key, 1);
}

function daysAfter(from, untilInclusive) {
  const out = [];
  if (!from) return out;
  let k = nextDay(from);
  while (k <= untilInclusive) {
    out.push(k);
    k = nextDay(k);
  }
  return out;
}

function blankSeat(id, extra = {}) {
  return {
    id,
    name: "",
    pack: "ielts",
    kind: "empty",
    lamp: 0,
    lampMax: 0,
    freeze: 0,
    ink: 0,
    dust: false,
    paper: "none",
    portrait: null,
    lastLit: null,
    dustSince: null,
    remindCount: 0,
    remindOn: null,
    knockOn: null,
    rolledTo: null,
    ...extra
  };
}

function defaultDesk() {
  return {
    version: 1,
    invite: `开页-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    activeSeat: "parent",
    seats: [
      blankSeat("parent", { name: "妈妈", pack: "ielts", kind: "adult" }),
      blankSeat("child", { name: "孩子", pack: "ket", kind: "child" }),
      blankSeat("s3"),
      blankSeat("s4")
    ],
    box: { pool: [], pending: null, lastDraws: [] },
    days: {},
    toast: ""
  };
}

function normalize(raw) {
  const base = defaultDesk();
  if (!raw || typeof raw !== "object") return base;
  const desk = {
    ...base,
    ...raw,
    seats: base.seats.map((s, i) => ({ ...s, ...(raw.seats?.[i] || {}) })),
    box: { ...base.box, ...(raw.box || {}) },
    days: raw.days && typeof raw.days === "object" ? raw.days : {}
  };
  const parent = desk.seats.find((s) => s.id === "parent");
  if (parent?.name === "爸爸") parent.name = "妈妈";
  return desk;
}

let desk = normalize(null);

try {
  desk = normalize(JSON.parse(localStorage.getItem(KEY) || "null"));
} catch {
  desk = defaultDesk();
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(desk));
}

export function getDesk() {
  return desk;
}

export function saveDesk() {
  persist();
}

export function setInvite(code) {
  const c = String(code || "")
    .trim()
    .replace(/\s+/g, "")
    .slice(0, 24);
  if (c.length < 4) return false;
  desk.invite = c;
  persist();
  return true;
}

export function englishLen(text) {
  return (String(text).match(/[A-Za-z]/g) || []).length;
}

export function minSpeak(packId) {
  return packId === "ielts" ? 20 : 8;
}

export function activeSeat() {
  return desk.seats.find((s) => s.id === desk.activeSeat) || desk.seats[0];
}

function dayRec(seatId = desk.activeSeat, key = dayKey()) {
  const id = `${seatId}:${key}`;
  if (!desk.days[id]) {
    desk.days[id] = { review: false, speak: false, read: false, lit: false, ink: 0 };
  }
  return desk.days[id];
}

export function todayFlags(seatId = desk.activeSeat) {
  return { ...dayRec(seatId) };
}

function occupyCount() {
  return desk.seats.filter((s) => s.kind !== "empty").length;
}

function extinguish(seat, today) {
  if (!seat.lastLit && seat.lamp === 0) return;
  seat.lamp = 0;
  seat.dust = true;
  seat.paper = "none";
  seat.dustSince = today;
  seat.remindCount = 0;
  seat.remindOn = today;
}

export function rollCalendar() {
  const today = dayKey();
  const yest = prevDay(today);
  for (const seat of desk.seats) {
    if (seat.kind === "empty") continue;
    if (seat.rolledTo === today) continue;
    const started = Boolean(seat.lastLit) || seat.lamp > 0;
    if (started && seat.lastLit && seat.lastLit < today) {
      for (const missDay of daysAfter(seat.lastLit, yest)) {
        if (seat.dust) break;
        if (seat.freeze > 0) {
          seat.freeze -= 1;
          seat.lastLit = missDay;
        } else {
          extinguish(seat, missDay);
          break;
        }
      }
    }
    if (seat.dust && seat.dustSince && seat.dustSince < today && seat.remindOn !== today) {
      if (seat.remindCount < 7) seat.remindCount += 1;
      seat.remindOn = today;
    }
    seat.rolledTo = today;
  }
  persist();
}

export function switchSeat(id) {
  const seat = desk.seats.find((s) => s.id === id);
  if (!seat || seat.kind === "empty") return null;
  desk.activeSeat = id;
  persist();
  return seat;
}

export function setSeatPack(seatId, packId) {
  const seat = desk.seats.find((s) => s.id === seatId);
  if (!seat || seat.kind === "empty") return;
  seat.pack = packId;
  persist();
}

export function claimSeat(id, name, pack, kind) {
  const seat = desk.seats.find((s) => s.id === id);
  if (!seat || seat.kind !== "empty") return "座位已被占用。";
  if (occupyCount() >= 4) return "一张课桌最多四人。";
  const n = String(name || "").trim().slice(0, 8);
  if (!n) return "先写显示名。";
  seat.name = n;
  seat.pack = pack || "ket";
  seat.kind = kind === "child" || pack !== "ielts" ? "child" : "adult";
  persist();
  return "";
}

function grantInk(seat, rec, thick, lampAfter) {
  let add = 12;
  if (thick) add += 6;
  if (lampAfter > 0 && lampAfter % 7 === 0) add += 20;
  add = Math.min(38 - rec.ink, add);
  if (add < 0) add = 0;
  rec.ink += add;
  seat.ink += add;
  return add;
}

function tryLight(seatId = desk.activeSeat) {
  const seat = desk.seats.find((s) => s.id === seatId);
  const rec = dayRec(seatId);
  if (!seat || seat.kind === "empty") return null;
  if (rec.lit) return null;
  if (!rec.review || !rec.speak || !rec.read) return null;
  const today = dayKey();
  const wasDust = seat.dust;
  rec.lit = true;
  seat.lamp += 1;
  seat.lampMax = Math.max(seat.lampMax, seat.lamp);
  seat.lastLit = today;
  seat.dust = false;
  seat.dustSince = null;
  seat.remindCount = 0;
  const thick = rec.speak && rec.read;
  seat.paper = thick ? "thick" : "normal";
  if (seat.lamp > 0 && seat.lamp % 7 === 0) {
    seat.freeze = Math.min(2, seat.freeze + 1);
  }
  const ink = grantInk(seat, rec, thick, seat.lamp);
  persist();
  return { justLit: true, ink, thick, lamp: seat.lamp, blewDust: wasDust };
}

export function markReview() {
  dayRec().review = true;
  persist();
  return tryLight();
}

export function markSpeak(text, packId) {
  if (englishLen(text) < minSpeak(packId)) return { short: true };
  dayRec().speak = true;
  persist();
  return tryLight() || { short: false };
}

export function markRead(hasChoice) {
  if (!hasChoice) return null;
  dayRec().read = true;
  persist();
  return tryLight();
}

export function knock(id) {
  const seat = desk.seats.find((s) => s.id === id);
  if (!seat || seat.kind === "empty") return "";
  const today = dayKey();
  const me = activeSeat();
  if (me.knockOn === today) return "今天已经敲过一次。";
  me.knockOn = today;
  persist();
  return `敲了敲 ${seat.name} 的课桌。`;
}

export function setPortrait(dataUrl) {
  const seat = activeSeat();
  seat.portrait = dataUrl;
  persist();
}

export function photocopyPortrait(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("没有照片"));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 360;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const s = Math.min(img.width, img.height);
      const sx = (img.width - s) / 2;
      const sy = (img.height - s) / 2;
      ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("照片读不出"));
    };
    img.src = url;
  });
}

export function proposeReward(title, note, fulfiller, childOnly) {
  const t = String(title || "").trim().slice(0, 20);
  const n = String(note || "").trim().slice(0, 80);
  if (!t) return "先写奖励名。";
  if (BAN.test(t + n)) return "不能写免日课、代点亮或现金。";
  if (desk.box.pool.filter((x) => !x.archived).length >= 8) return "盲盒最多 8 条。";
  desk.box.pool.push({
    id: `b${Date.now()}`,
    title: t,
    note: n,
    fulfiller: fulfiller || "家长",
    childOnly: Boolean(childOnly),
    parentOk: false,
    childOk: false,
    archived: false
  });
  persist();
  return "";
}

export function agreeReward(id, who) {
  const item = desk.box.pool.find((x) => x.id === id);
  if (!item) return;
  if (who === "parent") item.parentOk = true;
  if (who === "child") item.childOk = true;
  persist();
}

export function readyPool() {
  return desk.box.pool.filter((x) => !x.archived && x.parentOk && x.childOk);
}

export function openBox() {
  const seat = activeSeat();
  if (desk.box.pending) return "还有一条待兑现。";
  if ((seat.lampMax || 0) < 1 && !todayFlags().lit) return "这个座位先自己点亮过，才能拆盒。";
  if (seat.ink < BOX_PRICE) return `还差 ${BOX_PRICE - seat.ink} 墨滴。`;
  const pool = readyPool();
  if (pool.length < 3) return `池子要满 3 条才能拆（现在 ${pool.length}）。`;
  let choices = pool;
  const last = desk.box.lastDraws || [];
  if (last.length >= 5 && last.every((id) => id === last[0]) && pool.length >= 3) {
    choices = pool.filter((x) => x.id !== last[0]);
    if (!choices.length) choices = pool;
  }
  const hit = choices[Math.floor(Math.random() * choices.length)];
  seat.ink -= BOX_PRICE;
  desk.box.pending = {
    id: hit.id,
    title: hit.title,
    note: hit.note,
    fulfiller: hit.fulfiller,
    openedBy: seat.name,
    openedOn: dayKey()
  };
  desk.box.lastDraws = [...last, hit.id].slice(-6);
  persist();
  return "";
}

export function fulfillPending() {
  desk.box.pending = null;
  persist();
}

export function resonance() {
  const today = dayKey();
  return desk.seats.filter((s) => s.kind !== "empty" && s.lastLit === today).length >= 2;
}

export function remindBanner() {
  const seat = activeSeat();
  if (!seat.dust) return "";
  if ((seat.remindCount || 0) > 7) return "";
  const n = Math.max(1, seat.remindCount || 1);
  if (seat.kind === "child") return "课桌上的灰还在。今天坐下，灯会再亮。";
  return `灯灭第 ${n} 天。最长曾是 ${seat.lampMax}。`;
}

rollCalendar();
