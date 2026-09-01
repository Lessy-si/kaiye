const SHARE = "https://lessy-si.github.io/kaiye/get.html";
let deferred;

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el || !msg) return;
  el.textContent = msg;
  el.hidden = false;
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => {
    el.hidden = true;
  }, 2400);
}

function standalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

async function copyShare() {
  try {
    await navigator.clipboard.writeText(SHARE);
    toast("地址已复制。发给平板浏览器打开。");
  } catch {
    toast(SHARE);
  }
}

async function install() {
  if (deferred) {
    deferred.prompt();
    const choice = await deferred.userChoice;
    deferred = null;
    document.getElementById("install")?.classList.add("is-off");
    toast(choice.outcome === "accepted" ? "已装到这台设备。" : "这次没装上。用下面的步骤。");
    return;
  }
  toast("用浏览器菜单「添加到主屏幕」或「添加到桌面」。");
  document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferred = event;
  document.getElementById("install")?.classList.remove("is-off");
});

window.addEventListener("appinstalled", () => {
  toast("桌面上会有「开页」。以后从那里进。");
});

if (standalone()) {
  const btn = document.getElementById("install");
  if (btn) {
    btn.textContent = "已在这台设备上";
    btn.disabled = true;
  }
}

document.getElementById("install")?.addEventListener("click", install);
document.getElementById("copy")?.addEventListener("click", copyShare);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
