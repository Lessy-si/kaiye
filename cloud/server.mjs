/**
 * 开页家庭房间。一台轻量应用服务器即可。
 * 同步盯牢 + SRS，不接收照片。
 *
 *   PORT=8787 node cloud/server.mjs
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 8787);
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA = process.env.KAIYE_DATA || path.join(ROOT, "data", "rooms.json");
const MAX = 800_000;

const rooms = new Map();
const live = new Map();

function loadDisk() {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA, "utf8"));
    for (const [code, room] of Object.entries(raw || {})) rooms.set(code, room);
  } catch {
    /* first run */
  }
}

function saveDisk() {
  const dir = path.dirname(DATA);
  fs.mkdirSync(dir, { recursive: true });
  const out = {};
  for (const [code, room] of rooms) out[code] = room;
  fs.writeFileSync(DATA, JSON.stringify(out));
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
}

function send(res, status, body) {
  cors(res);
  const json = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(json);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let n = 0;
    req.on("data", (c) => {
      n += c.length;
      if (n > MAX) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function normCode(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, "")
    .slice(0, 24);
}

function mergeCard(a, b) {
  if (!a) return b;
  if (!b) return a;
  const pin = Boolean(a.pin || b.pin);
  const later = (Number(b.lastAt) || 0) >= (Number(a.lastAt) || 0) ? b : a;
  return {
    pin,
    misses: Math.max(Number(a.misses) || 0, Number(b.misses) || 0),
    hits: Math.max(Number(a.hits) || 0, Number(b.hits) || 0),
    streak: pin ? Math.min(Number(a.streak) || 0, Number(b.streak) || 0) : Math.max(Number(a.streak) || 0, Number(b.streak) || 0),
    posMisses: Math.max(Number(a.posMisses) || 0, Number(b.posMisses) || 0),
    again: Math.max(Number(a.again) || 0, Number(b.again) || 0),
    hard: Math.max(Number(a.hard) || 0, Number(b.hard) || 0),
    lastReason: later.lastReason || a.lastReason || "",
    lastAt: Math.max(Number(a.lastAt) || 0, Number(b.lastAt) || 0)
  };
}

function mergeSkill(a, b) {
  if (!a) return b;
  if (!b) return a;
  const later = (Number(b.lastAt) || 0) >= (Number(a.lastAt) || 0) ? b : a;
  return {
    pin: Boolean(a.pin || b.pin),
    misses: Math.max(Number(a.misses) || 0, Number(b.misses) || 0),
    lastNote: later.lastNote || a.lastNote || "",
    lastAt: Math.max(Number(a.lastAt) || 0, Number(b.lastAt) || 0)
  };
}

function mergeSrs(local, remote) {
  if (!remote) return local;
  if (!local || !local.seen) return remote;
  if (!remote.seen) return local;
  return {
    ease: Math.min(Number(local.ease) || 2.1, Number(remote.ease) || 2.1),
    intervalHours: Math.min(Number(local.intervalHours) || 0, Number(remote.intervalHours) || 0),
    reps: Math.max(Number(local.reps) || 0, Number(remote.reps) || 0),
    lapses: Math.max(Number(local.lapses) || 0, Number(remote.lapses) || 0),
    due: Math.min(Number(local.due) || Infinity, Number(remote.due) || Infinity),
    seen: true
  };
}

function mergeRoom(cur, incoming) {
  const loop = { seats: { ...(cur.loop?.seats || {}) } };
  for (const [seatId, seat] of Object.entries(incoming.loop?.seats || {})) {
    if (!loop.seats[seatId]) loop.seats[seatId] = { packs: {} };
    if (!loop.seats[seatId].packs) loop.seats[seatId].packs = {};
    for (const [packId, bucket] of Object.entries(seat.packs || {})) {
      if (!loop.seats[seatId].packs[packId]) loop.seats[seatId].packs[packId] = { cards: {}, skills: {} };
      const local = loop.seats[seatId].packs[packId];
      for (const [id, rec] of Object.entries(bucket.cards || {})) {
        local.cards[id] = mergeCard(local.cards[id], rec);
      }
      for (const [id, rec] of Object.entries(bucket.skills || {})) {
        local.skills[id] = mergeSkill(local.skills[id], rec);
      }
    }
  }
  const srs = { ...(cur.srs || {}) };
  for (const [k, v] of Object.entries(incoming.srs || {})) {
    const packId = String(k).split(":")[0];
    if (packId !== "g5" && packId !== "ket" && packId !== "ielts") continue;
    srs[k] = mergeSrs(srs[k], v);
  }
  return {
    kind: "kaiye-room-v1",
    deviceId: incoming.deviceId || cur.deviceId,
    at: Date.now(),
    loop,
    srs
  };
}

function broadcast(code, room, except) {
  const set = live.get(code);
  if (!set) return;
  const line = `data: ${JSON.stringify(room)}\n\n`;
  for (const client of set) {
    if (except && client.deviceId === except) continue;
    try {
      client.res.write(line);
    } catch {
      set.delete(client);
    }
  }
}

function notFound(res) {
  send(res, 404, { ok: false, error: "not found" });
}

loadDisk();

const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    send(res, 200, { ok: true, rooms: rooms.size });
    return;
  }

  if (req.method === "GET" && url.pathname === "/v1/pull") {
    const code = normCode(url.searchParams.get("code"));
    if (code.length < 4) {
      send(res, 400, { ok: false, error: "bad code" });
      return;
    }
    send(res, 200, { ok: true, room: rooms.get(code) || null });
    return;
  }

  if (req.method === "GET" && url.pathname === "/v1/live") {
    const code = normCode(url.searchParams.get("code"));
    const deviceId = String(url.searchParams.get("device") || "");
    if (code.length < 4) {
      send(res, 400, { ok: false, error: "bad code" });
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    res.write("\n");
    if (!live.has(code)) live.set(code, new Set());
    const client = { res, deviceId };
    live.get(code).add(client);
    const room = rooms.get(code);
    if (room) res.write(`data: ${JSON.stringify(room)}\n\n`);
    const beat = setInterval(() => {
      try {
        res.write(": ping\n\n");
      } catch {
        clearInterval(beat);
      }
    }, 20000);
    req.on("close", () => {
      clearInterval(beat);
      live.get(code)?.delete(client);
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/v1/push") {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      send(res, 400, { ok: false, error: "bad json" });
      return;
    }
    const code = normCode(body.code);
    if (code.length < 4 || body.kind !== "kaiye-room-v1") {
      send(res, 400, { ok: false, error: "bad room" });
      return;
    }
    const merged = mergeRoom(rooms.get(code) || { loop: { seats: {} }, srs: {} }, body);
    rooms.set(code, merged);
    saveDisk();
    broadcast(code, merged, body.deviceId);
    send(res, 200, { ok: true, room: merged });
    return;
  }

  notFound(res);
});

server.listen(PORT, () => {
  console.log(`kaiye family room :${PORT}`);
});
