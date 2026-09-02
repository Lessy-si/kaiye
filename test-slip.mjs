import { observePos, buildSlip, parseSlip, importSlip, watchList, cardState, mergeLoopStore, dumpLoop } from "./js/loop.js";
import { dumpPackSrs, mergePackSrs } from "./js/srs.js";

const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k)
};

function assert(ok, msg) {
  if (!ok) throw new Error(msg);
}

const cards = [{ id: "w1", lemma: "apple", sense: "苹果" }];

observePos("child", "g5", "w1", false);
observePos("child", "g5", "w1", false);
const { text, slip } = buildSlip({
  seatId: "child",
  seatName: "孩子",
  packId: "g5",
  packTitle: "五年级",
  unitLabel: "Unit 1",
  srs: { "g5:w1": { ease: 2.1, intervalHours: 12, reps: 1, lapses: 1, due: 10, seen: true }, "ielts:x": { seen: true } },
  cards
});
assert(text.includes("---KAIYE---"), "家书要有分隔");
assert(parseSlip(text)?.kind === "kaiye-slip-v1", "能解析家书");
assert(!parseSlip("{not json"), "乱码要拒绝");
assert(!parseSlip(JSON.stringify({ kind: "other" })), "错 kind 要拒绝");

mem.clear();
mem.set(
  "kaiye-loop-v1",
  JSON.stringify({
    seats: {
      child: {
        packs: {
          g5: {
            cards: { w1: { pin: true, misses: 1, hits: 0, streak: 1, posMisses: 1, again: 0, hard: 0, lastReason: "pos", lastAt: 1 } },
            skills: {}
          }
        }
      }
    }
  })
);
const hit = importSlip(slip, "child");
assert(hit.ok, hit.reason || "应收下");
assert(hit.pins === 1, "钉子还在");
const rec = cardState("child", "g5", "w1");
assert(rec.misses === 2, `错过取较大，得到 ${rec.misses}`);
assert(rec.streak === 0, "仍钉住时 streak 取较小");
assert(watchList("child", "g5", cards).cards[0].lemma === "apple", "盯牢列表接上");

assert(!importSlip({ kind: "kaiye-slip-v1", packId: "ielts", loop: { cards: {}, skills: {} } }, "child").ok, "拒收成人册");

mem.set("kaiye-srs-v1", JSON.stringify({ "g5:old": { ease: 2.5, intervalHours: 48, reps: 2, lapses: 0, due: 99, seen: true } }));
const n = mergePackSrs({
  "g5:w1": { ease: 1.8, intervalHours: 12, reps: 1, lapses: 2, due: 10, seen: true },
  "ielts:x": { ease: 1.3, intervalHours: 12, reps: 9, lapses: 9, due: 1, seen: true }
});
assert(n === 1, `只合并孩子 SRS，得到 ${n}`);
const dumped = dumpPackSrs(["g5", "ket"]);
assert(dumped["g5:w1"].lapses === 2, "lapse 取较大");
assert(dumped["g5:w1"].due === 10, "到期取更早");
assert(!dumped["ielts:x"], "成人卡不进家书 SRS");

mem.clear();
observePos("child", "g5", "w1", false);
const dumpedLoop = dumpLoop();
mem.clear();
mergeLoopStore(dumpedLoop);
assert(cardState("child", "g5", "w1").pin, "房间合并后钉子还在");

console.log("slip loop ok");
