/**
 * ==========================
 * 基本型・共通型定義
 * ==========================
 */

/** UUID（DB上はuuid型, TSはstringで管理する）. */
export type UUID = string;

/** SQL日付型. */
export type SqlDate = string;

/** タイムスタンプ（ISO8601文字列, 例: "2023-12-01T12:34:56Z"）. */
export type SqlTimestamp = string;

/** ==========================
 *   画面/コンポーネント系 (任意)
 * ==========================
 */

// 例: Toast用など
export type ToastKind = 'success' | 'info' | 'error' | 'warning';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'ghost'
  | 'link';
