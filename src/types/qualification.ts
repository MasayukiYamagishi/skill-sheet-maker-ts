/** ==========================
 *   資格マスタ/ユーザ資格
 * ==========================
 */

import { SqlDate, UUID } from './common';

/** 資格マスタ. */
export type Qualification = {
  id: string;
  name: string;
  description?: string;
  isNational: boolean;
};

/** ユーザが持つ資格. */
export type UserQualification = {
  /** ユーザUUID. */
  userId: UUID;
  /** 資格ID. */
  qualificationId: string;
  /** 取得年月日. */
  acquiredAt?: SqlDate;
};

/** ユーザが持つ資格 新規登録用. */
export type NewUserQualification = {
  /** ユーザUUID. */
  userId: UUID;
  /** 資格ID. */
  qualificationId: string;
  /** 取得年月日. */
  acquiredAt?: SqlDate;
};

/** ユーザが持つ資格 更新用. */
export type UpdateUserQualification = {
  /** ユーザUUID. */
  userId: UUID;
  /** 資格ID. */
  qualificationId: string;
  /** 取得年月日. */
  acquiredAt?: SqlDate;
};

/** ユーザが持つ資格 削除用. */
export type DeleteUserQualification = {
  /** ユーザUUID. */
  userId: UUID;
  /** 資格ID. */
  qualificationIds: string[];
};

export type QualificationDetail = {
  /** 資格情報. */
  qualification: Qualification;
  /** 取得年月日. */
  acquiredAt?: string;
};

export type UserFullQualifications = {
  /** ユーザID. */
  userId: UUID;
  /** 資格データ詳細. */
  qualificationDetail: QualificationDetail[];
};
