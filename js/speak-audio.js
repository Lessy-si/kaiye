/**
 * 开口录音与发音显示。
 *
 * 专业 App 实际用的不是浏览器插件：
 * - 国内中小学/作业帮/一起作业：科大讯飞 ISE，或腾讯云智聆口语评测（音素级、可按年龄调苛刻度）
 * - ELSA / Speechace / Azure Pronunciation Assessment：准确度+流利度+完整度+音素
 * - 流利说、多邻国：自研模型，不对外卖插件
 *
 * Web Speech API 只能转写，不能当发音标准分。本页先：录音回放 + 转写对照示范句。
 * 接入讯飞/智聆后替换 scoreTranscript()，UI 不用改。
 */

const RecAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export const speech = {
  recording: false,
  url: "",
  transcript: "",
  interim: "",
  score: null,
  error: ""
};

let mediaRec = null;
let chunks = [];
let recStream = null;
let recApi = null;

function tokens(text) {
  return String(text)
    .toLowerCase()
    .replace(/[’']/g, "")
    .match(/[a-z]+/g) || [];
}

export function scoreTranscript(heard, reference) {
  const got = tokens(heard);
  const need = [...new Set(tokens(reference))];
  if (!need.length) {
    return { pct: 0, label: "先听示范再跟读。", words: [] };
  }
  const set = new Set(got);
  const words = need.map((w) => ({ w, ok: set.has(w) }));
  const hit = words.filter((x) => x.ok).length;
  const pct = Math.round((hit / need.length) * 100);
  let label = "再听示范，跟读一遍。";
  if (pct >= 80) label = "很接近。这些词都听清了。";
  else if (pct >= 50) label = "能听清大意。红词再跟读。";
  return { pct, label, words };
}

export function resetSpeech() {
  stopTracks();
  if (speech.url) URL.revokeObjectURL(speech.url);
  speech.recording = false;
  speech.url = "";
  speech.transcript = "";
  speech.interim = "";
  speech.score = null;
  speech.error = "";
}

function stopTracks() {
  recApi?.stop();
  recApi = null;
  if (mediaRec && mediaRec.state !== "inactive") {
    try {
      mediaRec.stop();
    } catch {
      /* already stopped */
    }
  }
  mediaRec = null;
  recStream?.getTracks().forEach((t) => t.stop());
  recStream = null;
}

export async function toggleRecord(reference, onChange) {
  if (speech.recording) {
    speech.recording = false;
    stopTracks();
    if (speech.transcript) {
      speech.score = scoreTranscript(speech.transcript, reference);
    } else if (!speech.url) {
      speech.error = "没有录到声音。靠近麦克风再试。";
    } else if (!RecAPI) {
      speech.error = "这台浏览器不能自动评音。先点播放，对照示范听自己说得清不清。";
    } else {
      speech.error = "没听清。再听示范，对着麦克风跟读。";
    }
    onChange();
    return;
  }

  speech.error = "";
  speech.interim = "";
  speech.transcript = "";
  speech.score = null;
  chunks = [];

  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    speech.error = "这台浏览器不能录音。换 Chrome，或先打字作答。";
    onChange();
    return;
  }

  try {
    recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    speech.error = "需要允许麦克风。可在地址栏左侧重新开启。";
    onChange();
    return;
  }

  const mime = MediaRecorder.isTypeSupported("audio/webm")
    ? "audio/webm"
    : MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "";
  mediaRec = mime ? new MediaRecorder(recStream, { mimeType: mime }) : new MediaRecorder(recStream);
  mediaRec.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  mediaRec.onstop = () => {
    if (!chunks.length) return;
    if (speech.url) URL.revokeObjectURL(speech.url);
    speech.url = URL.createObjectURL(new Blob(chunks, { type: mediaRec?.mimeType || "audio/webm" }));
    onChange();
  };
  mediaRec.start();
  speech.recording = true;
  onChange();

  if (!RecAPI) return;
  recApi = new RecAPI();
  recApi.lang = "en-GB";
  recApi.interimResults = true;
  recApi.continuous = true;
  recApi.maxAlternatives = 3;
  recApi.onresult = (e) => {
    let finalText = "";
    let live = "";
    for (let i = 0; i < e.results.length; i += 1) {
      const piece = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += `${piece} `;
      else live += piece;
    }
    if (finalText.trim()) speech.transcript = finalText.trim();
    speech.interim = live;
    onChange();
  };
  recApi.onerror = () => {
    if (!speech.transcript) {
      speech.error = "识别中断。录音还在，可回放对照。";
    }
  };
  try {
    recApi.start();
  } catch {
    /* gesture / already started */
  }
}

export function playBlob() {
  if (!speech.url) return;
  const audio = new Audio(speech.url);
  audio.play().catch(() => {});
}
