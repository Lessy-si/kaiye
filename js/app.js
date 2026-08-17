import { PACKS, PACK_ORDER } from "./packs.js";

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
  reviewDone: false
};

const $ = (id) => document.getElementById(id);

function pack() {
  return PACKS[state.packId];
}

function setPack(id) {
  if (id === state.packId) return;
  state.packId = id;
  localStorage.setItem("kaiye-pack", id);
  state.view = "today";
  state.cardIndex = 0;
  state.chosenPos = "";
  state.revealed = false;
  state.speakText = "";
  state.readChoice = "";
  state.readChecked = false;
  state.grammarIndex = 0;
  state.grammarRevealed = false;
  state.reviewDone = false;
  document.body.dataset.theme = id;
  render();
}

function setView(view) {
  state.view = view;
  render();
}

function card() {
  return pack().cards[state.cardIndex];
}

function grammar() {
  return pack().grammar[state.grammarIndex];
}

function renderShelf() {
  $("shelf").innerHTML = PACK_ORDER.map((id) => {
    const p = PACKS[id];
    const on = id === state.packId ? " is-on" : "";
    return `<button class="book${on}" type="button" data-pack="${id}" role="tab" aria-selected="${id === state.packId}" onclick="window.Kaiye.setPack('${id}')">${p.examShort}</button>`;
  }).join("");
}

function renderNav() {
  const c = pack().copy;
  const items = [
    ["today", c.navToday],
    ["review", c.navReview],
    ["speak", c.navSpeak],
    ["read", c.navRead],
    ["memory", c.navMemory],
    ["progress", c.navProgress]
  ];
  $("nav").innerHTML = items
    .map(
      ([id, label]) =>
        `<button type="button" class="${state.view === id ? "is-on" : ""}" data-view="${id}" onclick="window.Kaiye.setView('${id}')">${label}</button>`
    )
    .join("");
}

function viewToday() {
  const p = pack();
  const t = p.today;
  return `
    <section class="hero">
      <p class="kicker">${p.exam}</p>
      <h1>${t.mainLabel}</h1>
      <p class="lede">${t.mainWhy}</p>
    </section>
    <div class="row">
      <article class="panel">
        <p class="kicker">${p.copy.due}</p>
        <h2>${p.cards.length} 张待复习</h2>
        <p class="meta">判断词性后再看释义。</p>
        <button class="primary" type="button" data-go="review" onclick="window.Kaiye.setView('review')">${p.copy.startReview}</button>
        <button class="ghost" type="button" data-go="${t.main}" onclick="window.Kaiye.setView('${t.main}')">${p.copy.startMain}</button>
      </article>
      <aside class="panel stats">
        <div class="stat"><span>时长</span><b>${t.minutes}</b></div>
        <div class="stat"><span>重点</span><b>${t.main === "speak" ? p.copy.navSpeak : p.copy.navRead}</b></div>
        <div class="stat"><span>新词</span><b>${p.id === "ket" ? "4–6" : "8–12"}</b></div>
      </aside>
    </div>
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
  const youglish = `https://youglish.com/pronounce/${encodeURIComponent(c.lemma)}/english/uk`;
  const cambridge = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(c.lemma)}`;
  return `
    <div class="sound-lesson">
      <p class="ipa" lang="en">${c.ipaUk} <span>英</span> · ${c.ipaUs} <span>美</span></p>
      <div class="chunks" aria-label="词根拼读">${chunks}</div>
      <p class="formula">${c.formula}</p>
      <div class="sound-bar">
        <button type="button" class="primary" onclick="window.Kaiye.playUk()">听英音</button>
        <button type="button" class="ghost" onclick="window.Kaiye.playUs()">听美音</button>
        <a class="ghost linkish" href="${youglish}" target="_blank" rel="noreferrer">语境发音</a>
        <a class="ghost linkish" href="${cambridge}" target="_blank" rel="noreferrer">剑桥词典</a>
      </div>
    </div>
  `;
}

function viewReview() {
  const p = pack();
  const c = card();
  if (!c || state.reviewDone) {
    return `<article class="panel"><p>${p.copy.emptyReview}</p>
      <button class="primary" type="button" onclick="window.Kaiye.setView('speak')">${p.copy.startMain}</button></article>`;
  }
  const right = state.chosenPos === c.pos;
  const chips = POS.map((pos) => {
    const locked = state.revealed ? "disabled" : "";
    return `<button type="button" class="${chipClass(pos, c)}" ${locked} onclick="window.Kaiye.choosePos('${pos.id}')"><b>${pos.id}</b><span>${pos.zh}</span></button>`;
  }).join("");
  const verdict = state.revealed
    ? `<p class="verdict ${right ? "ok" : "no"}">${
        right
          ? `对了。这是${POS_ZH[c.pos]}。`
          : `不对。你选了${POS_ZH[state.chosenPos] || state.chosenPos}，正确是${POS_ZH[c.pos]}（${c.pos}）。`
      }</p>`
    : "";
  const answer = state.revealed
    ? `<div class="answer">
        ${verdict}
        <p><b>${c.lemma}</b> · ${c.pos} ${POS_ZH[c.pos] || ""} · ${c.sense}</p>
        ${phonicsBlock(c)}
        <p class="meta example-line"><b>${c.collocation}</b> · ${c.collocationZh}
          <button type="button" class="ghost compact" onclick="window.Kaiye.playPhrase()">听搭配</button>
        </p>
        <div class="example-line">
          <p class="sentence" lang="en">${c.sentence}</p>
          <span class="listen">
            <button type="button" class="primary compact" onclick="window.Kaiye.playSentence(1)">听例句</button>
            <button type="button" class="ghost compact" onclick="window.Kaiye.playSentence(2)">美音</button>
          </span>
        </div>
        <p class="zh">${c.sentenceZh}</p>
      </div>`
    : "";
  return `
    <p class="kicker">${p.copy.due} ${state.cardIndex + 1} / ${p.cards.length}</p>
    <article class="panel">
      <div class="card-face">
        <p class="prompt">${c.prompt}</p>
        <p class="meta">${p.copy.posAsk}</p>
      </div>
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
  const s = p.speak;
  const cues = s.cue.map((x) => `<span>${x}</span>`).join("");
  const fb = state.speakText
    ? speakFeedback(state.speakText, s.sampleCheck, p.id)
    : "";
  return `
    <p class="kicker">${s.title}</p>
    <article class="panel">
      <h2 lang="en">${s.prompt}</h2>
      <p class="meta">${p.copy.speakHint}</p>
      <div class="cue">${cues}</div>
      <label class="kicker" for="speak-box">作答</label>
      <textarea id="speak-box" placeholder="${p.id === "ket" ? "I like drawing at the weekend because\u2026 What about you?" : "Last year I tried to\u2026"}">${state.speakText}</textarea>
      <div class="actions">
        <button class="primary" type="button" onclick="window.Kaiye.checkSpeak()">看反馈</button>
      </div>
      ${fb}
    </article>
  `;
}

function speakFeedback(text, keys, id) {
  const lower = text.toLowerCase();
  const hits = keys.filter((k) => lower.includes(k.toLowerCase()));
  if (id === "ket") {
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
  const r = p.read;
  const passageClass = p.id === "ket" ? "sign" : "passage";
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
  return `
    <p class="kicker">${r.title}</p>
    <article class="panel">
      <div class="${passageClass}" lang="en">${r.passage}</div>
      <p><b lang="en">${r.question}</b></p>
      <p class="meta">${p.copy.readHint}</p>
      ${tfng}
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
      <p class="wrong-line" lang="en"><span class="label">错</span>${markPhrase(g.wrong, g.error, "bad")}</p>
      <p class="right-line" lang="en"><span class="label">对</span>${markPhrase(g.correct, g.fix, "good")}</p>
    </div>
    <div class="listen">
      <button type="button" class="primary compact" onclick="window.Kaiye.playText('${encodeURIComponent(g.correct)}',1)">听对句</button>
      <button type="button" class="ghost compact" onclick="window.Kaiye.playText('${encodeURIComponent(g.wrong)}',1)">听错句</button>
    </div>
    ${g.correctZh ? `<p class="zh">${g.correctZh}</p>` : ""}
    <p class="meta">${g.rule}</p>
  `;
}

function viewMemory() {
  const p = pack();
  const g = grammar();
  const body = state.grammarRevealed
    ? grammarCompare(g)
    : `<p class="meta">${g.task}</p><p class="prompt" lang="en">${escapeHtml(g.wrong)}</p>`;
  const words = p.cards
    .map(
      (c) =>
        `<div class="stat"><span><b>${c.lemma}</b> ${c.ipaUk || ""} · ${c.pos} ${POS_ZH[c.pos] || ""}</span><span>${c.sense}</span></div>`
    )
    .join("");
  return `
    <div class="row">
      <article class="panel">
        <p class="kicker">${p.copy.grammarTitle} · ${g.tag}</p>
        ${body}
        <div class="actions">
          <button class="primary" type="button" onclick="window.Kaiye.revealGrammar()">${p.copy.reveal}</button>
          <button class="ghost" type="button" onclick="window.Kaiye.nextGrammar()">${p.copy.next}</button>
        </div>
      </article>
      <aside class="panel">
        <h2>词汇</h2>
        <div class="stats">${words}</div>
      </aside>
    </div>
  `;
}

function viewProgress() {
  const p = pack();
  const hide = p.today.weekSpeak + p.today.weekRead === 0;
  return `
    ${hide ? `<p class="warn">本周尚未完成口语或阅读。</p>` : ""}
    <article class="panel stats">
      <div class="stat"><span>课程</span><b>${p.exam}</b></div>
      <div class="stat"><span>本周口语</span><b>${p.today.weekSpeak}</b></div>
      <div class="stat"><span>本周阅读</span><b>${p.today.weekRead}</b></div>
      <div class="stat"><span>待复习</span><b>${p.cards.length}</b></div>
    </article>
  `;
}

const views = {
  today: viewToday,
  review: viewReview,
  speak: viewSpeak,
  read: viewRead,
  memory: viewMemory,
  progress: viewProgress
};

function render() {
  const p = pack();
  document.title = `${p.copy.brand} · ${p.examShort}`;
  $("brand-title").textContent = p.copy.brand;
  $("brand-sub").textContent = p.exam;
  document.body.dataset.theme = p.id;
  renderShelf();
  renderNav();
  $("main").innerHTML = views[state.view]();
}

function nextCard() {
  const list = pack().cards;
  state.chosenPos = "";
  state.revealed = false;
  if (state.cardIndex >= list.length - 1) {
    state.reviewDone = true;
    state.view = "speak";
    render();
    return;
  }
  state.cardIndex += 1;
  render();
}

function choosePos(pos) {
  if (state.revealed) return;
  state.chosenPos = pos;
  state.revealed = true;
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
  playText(encodeURIComponent(c.lemma), 1);
}

function playUs() {
  const c = card();
  if (!c) return;
  playText(encodeURIComponent(c.lemma), 2);
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

function rate() {
  nextCard();
}

function checkSpeak() {
  state.speakText = $("speak-box")?.value || "";
  render();
}

function chooseRead(encoded) {
  state.readChoice = decodeURIComponent(encoded);
  state.readChecked = false;
  render();
}

function checkRead() {
  state.readChecked = true;
  render();
}

function revealGrammar() {
  state.grammarRevealed = true;
  render();
}

function nextGrammar() {
  const list = pack().grammar;
  state.grammarIndex = (state.grammarIndex + 1) % list.length;
  state.grammarRevealed = false;
  render();
}

window.Kaiye = {
  setPack,
  setView,
  choosePos,
  replay,
  playUk,
  playUs,
  playPhrase,
  playSentence,
  playText,
  rate,
  checkSpeak,
  chooseRead,
  checkRead,
  revealGrammar,
  nextGrammar
};

render();
