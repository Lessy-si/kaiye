# 开页家庭房间

学习机和家长手机共用一个口令。孩子答错，家里几秒内看到钉子。照片不上云。

阿里云、腾讯云都能跑，只要是一台能装 Node 的轻量应用服务器，不要两套云产品叠在一起。

## 1. 服务器

```bash
# Node 18+
mkdir -p /opt/kaiye && cd /opt/kaiye
# 把本目录的 server.mjs 拷上去
PORT=8787 node server.mjs
```

用 systemd 或宝塔「Node 项目」守护。安全组放行 80/443。

## 2. HTTPS

GitHub Pages 是 https，学习机只能连 https 接口。在轻量前面挂 Nginx / Caddy，证书用该云的免费证书或 Let's Encrypt。

反代示例：`https://kaiye.你的域名` → `http://127.0.0.1:8787`

教室网要放行这个域名。

## 3. 开页里填一次

课桌 → 连上家里 → 云地址填 `https://kaiye.你的域名`  
两台设备贴同一串口令（课桌上那串 `开页-XXXXXX`）。

没网时仍在本机学；家书还能当兜底。
