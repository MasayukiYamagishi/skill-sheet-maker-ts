/**
 * ==========================
 *   MBTI関連
 * ==========================
 */

/** MBTIの大分類カテゴリ. */
export type MbtiGroup = {
  /** MBTI大分類ID. */
  id: string;
  /** 大分類の日本語ラベル. */
  label: string;
  /** 大分類の説明. */
  description: string;
};

/** MBTI16タイプ. */
export type MbtiType = {
  /** MBTIタイプのコード. */
  code: string;
  /** 大分類ID. */
  groupId: string;
  /** MBTIタイプの日本語名. */
  name: string;
  /** MBTIタイプの英語名. */
  nameEn?: string;
  /** MBTIに関するポジティブなキーワード. */
  positiveKeywords: string[];
  /** MBTIに関するネガティブなキーワード. */
  negativeKeywords: string[];
  /** MBTIの説明. */
  description: string;
  /** MBTIの特徴リスト. */
  features: string[];
};

/** MBTI A型T型区分. */
export type MbtiIdentity = {
  /** 区分コード. */
  code: string;
  /** 区分の日本語ラベル. */
  label: string;
  /** 区分の説明. */
  description: string;
};

/**
 * MBTIの統合情報（タイプ詳細・大分類・アイデンティティ）。
 */
export type MbtiFullInfo = {
  type?: MbtiType; // MBTIタイプ詳細
  group?: MbtiGroup; // MBTI大分類
  identity?: MbtiIdentity; // MBTIアイデンティティ（A/T型区分）
};
