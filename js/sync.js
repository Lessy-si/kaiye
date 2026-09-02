/**
 * Family room: one invite code, two devices, live loop + SRS.
 * Photos and recordings stay on the device.
 */
import { dumpLoop, mergeLoopStore, onLoopChange } from "./loop.js?v=39";
import { dumpPackSrs, mergePackSrs, onSrsChange } from "./srs.js?v=39";

const CFG_KEY = "kaiye-cloud-v1";
const DEV_KEY = "kaiye-device";
const PACKS = ["g5", "ket", "ielts"];

let live = null;
let pushTimer = 0;
let applying = false;
let onRemote = null;
let getCode = () => "";

export function cloudCfg() {
  try {
    return JSON.parse(localStorage.getItem(CFG_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

export function setCloudCfg(partial) {
  const next = { ...cloudCfg(), ...partial };
  localStorage.setItem(CFG_KEY, JSON.stringify(next));
  return next;
}

export function deviceId() {
  let id = localStorage.getItem(DEV_KEY);
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `d-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(DEV_KEY, id);
  }
  return id;
}

export function cloudState() {
  const cfg = cloudCfg();
  const ready = Boolean(cfg.url && cfg.on);
  return {
    on: Boolean(cfg.on),
    url: cfg.url || "",
    live: Boolean(live && live.readyState === 1),
    ready
  };
}

export function bindCloud({ code, onApply }) {
  getCode = code;
  onRemote = onApply;
}

function origin() {
  return String(cloudCfg().url || "")
    .trim()
    .replace(/\/$/, "");
}

function snapshot() {
  return {
    kind: "kaiye-room-v1",
    deviceId: deviceId(),
    at: Date.now(),
    loop: dumpLoop(),
    srs: dumpPackSrs(PACKS)
  };
}

function applyRemote(body) {
  if (!body || body.kind !== "kaiye-room-v1") return;
  if (body.deviceId && body.deviceId === deviceId()) return;
  applying = true;
  try {
    mergeLoopStore(body.loop);
    mergePackSrs(body.srs, PACKS);
    onRemote?.();
  } finally {
    applying = false;
  }
}

async function pushNow() {
  const cfg = cloudCfg();
  const base = origin();
  const code = getCode?.() || "";
  if (!cfg.on || !base || code.length < 4 || applying) return;
  try {
    const res = await fetch(`${base}/v1/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, ...snapshot() })
    });
    if (!res.ok) return;
    const body = await res.json();
    if (body?.room) applyRemote(body.room);
  } catch {
    /* offline: keep local, retry on next save */
  }
}

function schedulePush() {
  if (applying || !cloudCfg().on) return;
  window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(pushNow, 280);
}

export function stopCloud() {
  if (live) {
    live.close();
    live = null;
  }
}

export function startCloud() {
  stopCloud();
  const cfg = cloudCfg();
  const base = origin();
  const code = getCode?.() || "";
  if (!cfg.on || !base || code.length < 4) return;
  const url = `${base}/v1/live?code=${encodeURIComponent(code)}&device=${encodeURIComponent(deviceId())}`;
  try {
    live = new EventSource(url);
  } catch {
    return;
  }
  live.onmessage = (event) => {
    try {
      applyRemote(JSON.parse(event.data));
    } catch {
      /* ignore malformed */
    }
  };
  live.onerror = () => {
    /* browser will retry; pull once */
    pullCloud();
  };
  pullCloud();
}

export async function pullCloud() {
  const cfg = cloudCfg();
  const base = origin();
  const code = getCode?.() || "";
  if (!cfg.on || !base || code.length < 4) return;
  try {
    const res = await fetch(`${base}/v1/pull?code=${encodeURIComponent(code)}`);
    if (!res.ok) return;
    const body = await res.json();
    if (body?.room) applyRemote(body.room);
  } catch {
    /* still local */
  }
}

export async function connectCloud(url) {
  const next = setCloudCfg({ on: true, url: String(url || "").trim().replace(/\/$/, "") });
  if (!next.url) {
    setCloudCfg({ on: false });
    stopCloud();
    return false;
  }
  startCloud();
  await pushNow();
  return true;
}

export function disconnectCloud() {
  setCloudCfg({ on: false });
  stopCloud();
}

onLoopChange(() => schedulePush());
onSrsChange(() => schedulePush());
