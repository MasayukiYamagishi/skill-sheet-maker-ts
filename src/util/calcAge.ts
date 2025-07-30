/**
 * "yyyy-mm-dd" などを受け取り、日本時間での年齢を
 * 「XX歳mmヵ月」の形式で返す。
 */
export function calcAgeJSTLabel(birthDate: string | Date, now: Date = new Date()): string {
  const { years, months } = calcAgeJST(birthDate, now);
  return `${years}歳${months}ヵ月`;
}

/**
 * JST（日本時間）基準での年齢（年・月）を計算
 */
export function calcAgeJST(
  birthDate: string | Date,
  now: Date = new Date(),
): { years: number; months: number } {
  const birth = toDate(birthDate);

  // 生年月日が未来なら 0歳0ヵ月（またはエラーを投げる運用でも可）
  if (birth.getTime() > now.getTime()) {
    return { years: 0, months: 0 };
  }

  const b = getYmdInTz(birth, 'Asia/Tokyo');
  const n = getYmdInTz(now, 'Asia/Tokyo');

  let years = n.year - b.year;
  let months = n.month - b.month;

  // まだ当月の誕生日が来てなければ 1 ヵ月引く
  if (n.day < b.day) {
    months -= 1;
  }

  // 月がマイナスなら前年に繰り下げ
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // マイナス補正（理論上ここまで来ない想定だが保険）
  if (years < 0) {
    years = 0;
    months = 0;
  }

  return { years, months };
}

/** ユーティリティ: どんな入力でも Date にする */
function toDate(d: string | Date): Date {
  return d instanceof Date ? d : new Date(d);
}

/** 指定タイムゾーン（ここでは JST）での年月日を安全に取得 */
function getYmdInTz(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);

  return { year, month, day };
}
