/**
 * ==========================
 *   スキルカテゴリ・タグ・スキル
 * ==========================
 */

import { UUID } from './common';

/** スキルカテゴリID */
export type SkillCategoryId = string; // 例: 'os'
/** スキルタグID */
export type SkillTagId = string; // 例: 'linux'
/** スキルID */
export type SkillId = string; // 例: 'windows11'

/** スキルカテゴリ */
export type SkillCategory = {
  /** スキルカテゴリID. */
  id: SkillCategoryId;
  /** スキルカテゴリのラベル. */
  label: string;
  /** スキルカテゴリの説明. */
  description?: string;
};

/** スキルタグ */
export type SkillTag = {
  /** スキルタグID. */
  id: SkillTagId;
  /** スキルタグのラベル. */
  label: string;
  /** スキルタグの説明. */
  description?: string;
};

/** スキル本体 */
export type Skill = {
  /** スキルID. */
  id: SkillId;
  /** スキルのラベル. */
  label: string;
  /** スキルの説明. */
  description?: string;
  /** devicon用ID（deviconのnameと対応）. */
  deviconId?: string;
  /** スキルが属しているカテゴリのID. */
  categoryId: SkillCategoryId;
};

/** スキルとタグのマッピング用. */
export type SkillTagMap = {
  /** スキルID. */
  skillId: SkillId;
  /** スキルタグID. */
  tagId: SkillTagId;
};

// TODO: userId一つに対して、複数のスキルIDとバージョンを持つのでは？ バックエンドの処理を検討して型を調整
/** ユーザが持つスキル */
export type UserSkill = {
  /** ユーザUUID. */
  userId: UUID;
  /** スキルID. */
  skillId: SkillId;
  /** スキルのバージョン */
  version?: string;
};

/** ユーザが持つスキル 新規登録用. */
export type NewUserSkill = {
  /** ユーザUUID. */
  userId: UUID;
  /** スキルID. */
  skillId: SkillId;
  /** スキルのバージョン */
  version?: string;
};

/** ユーザが持つスキル 更新用. */
export type UpdateUserSkill = {
  /** スキルのバージョン */
  version?: string;
};

/** ユーザが持つスキル 削除用 */
export type DeleteUserSkill = {
  /** ユーザUUID. */
  userId: UUID;
  /** スキルID. */
  skillId: SkillId[];
};

export type UserSkillDetail = {
  /** スキル詳細. */
  skillDetail: Skill[];
  /** スキルのバージョン. */
  version?: string;
};

export type UserFullSkills = {
  /** ユーザUUID. */
  userId: UUID;
  /** 保持しているスキル一覧. */
  skills: UserSkillDetail[];
};
