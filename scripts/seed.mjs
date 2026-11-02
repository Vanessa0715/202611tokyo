import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { readFileSync } from 'fs'

const envFile = readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.trim() && l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const app = initializeApp({
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       env.VITE_FIREBASE_DATABASE_URL,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
})

const auth = getAuth(app)
const db   = getDatabase(app)

// 資料來源：可樂旅遊「天涼好個秋～楓紅高尾山、河口湖紅葉迴廊、天晴號遊覽船、長腳蟹溫泉鄉五日」
// 團號 NTX111805BR6C，2026/11/18 出發。飯店為旅行社候補清單（擇一同級旅館），實際入住飯店請依行前說明會資料為準。
const tripData = {
  day1: {
    e1: { time: '18:00', title: '入住：桃園住宿', tag: '住宿',
      notes: '飯店名稱待補，行前夜先在桃園附近住一晚。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【行前提醒】明日 07:55 台北桃園機場集合，搭乘長榮航空 BR184 飛往成田機場，建議提早 2–3 小時抵達機場辦理登機及行李托運。' },
  },
  day2: {
    e1: { time: '07:55', title: '出發 (BR184)', tag: '交通',
      notes: '長榮航空，台北桃園機場飛成田機場。',
      address: '桃園國際機場', reservationNo: 'BR184', phone: '',
      website: 'https://www.evaair.com/', mapUrl: '',
      details: '【班機資訊】07:55 台北(桃園)起飛，12:25 抵達成田機場(東京)。\n【報到提醒】請於起飛前 2–3 小時抵達機場。' },
    e2: { time: '12:25', title: '抵達成田機場，入境審查', tag: '交通',
      notes: 'Visit Japan Web 的入境審查、海關申報 QR Code 記得先截圖存手機。',
      address: '成田國際機場', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【通關提醒】出示 Visit Japan Web 的 QR Code 可加速通關。' },
    e3: { time: '13:00', title: '午餐：機上簡餐', tag: '午餐',
      notes: '航班上提供。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '' },
    e4: { time: '15:00', title: '成田山新勝寺', tag: '景點',
      notes: '真言宗智山派大本山，香火鼎盛的千年古寺。',
      address: '千葉県成田市成田1', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】日本三大不動之一，表參道上有許多老字號鰻魚飯店家，散步氣氛很好。' },
    e5: { time: '16:30', title: 'AEON MALL永旺夢樂城購物中心', tag: '景點',
      notes: '抵達當天的補貨、藥妝採買時間。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '' },
    e6: { time: '19:00', title: '晚餐：敬請自理', tag: '晚餐',
      notes: '商場內用餐或飯店周邊自理。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '' },
    e7: { time: '21:00', title: '入住：成田GARDEN／成田MARROAD／成田GATEWAY（擇一同級旅館）', tag: '住宿',
      notes: '實際入住飯店以團體確認為準。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '' },
  },
  day3: {
    e1: { time: '07:00', title: '飯店早餐', tag: '早餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e2: { time: '09:00', title: '昭和紀念公園(銀杏、紅葉)', tag: '景點',
      notes: '金黃銀杏大道與繽紛紅葉交織成絕景。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【拍照重點】每到秋天金黃銀杏大道是攝影愛好者必訪景點。\n【提醒】紅葉為自然現象，轉色程度受氣候影響，若未如期轉紅仍依原行程純欣賞自然風光。' },
    e3: { time: '12:00', title: '午餐：季節御膳 或 壽喜燒定食', tag: '午餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e4: { time: '13:30', title: '高尾山賞紅葉(搭乘纜車或吊椅)', tag: '景點',
      notes: '米其林三星景點，賞楓旺季人潮多，搭乘纜車或吊椅可能需排隊。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】標高599公尺，10月底至11月中旬楓紅漫山遍野，雞爪楓、大紅葉楓等百年老樹染上深淺不一的紅橙黃。\n【提醒】賞楓旺季排隊屬正常現象，請耐心等候。' },
    e5: { time: '18:00', title: '晚餐：飯店自助晚餐', tag: '晚餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e6: { time: '20:00', title: '入住：富士五湖溫泉區（石和新光／山中湖PLAZA／春日居VIEW／本栖鳳凰／富士松園，擇一同級旅館）', tag: '住宿',
      notes: '連住兩晚（11/19、11/20），實際入住飯店以團體確認為準。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '' },
  },
  day4: {
    e1: { time: '07:00', title: '飯店早餐', tag: '早餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e2: { time: '09:00', title: '河口湖紅葉迴廊', tag: '景點',
      notes: '約150公尺長的楓樹步道，10月下旬到11月下旬轉紅成隧道。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】楓葉開始飄落時地面會鋪滿紅葉，像一條自然形成的楓葉地毯。\n【提醒】紅葉為自然現象，受氣候影響轉色時間難以掌握。' },
    e3: { time: '10:30', title: '河口湖遊覽船～天晴號', tag: '景點',
      notes: '以戰國時代武田軍安宅船為原型打造的遊覽船。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】航行途中可遠眺富士山倒映在湖面上的絕美景色。\n【備註】如遇預約額滿或船隻不定期檢修、天災等不可抗力因素，將以其他遊覽船替代或每人退費日幣1000元。' },
    e4: { time: '12:00', title: '午餐：寶刀鍋鄉土料理 或 陶板料理', tag: '午餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e5: { time: '14:00', title: '麗莎與卡斯柏小鎮(贈送下午茶)', tag: '點心',
      notes: '富士急樂園附設歐風主題小鎮，下午茶為創作甜點任選一種+紅茶或咖啡擇一。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】根據法國人氣繪本人物麗莎與卡斯柏發想的歐風主題小鎮，咖啡廳裝潢洋溢法式風情。\n【提醒】不含富士急樂園內遊樂設施；若遇休園或額滿無法預約，改為「大石公園+河口湖自然生活館」，並提供每人1000日幣代金。' },
    e6: { time: '16:00', title: '新富岳百景忍野八海', tag: '景點',
      notes: '八座清澈池塘的富士山風景區，名水百選之一。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】可遠眺富士山的優美景觀。' },
    e7: { time: '18:00', title: '晚餐：飯店自助晚餐+長腳蟹吃到飽', tag: '晚餐',
      notes: '照片為示意圖，菜色會依照當季食材內容作調整。',
      address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e8: { time: '20:00', title: '入住：富士五湖溫泉區（同11/19候補旅館）', tag: '住宿',
      notes: '連住第二晚，實際入住飯店以團體確認為準。',
      address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
  },
  day5: {
    e1: { time: '07:00', title: '飯店早餐', tag: '早餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e2: { time: '09:00', title: '光伸真珠（贈送晴空塔造型手提袋每人乙個）', tag: '景點',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e3: { time: '11:00', title: '東京鐵塔(含觀景台)', tag: '景點',
      notes: '全高333公尺，比巴黎艾菲爾鐵塔高13公尺，1958年完工。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】含150公尺高的主要觀景台，可鳥瞰東京市區，天氣好時有機會看到遠方富士山。' },
    e4: { time: '12:30', title: '午餐：和牛燒肉套餐', tag: '午餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e5: { time: '14:30', title: '明治神宮、日本最大木造鳥居', tag: '景點',
      notes: '主祭神明治天皇與昭憲皇太后，參拜人數位居日本第一。',
      address: '', reservationNo: '', phone: '',
      website: '', mapUrl: '',
      details: '【景點特色】參道交會口的巨大鳥居由樹齡1,500年的台灣神木所建造，隨處可見日本皇室象徵的菊花紋章。' },
    e6: { time: '18:30', title: '晚餐：敬請自理', tag: '晚餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e7: { time: '20:00', title: '入住：東京大森T-mark酒店／東京品川王子大飯店／太陽城王子／池袋大都會／飯田橋大都會（擇一同級旅館）', tag: '住宿',
      notes: '實際入住飯店以團體確認為準。',
      address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
  },
  day6: {
    e1: { time: '07:00', title: '飯店早餐', tag: '早餐',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e2: { time: '10:30', title: '整理行李、前往成田機場', tag: '交通',
      notes: '', address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
    e3: { time: '13:25', title: '返程 (BR183)', tag: '交通',
      notes: '長榮航空，成田機場飛台北桃園機場。',
      address: '成田國際機場', reservationNo: 'BR183', phone: '',
      website: 'https://www.evaair.com/', mapUrl: '',
      details: '【班機資訊】13:25 成田機場起飛，16:05 抵達台北桃園機場。' },
    e4: { time: '13:25', title: '午餐：機上簡餐', tag: '午餐',
      notes: '航班上提供。',
      address: '', reservationNo: '', phone: '', website: '', mapUrl: '', details: '' },
  },
}

console.log('正在連線 Firebase...')
await signInAnonymously(auth)
console.log('登入成功，開始寫入資料...\n')

for (const [day, events] of Object.entries(tripData)) {
  await set(ref(db, `itinerary/${day}`), events)
  console.log(`✓ ${day} 寫入完成（${Object.keys(events).length} 筆）`)
}

console.log('\n🎉 全部完成！Firebase 已有 6 天行程資料。')
process.exit(0)
