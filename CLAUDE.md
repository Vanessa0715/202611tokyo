# 202611tokyo — 東京賞楓 旅遊行程 Web App

## 專案概要

**旅遊日期：** 2026/11/17–11/22（11/17 桃園行前夜，11/18–11/22 旅行社跟團）
**目的地：** 東京 → 富士五湖／河口湖
**成員：** 媽媽、阿姨（共2人）
**用途：** 兩人共同查看／編輯行程的 Web App，透過 Firebase 即時同步
**團體行程來源：** 可樂旅遊「天涼好個秋～楓紅高尾山、河口湖紅葉迴廊、天晴號遊覽船、長腳蟹溫泉鄉五日」，團號 NTX111805BR6C，2026/11/18 出發（唯讀參考，行程異動以旅行社實際公告為準）

## 技術棧

- **框架：** React + Vite
- **樣式：** Tailwind CSS
- **資料庫：** Firebase Realtime Database（即時共編）
- **部署：** GitHub Pages（自動 CI/CD via GitHub Actions）

## Firebase 設定

金鑰放在 `.env.local`（不進 git），**需另外新開一個 Firebase 專案**，不可共用 202610nagoya 的資料庫：
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 功能模組

| 模組 | 說明 |
|------|------|
| 每日行程時間軸 | Day 1（11/17）～ Day 6（11/22），可新增/編輯景點、標籤 |
| 打包清單（行李） | 共用提醒清單（項目同步、勾選各存各的手機）；項目固定，僅可刪除 |
| 願望清單（原景點） | 共同許願池：想去想吃的備案小卡，可一鍵排入指定日期的行程（標記「已排入」） |

## 行程 Tag 對照

景點 / 交通 / 早餐 / 午餐 / 晚餐 / 點心 / 備案 / 裝備出租 / 教練 / 票券 / 住宿

## 資料來源

可樂旅遊行程頁（唯讀參考，動態頁面需另存 PDF 才能讀取完整內容）：
https://tour.colatour.com.tw/itinerary?TourCode=NTX111805BR6C&TourDate=2026/11/18

初始行程資料（含景點介紹、候補飯店清單）已寫在 `scripts/seed.mjs`，來源為旅行社行程 PDF。**住宿飯店為旅行社候補清單（擇一同級旅館）**，實際入住飯店請依行前說明會資料更新。

## 部署設定

- **平台：** GitHub Pages
- **Repo：** `Vanessa0715/202611tokyo`（尚未建立遠端 repo）
- **CI/CD：** `.github/workflows/deploy.yml`，push to `main` 自動 build & deploy
- **發布網址：** https://vanessa0715.github.io/202611tokyo/
- **base path：** `vite.config.js` 已設 `base: '/202611tokyo/'`
- **GitHub Secrets：** 需設定 7 個 `VITE_FIREBASE_*`（比照 202610nagoya 流程）
- **GitHub Pages：** 需啟用（Source: GitHub Actions）

## 原始碼對應區塊

| 想改的區塊 | 檔案路徑 |
|-----------|---------|
| 每日行程 | `src/components/Itinerary/index.jsx` |
| 打包清單（行李） | `src/components/Packing/index.jsx` |
| 願望清單（原景點） | `src/components/Spots/index.jsx` |
| 整體版面／導覽 | `src/App.jsx` |
| 全域樣式 | `src/App.css` / `src/index.css` |
| 初始行程資料（寫入 Firebase 用） | `scripts/seed.mjs` |

> 資料（行程內容、清單項目等）存在 Firebase，直接在網頁上操作即可，不需要改程式碼。

## Hero 圖片

`public/images/day1.jpg`～`day6.jpg` 已換成對應景點的真實照片（取自 Wikimedia Commons，CC BY / CC BY-SA 授權，皆已下載到本地），分別對應：桃園機場／成田山新勝寺／高尾山／河口湖富士山紅葉／東京鐵塔／成田機場。之後想換自己拍的照片，直接覆蓋同檔名即可，不要外連圖片。

## 本地開發流程

```bash
# 每次開工跑一次，之後存檔會自動熱更新
npm run dev
# → 開瀏覽器看 http://localhost:5173/202611tokyo/（port 可能不同）
```

確認沒問題後：
```bash
git add . && git commit -m "訊息" && git push
# → GitHub Actions 自動 build & deploy 到 github.io
```

## 注意事項

- **絕對不修改可樂旅遊行程頁**，僅作唯讀資料參考
- Firebase 金鑰由 Vanessa 自行填入 `.env.local`
- `.env.local` 已加入 `.gitignore`，不會進 git
- 家人透過 GitHub Pages 網址使用，不需要 `.env.local`（金鑰在 GitHub Secrets 裡）
- 緊急聯絡資訊（駐日代表處電話等）寫在 `src/components/Tools/index.jsx`，出發前建議再次核對官方公告號碼
