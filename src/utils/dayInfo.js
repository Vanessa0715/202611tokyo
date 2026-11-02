// 每天的日期／地區標籤（固定不變，跟哪家飯店無關）
// 飯店名稱等會變動的住宿資訊一律從 Firebase itinerary/day{n} 的「住宿」標籤項目即時讀取，
// 不要在這裡或任何元件裡另外硬編一份，避免兩邊資料兜不起來。
export const DAY_INFO = [
  { date: '11/17', city: '桃園' },
  { date: '11/18', city: '成田' },
  { date: '11/19', city: '富士五湖' },
  { date: '11/20', city: '河口湖' },
  { date: '11/21', city: '東京' },
  { date: '11/22', city: '東京' },
]
