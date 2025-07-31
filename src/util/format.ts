/**
 * "yyyy-mm-dd" を "yyyy年MM月dd日" に変換する
 * 想定入力: 2025-07-03 / 2025-7-3 など
 * 想定外の形式ならそのまま返す
 *
 * @param dateStr 日付
 * @returns フォーマットされた日付
 */
export function formatYmdToJa(dateStr: string): string {
  if (!dateStr) return '';

  // 先頭10文字だけを見る（"2025-07-03T12:00:00Z" のようなISO文字列も想定）
  const s = dateStr.slice(0, 10);

  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return dateStr;

  const [, y, mo, d] = m;
  const mm = mo.padStart(2, '0');
  const dd = d.padStart(2, '0');

  return `${y}年${mm}月${dd}日`;
}
