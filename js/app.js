import { PACKS, SHELF, packTheme, isChildPack } from "./packs.js?v=38";
import {
  getDesk,
  activeSeat,
  switchSeat as deskSwitch,
  setSeatPack,
  claimSeat,
  todayFlags,
  markReview,
  markSpeak,
  markRead,
  englishLen,
  minSpeak,
  photocopyPortrait,
  setPortrait,
  knock,
  proposeReward,
  agreeReward,
  readyPool,
  openBox,
  fulfillPending,
  resonance,
  remindBanner,
  dayKey
} from "./desk.js?v=38";
import { speech, toggleRecord, playBlob, resetSpeech } from "./speak-audio.js?v=38";
import { unseenQueue, reviewQueue, rateCard, srsStats, formatInterval, formatWait, unseenAll, dumpPackSrs, mergePackSrs } from "./srs.js?v=38";
import {
  observePos,
  observeRate,
  observeSpeak,
  observeRead,
  pinnedWordCards,
  watchList,
  mergeUnique,
  nextMove,
  exportLoop,
  cardState,
  buildSlip,
  parseSlip,
  importSlip
} from "./loop.js?v=38";

const POS = [
  { id: "n.", zh: "名词" },
  { id: "v.", zh: "动词" },
  { id: "adj.", zh: "形容词" },
  { id: "adv.", zh: "副词" },
  { id: "conj.", zh: "连词" },
  { id: "prep.", zh: "介词" },
  { id: "det.", zh: "限定词" },
  { id: "phr.", zh: "短语" }
];

const POS_ZH = Object.fromEntries(POS.map((p) => [p.id, p.zh]));
const SHARE_URL = "https://lessy-si.github.io/kaiye/get.html";
const EYE_KEY = "kaiye-eye";
let installPrompt = null;

const MORE_VIEWS = new Set(["more", "memory", "progress", "shop", "srs", "install", "slip"]);
const PREVIEW_VIEWS = new Set(["preview", "review", "speak", "read"]);

const state = {
  packId: localStorage.getItem("kaiye-pack") || "ielts",
  view: "today",
  cardIndex: 0,
  chosenPos: "",
  revealed: false,
  speakText: "",
  readChoice: "",
  readChecked: false,
  grammarIndex: 0,
  grammarRevealed: false,
  reviewDone: false,
  queue: [],
  againOnce: {},
  drill: "preview",
  childMenuOpen: false,
  g5Unit: localStorage.getItem("kaiye-g5-unit") || "u1"
};

const $ = (id) => document.getElementById(id);

function pack() {
  return PACKS[state.packId] || PACKS.ielts;
}

function syncFromSeat() {
  const seat = activeSeat();
  if (seat?.pack && PACKS[seat.pack]) {
    state.packId = seat.pack;
    localStorage.setItem("kaiye-pack", seat.pack);
  }
  const flags = todayFlags();
  state.reviewDone = Boolean(flags.review);
}

syncFromSeat();

function toast(msg) {
  const el = $("toast");
  if (!el || !msg) return;
  el.textContent = msg;
  el.hidden = false;
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => {
    el.hidden = true;
  }, 2400);
}

function applyLight(result) {
  if (!result?.justLit) return;
  const dust = result.blewDust ? "灰吹掉了。" : "";
  toast(`${dust}灯亮了 · 灯火 ${result.lamp} · 墨滴 +${result.ink}`);
}

function setPack(id) {
  if (!PACKS[id] || id === state.packId) {
    state.childMenuOpen = false;
    if (id === state.packId) render();
    return;
  }
  if (isChildPack(id)) {
    const child = getDesk().seats.find((s) => s.kind === "child");
    if (child) {
      setSeatPack(child.id, id);
      deskSwitch(child.id);
    }
  } else {
    const adult = getDesk().seats.find((s) => s.kind === "adult");
    if (adult) deskSwitch(adult.id);
  }
  state.packId = id;
  localStorage.setItem("kaiye-pack", id);
  state.view = "today";
  state.cardIndex = 0;
  state.queue = [];
  state.againOnce = {};
  state.chosenPos = "";
  state.revealed = false;
  state.speakText = "";
  state.readChoice = "";
  state.readChecked = false;
  state.grammarIndex = 0;
  state.grammarRevealed = false;
  state.childMenuOpen = false;
  resetSpeech();
  syncFromSeat();
  document.body.dataset.theme = packTheme(id);
  render();
}

function toggleChildMenu(event) {
  event?.stopPropagation();
  state.childMenuOpen = !state.childMenuOpen;
  render();
}

function setView(view) {
  if (view === "preview") {
    openPreview();
    return;
  }
  if (view === "review") {
    startWordDrill("preview");
    return;
  }
  if (view === "srs") {
    startWordDrill("srs");
    return;
  }
  if (view === "watch") {
    startWordDrill("watch");
    return;
  }
  if (view === "speak" || view === "read") {
    const f = todayFlags();
    if (view === "speak" && !f.review) {
      toast("先完成第 1 步：新词。");
      openPreview();
      return;
    }
    if (view === "read" && !f.speak) {
      toast("先完成第 2 步：口语。");
      openPreview();
      return;
    }
  }
  state.view = view;
  render();
}

function openPreview() {
  const p = pack();
  const due = reviewQueue(p.id, packCards()).length;
  if (!isChildPack(p.id) && due) {
    toast("先把到期的词提取出来，再学新的。");
    startWordDrill("srs");
    return;
  }
  const unseen = unseenQueue(p.id, cards());
  if (!unseen.length && !todayFlags().review) {
    applyLight(markReview());
  }
  state.view = "preview";
  render();
}

function packCards() {
  return pack().cards || [];
}

function findCard(id) {
  if (!id) return null;
  return packCards().find((c) => c.id === id) || cards().find((c) => c.id === id) || null;
}

function startWordDrill(drill) {
  const p = pack();
  const seatId = activeSeat().id;
  const all = packCards();
  const unit = cards();
  const pins = pinnedWordCards(seatId, p.id, all);
  let list;
  if (drill === "watch") list = pins;
  else if (drill === "srs") list = mergeUnique(pins, reviewQueue(p.id, all));
  else {
    const here = pins.filter((c) => unit.some((u) => u.id === c.id));
    list = mergeUnique(here, unseenQueue(p.id, unit));
  }
  if (drill === "watch" && !list.length) {
    toast("现在没有卡住的词。");
    state.view = "today";
    render();
    return;
  }
  state.drill = drill;
  state.queue = list.map((c) => c.id);
  state.cardIndex = 0;
  state.againOnce = {};
  state.chosenPos = "";
  state.revealed = false;
  state.reviewDone = state.queue.length === 0;
  state.view = drill === "srs" ? "srs" : "review";
  if (drill === "preview" && state.reviewDone) {
    applyLight(markReview());
    state.view = "preview";
  }
  render();
}

function card() {
  return findCard(state.queue[state.cardIndex]);
}

function cards() {
  const p = pack();
  const list = p.cards || [];
  if (p.id === "g5") return list.filter((c) => c.unit === g5ActiveId());
  if (p.activeUnit) return list.filter((c) => !c.unit || c.unit === p.activeUnit);
  return list;
}

function currentUnit() {
  const p = pack();
  if (p.id !== "g5") return (p.units || []).find((u) => u.id === p.activeUnit) || p.units?.[0];
  return (p.units || []).find((u) => u.id === g5ActiveId()) || p.units?.[0];
}

function g5ActiveId() {
  return state.g5Unit || pack().activeUnit || "u1";
}

function g5CoreCards(unitId) {
  return (pack().cards || []).filter((c) => c.unit === unitId && c.track !== "extra");
}

function unitUnlocked(id) {
  const units = pack().units || [];
  const i = units.findIndex((u) => u.id === id);
  if (i <= 0) return true;
  const prev = units[i - 1];
  if (!prev?.ready || !prev.words) return false;
  return unseenAll("g5", g5CoreCards(prev.id)).length === 0;
}

function setG5Unit(id) {
  if (pack().id !== "g5") return;
  const unit = (pack().units || []).find((u) => u.id === id);
  if (!unit) return;
  if (!unitUnlocked(id)) {
    toast("先把上一课的课内词学完，再进这一课。");
    return;
  }
  if (!unit.ready) {
    toast(unit.note || "这一课单词表还没录入。");
    return;
  }
  state.g5Unit = id;
  localStorage.setItem("kaiye-g5-unit", id);
  state.grammarIndex = 0;
  state.queue = [];
  state.cardIndex = 0;
  state.view = "today";
  render();
}

function unitRail() {
  if (pack().id !== "g5") return "";
  const uid = g5ActiveId();
  const btns = (pack().units || [])
    .map((u) => {
      const lock = !unitUnlocked(u.id);
      const empty = !u.ready;
      const on = u.id === uid ? " is-on" : "";
      const cls = `unit-chip${on}${lock || empty ? " is-lock" : ""}`;
      const label = `U${u.n}`;
      return `<button type="button" class="${cls}" onclick="window.Kaiye.setG5Unit('${u.id}')">${label}</button>`;
    })
    .join("");
  const u = currentUnit();
  const core = g5CoreCards(u?.id);
  const extra = (pack().cards || []).filter((c) => c.unit === u?.id && c.track === "extra");
  const left = unseenAll("g5", core).length;
  const extraLeft = unseenAll("g5", extra).length;
  const path = (u?.path || []).map((name) => `<span>${name}</span>`).join("<span class='path-arrow'>→</span>");
  return `
    <div class="unit-rail" aria-label="单元">${btns}</div>
    <p class="unit-ask">${u?.n ? `Unit ${u.n}` : ""} · ${escapeHtml(u?.ask || "")}</p>
    <div class="path-row">${path}</div>
    <p class="meta">课内还剩 ${left} / ${core.length}。拓展 ${extra.length ? `${extraLeft} / ${extra.length}（课内见过才出现）` : "本课无"}。预习按本课词表一次学完。</p>
  `;
}

function sayOf(c) {
  return c?.say || c?.lemma || "";
}

const EAR = `<svg class="ear-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 9h3.15L12 5v14l-4.85-4H4V9z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M15.7 9.1a3.7 3.7 0 0 1 0 5.8M18.6 6.8a7 7 0 0 1 0 10.4"/></svg>`;

function earBtn(onclick, label, mark = "", cls = "") {
  const off = /\bis-off\b/.test(cls);
  const markHtml = mark ? `<span class="ear-mark">${mark}</span>` : "";
  return `<button type="button" class="ear${cls ? ` ${cls}` : ""}" aria-label="${label}" title="${label}" ${off ? "disabled" : ""} onclick="${onclick}">${EAR}${markHtml}</button>`;
}

function ipaPlay(onclick, accent, ipa) {
  return `<button type="button" class="ipa-play" aria-label="听${accent}音" onclick="${onclick}">${EAR}<span class="ipa-acc">${accent}</span><span>${ipa || ""}</span></button>`;
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hitEnglish(text, lemma) {
  const raw = String(lemma || "").replace(/\s*\.\.\.\s*/g, " ").trim();
  if (!text) return "";
  if (!raw) return escapeHtml(text);
  const tokens = [...new Set(raw.split(/\s+/).filter((w) => w.length > 1))];
  if (!tokens.length) return escapeHtml(text);
  const re = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "ig");
  return escapeHtml(text).replace(re, '<em class="hit">$1</em>');
}

function wordHero(c, revealed) {
  if (!revealed) {
    return `<section class="word-hero">
      <p class="hero-word">${escapeHtml(c.prompt)}</p>
      <p class="hero-hint">${pack().copy.posAsk}</p>
    </section>`;
  }
  return `<section class="word-hero">
    <p class="hero-word" lang="en">${escapeHtml(c.lemma)}</p>
    <div class="hero-ipa">
      ${ipaPlay("window.Kaiye.playUk()", "英", c.ipaUk)}
      ${ipaPlay("window.Kaiye.playUs()", "美", c.ipaUs)}
    </div>
  </section>`;
}

function grammar() {
  const list = currentUnit()?.grammar || pack().grammar || [];
  if (!list.length) return null;
  return list[state.grammarIndex % list.length];
}

function unitSpeak() {
  return currentUnit()?.speak || pack().speak;
}

function unitRead() {
  return currentUnit()?.read || pack().read;
}

function renderShelf() {
  $("shelf").innerHTML = SHELF.map((item) => {
    if (item.type === "pack") {
      const p = PACKS[item.id];
      const on = item.id === state.packId ? " is-on" : "";
      return `<button class="book${on}" type="button" role="tab" aria-selected="${item.id === state.packId}" onclick="window.Kaiye.setPack('${item.id}')">${p.examShort}</button>`;
    }
    const childSeat = getDesk().seats.find((s) => s.kind === "child");
    const currentId = item.packs.includes(state.packId)
      ? state.packId
      : item.packs.includes(childSeat?.pack)
        ? childSeat.pack
        : item.packs[0];
    const current = PACKS[currentId];
    const on = item.packs.includes(state.packId) ? " is-on" : "";
    const open = state.childMenuOpen ? " is-open" : "";
    const options = item.packs
      .map((id) => {
        const p = PACKS[id];
        const sel = id === state.packId ? " is-on" : "";
        return `<button type="button" class="${sel}" role="option" aria-selected="${id === state.packId}" onclick="window.Kaiye.setPack('${id}')">${p.examShort}</button>`;
      })
      .join("");
    const coming = (item.coming || [])
      .map(
        (c) =>
          `<button type="button" disabled>${c.label}<span>即将加入</span></button>`
      )
      .join("");
    return `<div class="book-menu${open}">
      <button class="book${on}" type="button" aria-haspopup="listbox" aria-expanded="${state.childMenuOpen}" onclick="window.Kaiye.toggleChildMenu(event)">${current.examShort} ▾</button>
      <div class="menu" role="listbox" aria-label="孩子的练习册">${options}${coming}</div>
    </div>`;
  }).join("");
}

function navItems() {
  const c = pack().copy;
  return [
    ["today", c.navToday],
    ["desk", "课桌"],
    ["preview", "预习"],
    ["more", "更多"]
  ];
}

function renderNav() {
  $("nav").innerHTML = navItems()
    .map(
      ([id, label]) =>
        `<button type="button" class="${navOn(id) ? "is-on" : ""}" data-view="${id}" onclick="window.Kaiye.setView('${id}')">${label}</button>`
    )
    .join("");
}

function navOn(id) {
  if (id === "more") return MORE_VIEWS.has(state.view);
  if (id === "preview") return PREVIEW_VIEWS.has(state.view);
  return state.view === id;
}

function renderDock() {
  const ico = {
    today: `<svg class="dock-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.7" d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6"/></svg>`,
    desk: `<svg class="dock-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="11" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path fill="none" stroke="currentColor" stroke-width="1.7" d="M4 11h16M8 7V5.5M16 7V5.5"/></svg>`,
    preview: `<svg class="dock-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M6 5.5h9.5A2.5 2.5 0 0 1 18 8v11.5H8A2 2 0 0 1 6 17.5V5.5z"/><path fill="none" stroke="currentColor" stroke-width="1.7" d="M6 17.5A2 2 0 0 1 8 15.5h10"/></svg>`,
    more: `<svg class="dock-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6.5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="17.5" cy="12" r="1.4" fill="currentColor"/></svg>`
  };
  const items = [
    ["today", pack().copy.navToday],
    ["desk", "课桌"],
    ["preview", "预习"],
    ["more", "更多"]
  ];
  $("dock").innerHTML = items
    .map(
      ([id, label]) =>
        `<button type="button" class="${navOn(id) ? "is-on" : ""}" onclick="window.Kaiye.setView('${id}')">${ico[id] || ""}<span>${label}</span></button>`
    )
    .join("");
}

function needRow() {
  const f = todayFlags();
  const lit = f.lit;
  const bits = [
    ["1 新词", f.review],
    ["2 口语", f.speak],
    ["3 阅读", f.read]
  ];
  return `
    <div class="need" aria-label="今日预习">
      <span class="${lit ? "ok" : ""}">${lit ? "今日已点亮" : "灯还没亮"}</span>
      ${bits.map(([n, ok]) => `<span class="${ok ? "ok" : ""}">${n}${ok ? " ✓" : ""}</span>`).join("")}
    </div>
  `;
}

function viewPreview() {
  const p = pack();
  const f = todayFlags();
  const srs = srsStats(p.id, cards());
  const n1 = unseenQueue(p.id, cards()).length;
  const steps = [
    {
      n: 1,
      title: "新词",
      done: f.review,
      lock: false,
      go: "review",
      meta: f.review
        ? "已学，进入间隔复习"
        : n1
          ? p.id === "g5"
            ? `本课 ${n1} 个词，一次学完`
            : `${n1} 个今天要先会`
          : "本课新词已学完"
    },
    {
      n: 2,
      title: "口语",
      done: f.speak,
      lock: !f.review,
      go: "speak",
      meta: f.speak ? "已开口" : "用今天的词说完整句子"
    },
    {
      n: 3,
      title: "阅读",
      done: f.read,
      lock: !f.speak,
      go: "read",
      meta: f.read ? "已完成" : "读完再判断"
    }
  ];
  const cardsHtml = steps
    .map((s) => {
      const cls = `step${s.done ? " is-done" : ""}${s.lock ? " is-lock" : ""}`;
      const action = s.lock
        ? `onclick="window.Kaiye.lockedStep(${s.n})"`
        : `onclick="window.Kaiye.setView('${s.go}')"`;
      return `<button type="button" class="${cls}" ${action}>
        <span class="step-n">${s.done ? "✓" : s.n}</span>
        <span class="step-body"><b>${s.title}</b><small>${s.meta}</small></span>
      </button>`;
    })
    .join("");
  return `
    ${bannerBlock()}
    ${watchBar()}
    ${unitRail()}
    <p class="kicker">预习</p>
    <p class="lede">按 1 → 2 → 3 做完才点亮。不会的词钉在盯牢里反复出现，直到连对两次。灯亮了也不等于会了。</p>
    <div class="steps">${cardsHtml}</div>
    ${srs.due ? `<p class="meta">另有 ${srs.due} 个快忘词，去「更多」取。</p>` : ""}
  `;
}

function viewToday() {
  const p = pack();
  const t = p.today;
  const seat = activeSeat();
  const srs = srsStats(p.id, packCards());
  const f = todayFlags();
  const step = !f.review ? 1 : !f.speak ? 2 : !f.read ? 3 : 0;
  const move = teacherMove();
  const headline =
    move.id === "watch" ? "先钉牢不会的" : move.id === "srs" ? "先提取到期词" : step ? `预习第 ${step} 步` : "今日预习已完成";
  const hint = move.why || t.mainWhy;

  return `
    ${bannerBlock()}
    ${watchBar()}
    ${unitRail()}
    <section class="word-hero" style="display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; opacity: 0.75; margin-bottom: 0.5rem;">
        <span>${seat.name}的座位</span>
        <span>预计 ${t.minutes}</span>
      </div>
      <h1 class="hero-word" style="font-size: 2.2rem; margin: 0.2rem 0 0.8rem;">${headline}</h1>
      <p class="hero-hint" style="font-size: 0.95rem; line-height: 1.5; opacity: 0.9; margin: 0 0 1.5rem; max-width: 95%;">${hint}</p>

      <button class="primary" style="background: var(--bg); color: var(--ink); width: max-content; padding: 0.65rem 1.5rem;" type="button" onclick="window.Kaiye.setView('${move.id}')">${move.label}</button>
    </section>

    ${needRow()}

    ${srs.due > 0 ? `
    <article class="panel" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-color: var(--accent);" onclick="window.Kaiye.setView('srs')">
      <div>
        <h3 style="margin: 0 0 0.3rem; font-size: 1.05rem;">艾宾浩斯复习</h3>
        <p class="meta" style="font-size: 0.88rem; color: var(--accent);">有 ${srs.due} 个快忘词到期</p>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </article>
    ` : `
    <article class="panel">
      <h3 style="margin: 0 0 0.3rem; font-size: 1.05rem;">艾宾浩斯复习</h3>
      <p class="meta" style="font-size: 0.88rem;">今天暂无快忘词。会了的词不用每天刷。</p>
    </article>
    `}
  `;
}

function figureHtml(seat) {
  if (seat.portrait) {
    return `<img class="figure" alt="" src="${seat.portrait}" />`;
  }
  const mark = (seat.name || "?").slice(0, 1);
  return `<div class="figure is-blank" aria-hidden="true">${mark}</div>`;
}

function paperLabel(paper) {
  if (paper === "thick") return "厚稿纸";
  if (paper === "normal") return "稿纸";
  return "无稿纸";
}

function bannerBlock() {
  const msg = remindBanner();
  return msg ? `<p class="banner">${msg}</p>` : "";
}

function loopUnitId() {
  return pack().id === "g5" ? g5ActiveId() : "main";
}

function reasonZh(reason) {
  if (reason === "pos") return "词性";
  if (reason === "again") return "再来";
  if (reason === "hard") return "吃力";
  if (reason === "freed") return "已拿掉";
  return reason || "";
}

function watchBar() {
  const seat = activeSeat();
  const p = pack();
  const watch = watchList(seat.id, p.id, packCards());
  if (!watch.cards.length && !watch.skills.length) return "";
  const child = isChildPack(p.id);
  const words = watch.cards
    .slice(0, 8)
    .map((c) => {
      const stubborn = c.stubborn ? " is-stubborn" : "";
      return `<button type="button" class="watch-word${stubborn}" onclick="window.Kaiye.setView('watch')">
        <b lang="en">${escapeHtml(c.lemma)}</b>
        <small>${c.misses} 次${c.stubborn ? " · 反复不会" : ""}</small>
      </button>`;
    })
    .join("");
  const more = watch.cards.length > 8 ? `<span class="meta">另有 ${watch.cards.length - 8} 个</span>` : "";
  const skills = watch.skills.map((s) => `<p class="watch-skill">${escapeHtml(s.note)}</p>`).join("");
  return `
    <section class="watch" aria-label="盯牢">
      <div class="watch-head">
        <p class="kicker">盯牢</p>
        <button class="tiny" type="button" onclick="window.Kaiye.setView('watch')">现在练</button>
      </div>
      <p class="watch-why">${child ? "这几个还不会，先过再往下。" : "提取不出来的，先钉牢。灯亮了也不算会。"}</p>
      <div class="watch-words">${words}${more}</div>
      ${skills}
    </section>
  `;
}

function teacherMove() {
  const p = pack();
  const seat = activeSeat();
  const all = packCards();
  const watch = watchList(seat.id, p.id, all);
  return nextMove({
    isChild: isChildPack(p.id),
    due: reviewQueue(p.id, all).length,
    pins: watch.cards.length,
    skills: watch.skills.length,
    unseen: unseenQueue(p.id, cards()).length,
    flags: todayFlags()
  });
}

function viewDesk() {
  const d = getDesk();
  const today = dayKey();
  const me = activeSeat();
  const pin = d.box.pending
    ? `<div class="pin"><p class="kicker">待兑现</p><p><b>${d.box.pending.title}</b> · ${d.box.pending.fulfiller}给 ${d.box.pending.openedBy}</p><button class="tiny" type="button" onclick="window.Kaiye.fulfill()">已给</button></div>`
    : "";
  const stack = resonance()
    ? `<p class="shared-stack">两人以上今天都亮了。桌中央多一叠共享稿纸。</p>`
    : "";
  const seats = d.seats
    .map((seat, i) => {
      if (seat.kind === "empty") {
        const lineClass = i % 2 === 0 ? "blue" : "orange";
        return `
          <article class="seat is-empty">
            <div class="empty-head">空座位 <svg class="squiggle ${lineClass}" viewBox="0 0 40 12"><path d="M0 6 Q 5 0, 10 6 T 20 6 T 30 6 T 40 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></div>
            <form class="claim" onsubmit="window.Kaiye.claim(event, '${seat.id}')">
              <input class="claim-input" name="name" maxlength="8" placeholder="显示名" aria-label="显示名" />
              <div class="seat-btns">
                <button class="btn-sit-empty blue" type="submit" data-pack="ielts">IELTS 坐下</button>
                <button class="btn-sit-empty orange" type="submit" data-pack="ket">KET 坐下</button>
              </div>
            </form>
          </article>
        `;
      }

      const lit = seat.lastLit === today;
      const on = seat.id === me.id ? " is-on" : "";
      const dust = seat.dust ? " is-dust" : "";
      const isChild = seat.pack !== "ielts";
      const colorClass = isChild ? "orange" : "blue";

      return `
        <article class="seat${on}${dust}">
          <div class="seat-top">
            ${figureHtml(seat)}
            <div class="seat-info">
              <p class="seat-name">${seat.name}</p>
              <p class="seat-meta">${PACKS[seat.pack]?.examShort || seat.pack}</p>
              <div class="seat-lamp">
                <span class="lamp-dot ${colorClass} ${lit ? "lit" : ""}"></span>
                灯 ${seat.lamp}
              </div>
              <p class="seat-paper">${paperLabel(seat.paper)}</p>
            </div>
          </div>
          <div class="seat-btns">
            <button class="btn-sit ${colorClass}" type="button" onclick="window.Kaiye.useSeat('${seat.id}')">坐下</button>
            <button class="btn-knock" type="button" onclick="window.Kaiye.knock('${seat.id}')">敲一敲</button>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    ${bannerBlock()}
    <div class="desk-hero"></div>
    ${pin}
    ${stack}
    <div class="desk-grid">${seats}</div>
    <div class="desk-actions">
      <div class="action-card photo" onclick="window.Kaiye.pickPhoto()">
        <div class="action-icon">🖼️</div>
        <div class="action-text">
          <b>给这个座位贴照片</b>
        </div>
        <div class="action-arrow">›</div>
      </div>
      <div class="action-card shop" onclick="window.Kaiye.setView('shop')">
        <div class="action-icon">🏪</div>
        <div class="action-text">
          <b>墨水店</b>
          <span>兑换道具和装饰</span>
        </div>
        <div class="action-arrow">›</div>
      </div>
    </div>
  `;
}

function viewMore() {
  const p = pack();
  const srs = srsStats(p.id, packCards());
  const watch = watchList(activeSeat().id, p.id, packCards());
  const dueLabel = srs.due ? `${srs.due} 个快忘` : srs.nextDue ? `下一波 ${formatWait(srs.nextDue - Date.now())}` : "暂无到期";
  const pinLabel = watch.cards.length + watch.skills.length ? `${watch.cards.length + watch.skills.length} 个还不会` : "暂时没有钉子";
  return `
    <p class="kicker">更多</p>
    <div class="more-grid">
      <button type="button" onclick="window.Kaiye.setView('watch')"><b>盯牢</b><span>${pinLabel} · 反复到记住</span></button>
      <button type="button" onclick="window.Kaiye.setView('srs')"><b>复习单词</b><span>艾宾浩斯 · ${dueLabel}</span></button>
      <button type="button" onclick="window.Kaiye.setView('memory')"><b>词表</b><span>课后单词与语法对照</span></button>
      <button type="button" onclick="window.Kaiye.setView('progress')"><b>进度</b><span>灯火、墨滴、本周练习</span></button>
      <button type="button" onclick="window.Kaiye.setView('shop')"><b>墨水店</b><span>家里写进盲盒的奖</span></button>
      <button type="button" onclick="window.Kaiye.setView('slip')"><b>孩子的练习怎么转</b><span>学习机发给家里，盯牢接着转</span></button>
      <button type="button" onclick="window.Kaiye.setView('install')"><b>装到这台设备</b><span>平板 / 希沃学习机 · 可离线</span></button>
      <button type="button" onclick="window.Kaiye.toggleEye()"><b>护眼台灯</b><span>${eyeOn() ? "开着 · 字暖、蓝光低" : "关着 · 适合夜间亮屏"}</span></button>
    </div>
  `;
}

function viewInstall() {
  const ready = Boolean(installPrompt);
  const home = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  return `
    <p class="kicker">装到这台设备</p>
    <article class="panel">
      <h2>平板和学习机</h2>
      <p>发给孩子这个地址，用浏览器打开后装到桌面。第一次需要联网，之后可离线。</p>
      <p class="gate-url" lang="en">${SHARE_URL.replace("https://", "")}</p>
      <div class="actions" style="margin-top: 1rem;">
        <button class="primary" type="button" ${home ? "disabled" : ""} onclick="window.Kaiye.installApp()">${home ? "已经装在这台设备上" : ready ? "装到主屏幕" : "看装法"}</button>
        <button class="ghost" type="button" onclick="window.Kaiye.copyShare()">复制地址</button>
      </div>
    </article>
    <article class="panel">
      <p><b>希沃 / 学习机</b> 自带浏览器打开地址 → 菜单「添加到桌面」。</p>
      <p><b>安卓平板</b> Chrome 菜单「安装应用」或「添加到主屏幕」。</p>
      <p><b>iPad</b> Safari 分享 → 添加到主屏幕。不要用微信打开。</p>
      <p class="meta">进度先留在这台机器。练完后：更多 → 孩子的练习怎么转 → 发给家里。</p>
    </article>
  `;
}

function childSeat() {
  return getDesk().seats.find((s) => s.kind === "child") || { id: "child", name: "孩子" };
}

function childPackId() {
  return isChildPack(pack().id) ? pack().id : childSeat().pack || "g5";
}

function currentSlip() {
  const child = childSeat();
  const packId = childPackId();
  const p = PACKS[packId] || pack();
  const seat = isChildPack(pack().id) ? activeSeat() : child;
  const unit = packId === "g5" ? (p.units || []).find((u) => u.id === g5ActiveId()) : null;
  return buildSlip({
    seatId: seat.id,
    seatName: seat.name,
    packId,
    packTitle: p.examShort || packId,
    unitLabel: unit?.n ? `Unit ${unit.n}` : "",
    srs: dumpPackSrs(["g5", "ket"]),
    cards: p.cards || []
  });
}

function viewSlip() {
  const packId = childPackId();
  const p = PACKS[packId] || pack();
  const watch = watchList(childSeat().id, packId, p.cards || []);
  const pinN = watch.cards.length + watch.skills.length;
  return `
    <p class="kicker">孩子的练习怎么转</p>
    <article class="panel">
      <h2>三环，不上云</h2>
      <p>学习机里：选错就钉住，下次打开先练，连对两次才拿掉。现在孩子座位盯牢 ${pinN} 个。</p>
      <p>发给家里：把家书贴到微信。家长在这台设备收下后，家里课桌接着盯同一批词。</p>
      <p class="meta">照片和录音不随家书走。成人雅思卡也不会混进去。</p>
      <div class="actions">
        <button class="primary" type="button" onclick="window.Kaiye.copySlip()">发给家里</button>
        <button class="ghost" type="button" onclick="document.getElementById('slip-file').click()">从文件收下</button>
      </div>
    </article>
    <article class="panel">
      <label class="kicker" for="slip-box">收下孩子的练习</label>
      <textarea id="slip-box" class="slip-box" placeholder="把学习机复制的整段家书贴在这里。"></textarea>
      <div class="actions">
        <button class="primary" type="button" onclick="window.Kaiye.takeSlip()">收下</button>
      </div>
    </article>
  `;
}

function viewShop() {
  const d = getDesk();
  const me = activeSeat();
  const pool = d.box.pool
    .filter((x) => !x.archived)
    .map((x) => {
      const ready = x.parentOk && x.childOk;
      return `<div class="stat">
        <span><b>${x.title}</b> · ${x.fulfiller}${ready ? " · 已入池" : ""}</span>
        <span>
          ${x.parentOk ? "" : `<button class="tiny" type="button" onclick="window.Kaiye.agree('${x.id}','parent')">家长同意</button>`}
          ${x.childOk ? "" : `<button class="tiny" type="button" onclick="window.Kaiye.agree('${x.id}','child')">孩子同意</button>`}
        </span>
      </div>
      ${x.note ? `<p class="meta">${x.note}</p>` : ""}`;
    })
    .join("");
  return `
    <p class="kicker">墨水店</p>
    <article class="panel">
      <h2>信封盲盒 · 40 墨滴</h2>
      <p class="meta">现有 ${me.ink} 墨滴。池中就绪 ${readyPool().length} 条（要满 3 条才能拆）。两边都要点同意。</p>
      <button class="primary" type="button" onclick="window.Kaiye.openBox()">拆一封</button>
    </article>
    <article class="panel shop-block">
      <h2>写进盒子</h2>
      <form class="claim" onsubmit="window.Kaiye.propose(event)">
        <input name="title" maxlength="20" placeholder="例如：周末去公园" required />
        <input name="note" maxlength="80" placeholder="说明（可选）" />
        <input name="fulfiller" maxlength="8" placeholder="谁兑现：爸爸 / 妈妈" />
        <div class="actions">
          <button class="primary" type="submit">提出</button>
        </div>
      </form>
      <p class="meta">不能写免日课、代点亮、现金红包。</p>
      <div class="stats shop-block">${pool || "<p class='meta'>还是空的。家长和孩子各写一条，再互相点同意。</p>"}</div>
    </article>
  `;
}

function chipClass(pos, c) {
  if (!state.revealed) return "chip";
  if (pos.id === c.pos) return "chip is-right";
  if (pos.id === state.chosenPos) return "chip is-wrong";
  return "chip is-dim";
}

function phonicsBlock(c) {
  const chunks = (c.chunks || [])
    .map(
      (ch, i) =>
        `<span class="chunk${ch.stress ? " is-stress" : ""}" data-i="${i}">
          <b>${ch.g}</b>
          <span class="sound">/${ch.ipa}/</span>
          <small>${ch.tip}</small>
        </span>`
    )
    .join("");
  const dict = sayOf(c);
  const youglish = `https://youglish.com/pronounce/${encodeURIComponent(dict)}/english/uk`;
  const cambridge = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(dict)}`;
  return `
    <div class="sound-lesson">
      <div class="chunks" aria-label="词根拼读">${chunks}</div>
      <p class="formula">${c.formula}</p>
      <div class="sound-bar">
        <a class="quiet-link" href="${youglish}" target="_blank" rel="noreferrer">语境</a>
        <a class="quiet-link" href="${cambridge}" target="_blank" rel="noreferrer">词典</a>
      </div>
    </div>
  `;
}

function viewReview() {
  const p = pack();
  const c = card();
  const srs = srsStats(p.id, packCards());
  if (!c || state.reviewDone) {
    const srsMode = state.drill === "srs";
    const watchMode = state.drill === "watch";
    const title = watchMode
      ? "这一轮卡住的词过完了。还钉着的，下次打开仍会先练。"
      : srsMode
        ? "今天没有快忘的词。"
        : "第 1 步完成。这些词已进入间隔复习。";
    const next = srs.nextDue ? `下一波约 ${formatWait(srs.nextDue - Date.now())}。` : "";
    const go = watchMode
      ? `<button class="primary" type="button" onclick="window.Kaiye.setView('today')">回今天</button>`
      : srsMode
        ? `<button class="primary" type="button" onclick="window.Kaiye.setView('more')">返回更多</button>`
        : `<button class="primary" type="button" onclick="window.Kaiye.setView('speak')">进入第 2 步 · 口语</button>`;
    return `${bannerBlock()}${watchBar()}<article class="panel">
      <p>${title}</p>
      <p class="meta">${next} 不会的词会反复出现，直到连对两次。</p>
      ${go}
    </article>`;
  }
  const right = state.chosenPos === c.pos;
  const rec = cardState(activeSeat().id, p.id, c.id);
  const pinNote =
    rec.pin && state.revealed
      ? `<p class="meta watch-now">盯着：错过 ${rec.misses} 次 · ${rec.streak ? `连对 ${rec.streak}，再对 ${Math.max(0, 2 - rec.streak)} 次才拿掉` : "还没连对"}</p>`
      : "";
  const chips = POS.map((pos) => {
    const locked = state.revealed ? "disabled" : "";
    return `<button type="button" class="${chipClass(pos, c)}" ${locked} onclick="window.Kaiye.choosePos('${pos.id}')"><b>${pos.id}</b><span>${pos.zh}</span></button>`;
  }).join("");
  const verdict = state.revealed
    ? `<p class="verdict ${right ? "ok" : "no"}">${
        right
          ? `对了。这是${POS_ZH[c.pos]}。`
          : `不对。你选了${POS_ZH[state.chosenPos] || state.chosenPos}，正确是${POS_ZH[c.pos]}（${c.pos}）。记下了。`
      }</p>`
    : "";
  const answer = state.revealed
    ? `<div class="answer">
        ${verdict}
        ${pinNote}
        <p class="def"><i>${c.pos}</i>${POS_ZH[c.pos] || ""} · ${escapeHtml(c.sense)}</p>
        ${phonicsBlock(c)}
        <p class="meta example-line"><b lang="en">${escapeHtml(c.collocation)}</b> · ${escapeHtml(c.collocationZh)}
          ${earBtn("window.Kaiye.playPhrase()", "听搭配")}
        </p>
        <div class="example-line">
          <p class="sentence" lang="en">${hitEnglish(c.sentence, c.lemma)}</p>
          ${earBtn("window.Kaiye.playSentence(1)", "听例句")}
        </div>
        <p class="zh">${escapeHtml(c.sentenceZh)}</p>
      </div>`
    : "";
  const kicker =
    state.drill === "watch" ? "盯牢" : state.drill === "srs" ? "复习单词" : "1 新词";
  return `
    ${bannerBlock()}
    ${watchBar()}
    <p class="kicker">${kicker} ${state.cardIndex + 1} / ${state.queue.length}</p>
    ${wordHero(c, state.revealed)}
    <article class="panel">
      <div class="pos-row">${chips}</div>
      ${answer}
      <div class="actions">
        <button class="rate" type="button" ${state.revealed ? "" : "disabled"} onclick="window.Kaiye.rate('again')">再来</button>
        <button class="rate" type="button" ${state.revealed ? "" : "disabled"} onclick="window.Kaiye.rate('hard')">吃力</button>
        <button class="rate" type="button" ${state.revealed ? "" : "disabled"} onclick="window.Kaiye.rate('good')">记住了</button>
      </div>
    </article>
  `;
}

function viewSpeak() {
  const p = pack();
  const s = unitSpeak();
  if (!s) {
    return `${bannerBlock()}${watchBar()}${unitRail()}<article class="panel"><p>这一课开口题还没录入。先把已开放的单元钉牢。</p></article>`;
  }
  const cues = s.cue
    .map(
      (x) =>
        `<button type="button" class="cue-play" aria-label="听 ${x}" title="听" onclick="window.Kaiye.playText('${encodeURIComponent(x.replace(/\u2026/g, ""))}',1)">${x}${EAR}</button>`
    )
    .join("");
  const need = minSpeak(p.id);
  const heard = speech.transcript || state.speakText;
  const n = englishLen(heard);
  const shortNote =
    heard && n < need
      ? `<p class="meta">开口完成还差 ${need - n} 个英文字母（现在 ${n}）。</p>`
      : todayFlags().speak
        ? `<p class="meta">今日开口已算完成。可继续改，不再加墨滴。</p>`
        : `<p class="meta">至少 ${need} 个英文字母才算开口完成。可打字或录音。</p>`;
  const fb = heard ? speakFeedback(heard, s.sampleCheck, p.id) : "";
  const recLabel = speech.recording ? "停" : "录音";
  const live = speech.recording
    ? speech.interim || speech.transcript || "正在听…"
    : speech.transcript;
  const words = (speech.score?.words || [])
    .map((w) => `<b class="${w.ok ? "ok" : "no"}">${w.w}</b>`)
    .join("");
  const scoreBlock = speech.score
    ? `<div class="score-card ${speech.score.pct >= 80 ? "ok" : speech.score.pct >= 50 ? "mid" : "no"}">
        <p class="score-num">${speech.score.pct}<span>接近度</span></p>
        <p>${speech.score.label}</p>
        <p class="meta">这是跟读对照，不是考官分。红词再点听、再录。</p>
        <div class="word-score">${words}</div>
      </div>`
    : "";
  return `
    ${bannerBlock()}
    ${watchBar()}
    <p class="kicker">2 口语 · ${s.title}</p>
    <section class="word-hero">
      <p class="hero-word" lang="en">${s.prompt}</p>
      <div class="hero-ipa">
        ${ipaPlay(`window.Kaiye.playText('${encodeURIComponent(s.prompt)}',1)`, "听", "")}
      </div>
    </section>
    <article class="panel">
      <p class="meta">${p.copy.speakHint}</p>
      <div class="cue">${cues}</div>
      ${
        s.model
          ? `<div class="model-line">
              <p class="kicker">示范句</p>
              <div class="example-line">
                <p class="sentence" lang="en">${s.model}</p>
                ${earBtn(`window.Kaiye.playText('${encodeURIComponent(s.model)}',1)`, "听示范")}
              </div>
            </div>`
          : ""
      }
      <div class="rec-bar">
        <button id="rec-btn" class="primary rec-btn${speech.recording ? " is-hot" : ""}" type="button" onclick="window.Kaiye.record()">${recLabel}</button>
        ${earBtn("window.Kaiye.playMine()", "听自己", "己", speech.url ? "" : "is-off")}
      </div>
      <p class="meta" id="speech-live">${speech.error || live || "先听示范，再按录音跟读。"}</p>
      ${scoreBlock}
      <label class="kicker" for="speak-box">也可打字</label>
      <textarea id="speak-box" placeholder="${p.copy.speakPlaceholder || ""}">${state.speakText}</textarea>
      ${shortNote}
      <div class="actions">
        <button class="primary" type="button" onclick="window.Kaiye.checkSpeak()">看反馈</button>
        ${todayFlags().speak ? `<button class="ghost" type="button" onclick="window.Kaiye.setView('read')">进入第 3 步 · 阅读</button>` : ""}
      </div>
      ${fb}
    </article>
  `;
}

function speakFeedback(text, keys, id) {
  const lower = text.toLowerCase();
  const hits = keys.filter((k) => lower.includes(k.toLowerCase()));
  const askBack = unitSpeak()?.askBack;
  if (askBack) {
    const askedBack = /what about you|and you|how about you/.test(lower);
    return `<div class="feedback">
      <p>关键词：${hits.length ? hits.join(", ") : "尚未覆盖题目关键词。"}</p>
      <p>${askedBack ? "已包含回问。" : "请补一句：What about you?"}</p>
    </div>`;
  }
  return `<div class="feedback">
    <p>要点覆盖 ${hits.length} / ${keys.length}。</p>
  </div>`;
}

function viewRead() {
  const p = pack();
  const r = unitRead();
  if (!r) {
    return `${bannerBlock()}${watchBar()}${unitRail()}<article class="panel"><p>这一课阅读还没录入。</p></article>`;
  }
  const passageClass = r.kind === "sign" ? "sign" : "passage";
  const opts = r.options
    .map((o) => {
      let cls = "opt";
      if (state.readChoice === o) cls += " is-on";
      if (state.readChecked) {
        if (o === r.answer) cls += " is-right";
        else if (state.readChoice === o) cls += " is-wrong";
      }
      return `<button type="button" class="${cls}" onclick="window.Kaiye.chooseRead('${encodeURIComponent(o)}')"><span lang="en">${o}</span></button>`;
    })
    .join("");
  const fb = state.readChecked
    ? `<div class="feedback"><p>${state.readChoice === r.answer ? "正确。" : "不正确。"} ${r.why}</p></div>`
    : "";
  const tfng =
    p.id === "ielts"
      ? `<p class="meta">TRUE：与原文一致。FALSE：与原文相反。NOT GIVEN：原文未提及。</p>`
      : "";
  const done = todayFlags().read
    ? `<p class="meta">今日阅读已算完成。答错不灭灯。</p>`
    : "";
  return `
    ${bannerBlock()}
    ${watchBar()}
    <p class="kicker">3 阅读 · ${r.title}</p>
    <article class="panel">
      <div class="passage-head">
        <div class="${passageClass}" lang="en">${r.passage}</div>
        ${earBtn(`window.Kaiye.playText('${encodeURIComponent(r.passage.replace(/\n/g, " "))}',1)`, "听短文")}
      </div>
      <p><b lang="en">${r.question}</b></p>
      <p class="meta">${p.copy.readHint}</p>
      ${tfng}
      ${done}
      <div class="options">${opts}</div>
      <button class="primary" type="button" onclick="window.Kaiye.checkRead()">核对</button>
      ${fb}
    </article>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markPhrase(sentence, phrase, cls) {
  const text = String(sentence);
  if (!phrase) return escapeHtml(text);
  const i = text.indexOf(phrase);
  if (i < 0) return escapeHtml(text);
  return (
    escapeHtml(text.slice(0, i)) +
    `<mark class="${cls}">${escapeHtml(phrase)}</mark>` +
    escapeHtml(text.slice(i + phrase.length))
  );
}

function grammarCompare(g) {
  return `
    <div class="compare">
      <p class="wrong-line" lang="en"><span class="label">错</span>${markPhrase(g.wrong, g.error, "bad")}${earBtn(`window.Kaiye.playText('${encodeURIComponent(g.wrong)}',1)`, "听错句")}</p>
      <p class="right-line" lang="en"><span class="label">对</span>${markPhrase(g.correct, g.fix, "good")}${earBtn(`window.Kaiye.playText('${encodeURIComponent(g.correct)}',1)`, "听对句", "", "is-on")}</p>
    </div>
    ${g.correctZh ? `<p class="zh">${g.correctZh}</p>` : ""}
    <p class="meta">${g.rule}</p>
  `;
}

function wordRows(list) {
  const all = cards();
  return list
    .map((c) => {
      const i = all.findIndex((x) => x.id === c.id);
      return `<div class="word-row">
          <span class="en" lang="en">${escapeHtml(c.lemma)}</span>
          <span class="zh">${escapeHtml(c.sense)}</span>
          <button type="button" class="ear" aria-label="听 ${escapeHtml(c.lemma)}" title="听" onclick="window.Kaiye.playCard(${i},1)">${EAR}</button>
        </div>`;
    })
    .join("");
}

function wordlistHtml() {
  const list = cards();
  const unit = currentUnit();
  const n = unit?.n || (unit?.id ? unit.id.replace(/^u/i, "") : "");
  if (!list.length) {
    return `<article class="panel"><p class="meta">${unit?.note || "这一课的课后单词表还没录入。请拍课本单词表，不要用自编词。"}</p></article>`;
  }
  const core = list.filter((c) => c.track !== "extra");
  const extra = list.filter((c) => c.track === "extra");
  const title = n ? `Unit ${n} 课内词 · ${core.length} 个都要会` : `词汇 · ${list.length}`;
  return `
    <article class="panel wordlist">
      <p class="kicker">${title}</p>
      ${unit?.phonics ? `<p class="meta">语音：${escapeHtml(unit.phonics)}</p>` : `<p class="meta">课本上的词全部都要会。会了的不会天天刷。</p>`}
      <div class="word-table">${wordRows(core)}</div>
    </article>
    ${
      extra.length
        ? `<article class="panel wordlist"><p class="kicker">拓展短语 · ${extra.length}</p><p class="meta">课内词都见过以后，预习才会出这些。</p><div class="word-table">${wordRows(extra)}</div></article>`
        : ""
    }
  `;
}

function viewMemory() {
  const p = pack();
  const g = grammar();
  if (!g) return wordlistHtml();
  const body = state.grammarRevealed
    ? grammarCompare(g)
    : `<p class="meta">${g.task}</p>
        <div class="example-line">
          <p class="prompt" lang="en">${escapeHtml(g.wrong)}</p>
          ${earBtn(`window.Kaiye.playText('${encodeURIComponent(g.wrong)}',1)`, "听这一句")}
        </div>`;
  return `
    ${unitRail()}
    ${wordlistHtml()}
    <div class="row">
      <article class="panel">
        <p class="kicker">${p.copy.grammarTitle} · ${g.tag}</p>
        ${body}
        <div class="actions">
          <button class="primary" type="button" onclick="window.Kaiye.revealGrammar()">${p.copy.reveal}</button>
          <button class="ghost" type="button" onclick="window.Kaiye.nextGrammar()">${p.copy.next}</button>
        </div>
      </article>
    </div>
  `;
}

function viewProgress() {
  const p = pack();
  const hide = p.id !== "g5" && p.today.weekSpeak + p.today.weekRead === 0;
  const seat = activeSeat();
  const f = todayFlags();
  const srs = srsStats(p.id, cards());
  const units = (p.units || [])
    .map((u) => {
      const lock = p.id === "g5" && !unitUnlocked(u.id);
      const core = p.id === "g5" ? g5CoreCards(u.id) : [];
      const left = core.length ? unseenAll("g5", core).length : null;
      const words = u.ready ? `${u.words} 个课内${left != null ? ` · 未学 ${left}` : ""}` : "单词表未录入";
      const mark = lock ? "未解锁" : u.id === g5ActiveId() ? "本课" : "可学";
      const cls = `stat unit-line${lock ? " is-lock" : ""}${u.id === g5ActiveId() ? " is-on" : ""}`;
      return `<button type="button" class="${cls}" onclick="window.Kaiye.setG5Unit('${u.id}')"><span>${u.n}. ${u.title} · ${mark}</span><span>${words} · ${u.can}</span></button>`;
    })
    .join("");
  const watch = watchList(seat.id, p.id, packCards());
  const pinRows = watch.cards
    .map(
      (c) =>
        `<div class="stat"><span lang="en"><b>${escapeHtml(c.lemma)}</b> · ${reasonZh(c.reason)}${c.stubborn ? " · 反复不会" : ""}</span><span>错过 ${c.misses} · 还需连对 ${c.need}</span></div>`
    )
    .join("");
  const skillRows = watch.skills.map((s) => `<div class="stat"><span>${escapeHtml(s.note)}</span><span>${s.misses} 次</span></div>`).join("");
  const pinBlock =
    pinRows || skillRows
      ? `<article class="panel shop-block"><h2>盯牢 · 直到会</h2><div class="stats">${pinRows}${skillRows}</div><button class="ghost" type="button" onclick="window.Kaiye.setView('watch')">现在练</button></article>`
      : `<article class="panel"><h2>盯牢</h2><p class="meta">这一册暂时没有钉子。选错、再来、开口没盖住，会立刻记在这里。</p></article>`;
  return `
    ${hide ? `<p class="warn">本周尚未完成口语或阅读。</p>` : ""}
    ${bannerBlock()}
    ${watchBar()}
    <article class="panel stats">
      <div class="stat"><span>座位</span><b>${seat.name}</b></div>
      <div class="stat"><span>课程</span><b>${p.exam}</b></div>
      <div class="stat"><span>灯火 / 最长</span><b>${seat.lamp} / ${seat.lampMax}</b></div>
      <div class="stat"><span>请假条</span><b>${seat.freeze}</b></div>
      <div class="stat"><span>墨滴</span><b>${seat.ink}</b></div>
      <div class="stat"><span>今日点亮</span><b>${f.lit ? "已亮" : "未亮"}</b></div>
      <div class="stat"><span>本周口语</span><b>${p.today.weekSpeak}</b></div>
      <div class="stat"><span>本周阅读</span><b>${p.today.weekRead}</b></div>
      <div class="stat"><span>到期 / 间隔中 / 未学</span><b>${srs.due} / ${srs.waiting} / ${srs.unseen}</b></div>
      <div class="stat"><span>盯牢</span><b>${watch.cards.length + watch.skills.length}</b></div>
    </article>
    ${pinBlock}
    ${units ? `<article class="panel shop-block"><h2>本册路径 · 一课一课来</h2><div class="stats">${units}</div></article>` : ""}
  `;
}

const views = {
  today: viewToday,
  desk: viewDesk,
  more: viewMore,
  shop: viewShop,
  preview: viewPreview,
  review: viewReview,
  srs: viewReview,
  speak: viewSpeak,
  read: viewRead,
  memory: viewMemory,
  progress: viewProgress,
  install: viewInstall,
  slip: viewSlip
};

function render() {
  const p = pack();
  if (p.id === "g5" && !unitUnlocked(g5ActiveId())) state.g5Unit = "u1";
  const seat = activeSeat();
  document.title = `${p.copy.brand} · ${p.examShort}`;
  $("brand-title").textContent = p.copy.brand;
  $("brand-sub").textContent = `${p.exam} · 灯 ${seat.lamp} · 墨 ${seat.ink}`;
  document.body.dataset.theme = packTheme(p.id);
  applyEye();
  renderShelf();
  renderNav();
  renderDock();
  $("main").innerHTML = (views[state.view] || viewToday)();
}

function nextCard() {
  state.chosenPos = "";
  state.revealed = false;
  if (state.cardIndex >= state.queue.length - 1) {
    state.reviewDone = true;
    if (state.drill === "preview") {
      applyLight(markReview());
      toast("第 1 步完成。去开口。");
      state.view = "preview";
    } else if (state.drill === "watch") {
      const left = pinnedWordCards(activeSeat().id, pack().id, packCards()).length;
      toast(left ? "这一轮过完。还钉着的下次仍会先练。" : "这几个暂时会了。");
      state.view = "today";
    }
    render();
    return;
  }
  state.cardIndex += 1;
  render();
}

function choosePos(pos) {
  if (state.revealed) return;
  const c = card();
  state.chosenPos = pos;
  state.revealed = true;
  if (c && pos !== c.pos) {
    const note = observePos(activeSeat().id, pack().id, c.id, false);
    toast(note.first ? "记下了。这个词会反复出现，直到记住。" : "还不会。继续盯着。");
  }
  render();
  requestAnimationFrame(() => runPhonicsThenPlay(card()));
}

let voice = null;

function youdaoUrl(text, type) {
  return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${type}`;
}

function playSrc(url, fallback, lang) {
  if (voice) {
    voice.pause();
    voice = null;
  }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  voice = new Audio(url);
  voice.play().catch(() => speakSynth(fallback, lang));
}

function speakSynth(text, lang) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = text.includes(" ") ? 0.88 : 0.95;
  const voices = window.speechSynthesis.getVoices();
  const hit = voices.find((v) => v.lang.startsWith(lang)) || voices.find((v) => v.lang.startsWith("en"));
  if (hit) u.voice = hit;
  window.speechSynthesis.speak(u);
}

function playText(encoded, type) {
  const text = decodeURIComponent(encoded);
  const lang = Number(type) === 2 ? "en-US" : "en-GB";
  playSrc(youdaoUrl(text, Number(type) === 2 ? 2 : 1), text, lang);
}

function playUk() {
  const c = card();
  if (!c) return;
  playText(encodeURIComponent(sayOf(c)), 1);
}

function playUs() {
  const c = card();
  if (!c) return;
  playText(encodeURIComponent(sayOf(c)), 2);
}

function playCard(i, type) {
  const c = cards()[i];
  if (!c) return;
  playText(encodeURIComponent(sayOf(c)), type || 1);
}

function playPhrase() {
  const c = card();
  if (!c) return;
  playText(encodeURIComponent(c.collocation), 1);
}

function playSentence(type) {
  const c = card();
  if (!c) return;
  playText(encodeURIComponent(c.sentence), type || 1);
}

function runPhonicsThenPlay(c) {
  if (!c) return;
  const chunks = document.querySelectorAll(".chunk");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !chunks.length) {
    playUk();
    return;
  }
  chunks.forEach((el, i) => {
    window.setTimeout(() => {
      chunks.forEach((x) => x.classList.remove("is-lit"));
      el.classList.add("is-lit");
    }, i * 380);
  });
  window.setTimeout(() => {
    chunks.forEach((x) => x.classList.remove("is-lit"));
    playUk();
  }, chunks.length * 380 + 140);
}

function replay() {
  runPhonicsThenPlay(card());
}

function rate(kind) {
  const c = card();
  if (!c) return;
  const rating = kind || "good";
  const posOk = state.chosenPos === c.pos;
  const entry = rateCard(pack().id, c.id, rating);
  const loop = observeRate(activeSeat().id, pack().id, c.id, rating, posOk);
  if (loop.freed) toast(`${c.lemma} · 连对两次，从盯牢拿掉。`);
  else if (loop.pin && rating === "good" && posOk) toast(`${c.lemma} · 还要再对 ${loop.need} 次才拿掉。`);
  else if (loop.pin) toast(`${c.lemma} · 记下了，会反复出现。`);
  else toast(`${c.lemma} · ${formatInterval(entry)}再见`);
  if (rating === "again" && !state.againOnce[c.id]) {
    state.againOnce[c.id] = true;
    state.queue.push(c.id);
  }
  nextCard();
}

function checkSpeak() {
  const typed = $("speak-box")?.value || "";
  state.speakText = typed || speech.transcript || "";
  const s = unitSpeak();
  const heard = state.speakText;
  const keys = s?.sampleCheck || [];
  const lower = heard.toLowerCase();
  const hits = keys.filter((k) => lower.includes(k.toLowerCase()));
  const askedBack = /what about you|and you|how about you/.test(lower);
  const result = markSpeak(state.speakText, pack().id);
  if (result?.short) {
    toast(`再写或再说几个英文字母。至少 ${minSpeak(pack().id)} 个才算开口。`);
  } else {
    const pin = observeSpeak(activeSeat().id, pack().id, loopUnitId(), {
      hits: hits.length,
      keys: keys.length,
      askBack: Boolean(s?.askBack),
      askedBack
    });
    applyLight(result);
    toast(pin.pin ? `${pin.note}。第 2 步算完成，开口还要再练。` : "第 2 步完成。去阅读。");
  }
  render();
}

function onSpeechChange() {
  if (speech.recording) {
    const live = $("speech-live");
    const btn = $("rec-btn");
    if (live) live.textContent = speech.interim || speech.transcript || "正在听…";
    if (btn) {
      btn.classList.add("is-hot");
      btn.textContent = "停";
    }
    return;
  }
  if (speech.transcript) state.speakText = speech.transcript;
  render();
}

function record() {
  const model = unitSpeak()?.model || unitSpeak()?.prompt || "";
  toggleRecord(model, onSpeechChange);
}

function playMine() {
  playBlob();
}

function chooseRead(encoded) {
  state.readChoice = decodeURIComponent(encoded);
  state.readChecked = false;
  render();
}

function checkRead() {
  if (!state.readChoice) {
    toast("先选一个选项。");
    return;
  }
  const r = unitRead();
  const correct = Boolean(r && state.readChoice === r.answer);
  state.readChecked = true;
  const pin = observeRead(activeSeat().id, pack().id, loopUnitId(), correct);
  applyLight(markRead(true));
  toast(pin.pin ? "这篇选错了，盯着。第 3 步算完成，灯照亮。" : "第 3 步完成。");
  render();
}

function copyLoop() {
  const text = exportLoop();
  const ok = () => toast("盯牢账本已复制。给教练会话用，不含照片。");
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(ok).catch(() => downloadLoop(text));
    return;
  }
  downloadLoop(text);
}

function downloadLoop(text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = `kaiye-loop-${dayKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast("已下载盯牢账本。");
}

function eyeOn() {
  const pref = localStorage.getItem(EYE_KEY);
  if (pref === "on") return true;
  if (pref === "off") return false;
  return isChildPack(pack().id);
}

function applyEye() {
  const on = eyeOn();
  document.documentElement.dataset.eye = on ? "on" : "off";
  const color = on ? "#1c1812" : "#101114";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

function toggleEye() {
  localStorage.setItem(EYE_KEY, eyeOn() ? "off" : "on");
  applyEye();
  toast(eyeOn() ? "护眼台灯开了。字暖一点。" : "护眼台灯关了。");
  render();
}

function copyShare() {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(SHARE_URL).then(() => toast("地址已复制。发给平板浏览器打开。"));
    return;
  }
  toast(SHARE_URL);
}

function copySlip() {
  const { text } = currentSlip();
  const ok = () => toast("家书已复制。发给家里，让他们打开开页收下。");
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(ok).catch(() => downloadLoop(text));
    return;
  }
  downloadLoop(text);
}

function takeSlip(raw) {
  const text = raw || $("slip-box")?.value || "";
  const slip = parseSlip(text);
  if (!slip) {
    toast("这不是开页家书。请贴学习机「发给家里」复制的整段。");
    return;
  }
  const seat = childSeat();
  const loopHit = importSlip(slip, seat.id);
  if (!loopHit.ok) {
    toast(loopHit.reason || "收下失败。");
    return;
  }
  const srsN = mergePackSrs(slip.srs || {});
  toast(`收下了。孩子座位盯牢 ${loopHit.pins} 个，间隔记录 ${srsN} 条。去今天接着练。`);
  if (slip.packId && PACKS[slip.packId] && isChildPack(slip.packId) && state.packId !== slip.packId) {
    setPack(slip.packId);
    return;
  }
  deskSwitch(seat.id);
  state.view = "today";
  syncFromSeat();
  render();
}

function onSlipFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => takeSlip(String(reader.result || ""));
  reader.readAsText(file);
}

async function installApp() {
  if (installPrompt) {
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    installPrompt = null;
    toast(choice.outcome === "accepted" ? "已装到这台设备。" : "这次没装上。看下面的步骤。");
    render();
    return;
  }
  toast("用浏览器菜单「添加到主屏幕」或「添加到桌面」。");
}

function revealGrammar() {
  state.grammarRevealed = true;
  render();
}

function nextGrammar() {
  const list = currentUnit()?.grammar || pack().grammar || [];
  if (!list.length) return;
  state.grammarIndex = (state.grammarIndex + 1) % list.length;
  state.grammarRevealed = false;
  render();
}

function useSeat(id) {
  const seat = deskSwitch(id);
  if (!seat) return;
  state.cardIndex = 0;
  state.chosenPos = "";
  state.revealed = false;
  state.speakText = "";
  state.readChoice = "";
  state.readChecked = false;
  state.grammarIndex = 0;
  state.grammarRevealed = false;
  syncFromSeat();
  toast(`${seat.name}的座位。不能替别人点亮。`);
  render();
}

function claim(event, id) {
  event.preventDefault();
  const form = event.target;
  const name = form.name?.value;
  const packId = event.submitter?.dataset.pack || "ket";
  const err = claimSeat(id, name, packId, packId === "ielts" ? "adult" : "child");
  toast(err || "坐下了。");
  render();
}

function pickPhoto() {
  $("portrait-file")?.click();
}

async function onPortrait(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    const url = await photocopyPortrait(file);
    setPortrait(url);
    toast("照片贴上了。只留在这部手机。");
    if (state.view === "desk") render();
  } catch {
    toast("照片读不出。");
  }
}

function knockSeat(id) {
  toast(knock(id) || "敲了敲。");
  render();
}

function propose(event) {
  event.preventDefault();
  const fd = new FormData(event.target);
  const err = proposeReward(fd.get("title"), fd.get("note"), fd.get("fulfiller") || "家长", false);
  toast(err || "写好了。两边都要点同意才入池。");
  event.target.reset();
  render();
}

function agree(id, who) {
  agreeReward(id, who);
  render();
}

function doOpenBox() {
  const err = openBox();
  toast(err || "拆开了。纸条夹在课桌上。");
  render();
}

function fulfill() {
  fulfillPending();
  toast("已兑现。");
  render();
}

function lockedStep(n) {
  toast(n === 2 ? "先完成第 1 步：新词。" : "先完成第 2 步：口语。");
}

window.Kaiye = {
  setPack,
  toggleChildMenu,
  setG5Unit,
  setView,
  lockedStep,
  choosePos,
  replay,
  playUk,
  playUs,
  playCard,
  playPhrase,
  playSentence,
  playText,
  record,
  playMine,
  rate,
  checkSpeak,
  chooseRead,
  checkRead,
  copyLoop,
  copyShare,
  copySlip,
  takeSlip,
  toggleEye,
  installApp,
  revealGrammar,
  nextGrammar,
  useSeat,
  claim,
  pickPhoto,
  knock: knockSeat,
  propose,
  agree,
  openBox: doOpenBox,
  fulfill
};

$("portrait-file")?.addEventListener("change", onPortrait);
$("slip-file")?.addEventListener("change", onSlipFile);

document.addEventListener("click", (event) => {
  if (!state.childMenuOpen) return;
  if (event.target.closest(".book-menu")) return;
  state.childMenuOpen = false;
  render();
});

render();

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
