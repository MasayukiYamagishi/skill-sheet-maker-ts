/**
 * ==========================
 *   経歴・プロジェクト履歴
 * ==========================
 */

import { SqlDate, UUID } from './common';
import { ProcessId } from './process';
import { SkillId } from './skill';

/** 業務経歴. */
export type CareerHistory = {
  /** 業務経歴のUUID. */
  id: UUID;
  /** ユーザUUID. */
  userId: UUID;
  /** 業務経歴のタイトル. */
  title: string;
  /** 参画開始年月日. */
  startedAt?: SqlDate;
  /** 参画終了年月日. */
  endedAt?: SqlDate;
  /** 業務の説明. */
  description?: string;
  /** 業務での役割. */
  role?: string;
  /** 業務チームの規模. */
  scale?: string;
};

/** 業務経歴 新規登録用. */
export type NewCareerHistory = {
  /** ユーザUUID. */
  userId: UUID;
  /** 業務経歴のタイトル. */
  title: string;
  /** 参画開始年月日. */
  startedAt?: SqlDate;
  /** 参画終了年月日. */
  endedAt?: SqlDate;
  /** 業務の説明. */
  description?: string;
  /** 業務での役割. */
  role?: string;
  /** 業務チームの規模. */
  scale?: string;
};

/** 業務経歴 更新用. */
export type UpdateCareerHistory = {
  /** 業務経歴のUUID. */
  id: UUID;
  /** ユーザUUID. */
  userId: UUID;
  /** 業務経歴のタイトル. */
  title?: string;
  /** 参画開始年月日. */
  startedAt?: SqlDate;
  /** 参画終了年月日. */
  endedAt?: SqlDate;
  /** 業務の説明. */
  description?: string;
  /** 業務での役割. */
  role?: string;
  /** 業務チームの規模. */
  scale?: string;
};

/** 業務経歴 削除用. */
export type DeleteCareerHistory = {
  /** 削除する業務経歴のUUID. */
  ids: UUID[];
};

/** 業務経歴ごとの使用スキル. */
export type CareerSkill = {
  /** 業務経歴のUUID. */
  careerId: UUID;
  /** スキルID. */
  skillId: SkillId;
  /** スキルのバージョン. */
  version?: string;
};

/** 業務経歴ごとの使用スキル 新規登録用. */
export type NewCareerSkill = {
  /** 業務経歴のUUID. */
  careerId: UUID;
  /** スキルID. */
  skillId: SkillId;
  /** スキルのバージョン. */
  version?: string;
};

// TODO: 経歴IDスキルIDを指定しなくてもいいのか？
/** 業務経歴ごとの使用スキル 更新用. */
export type UpdateCareerSkill = {
  /** スキルのバージョン. */
  version?: string;
};

/** 業務経歴ごとの使用スキル 削除用. */
export type DeleteCareerSkill = {
  /** 業務経歴のUUID. */
  careerId: UUID;
  /** スキルID. */
  skillIds: SkillId[];
};

/** 業務経歴ごとの担当工程. */
export type CareerProcess = {
  /** 業務経歴のUUID. */
  careerId: UUID;
  /** 担当工程ID. */
  processIds: ProcessId[];
};

/** 業務経歴ごとの担当工程 新規登録用. */
export type NewCareerProcess = {
  /** 業務経歴のUUID. */
  careerId: UUID;
  /** 担当工程ID. */
  processIds: ProcessId[];
};

/** 業務経歴ごとの担当工程 更新用. */
export type UpdateCareerProcess = {
  /** 業務経歴のUUID. */
  careerId: UUID;
  /** 担当工程ID. */
  processIds: ProcessId[];
};

/** 業務経歴ごとの担当工程 削除用. */
export type DeleteCareerProcess = {
  /** 業務経歴のUUID. */
  careerId: UUID;
  /** 担当工程ID. */
  processIds: ProcessId[];
};

export type Career = {
  /** 業務経歴のUUID. */
  id: UUID;
  /** ユーザUUID. */
  userId: UUID;
  /** 業務経歴のタイトル. */
  title: string;
  /** 参画開始年月日. */
  startedAt?: SqlDate;
  /** 参画終了年月日. */
  endedAt?: SqlDate;
  /** 業務の説明. */
  description?: string;
  /** 業務での役割. */
  role?: string;
  /** 業務チームの規模. */
  scale?: string;
  /** 使ったスキルの情報. */
  careerSkills?: CareerSkill[];
  /** 担当工程の情報. */
  careerProcess?: CareerProcess[];
};
