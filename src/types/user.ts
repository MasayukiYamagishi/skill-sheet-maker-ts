import { GenderConst, UserStatusConst } from '@/constants/constants';
import { SqlDate, UUID } from './common';

/** 性別. */
export type Gender = keyof typeof GenderConst;
/** ユーザステータス. */
export type UserStatus = keyof typeof UserStatusConst;

/** ==========================
 *   ユーザ情報・本人情報
 * ==========================
 */
export type User = {
  /** UUID. */
  id: UUID;
  /** 作成日. */
  createdAt: SqlDate;
  /** 更新日. */
  updatedAt: SqlDate;
  /** ユーザログイン用ID. */
  userIdentifier: string;
  /** 名前. */
  name: string;
  /** 名前カナ. */
  nameKana: string;
  /** 生年月日. */
  birthDate: SqlDate;
  /** 性別. */
  gender: Gender;
  /** メールアドレス. */
  email: string;
  /** MBTI性格タイプ. */
  mbtiType?: string;
  /** MBTI性格傾向（A or T） */
  mbtiIdentity?: string;
  /** 入社年月日. */
  joinedAt?: SqlDate;
  /** 退職年月日. */
  retiredAt?: SqlDate;
  /** 最終学歴. */
  finalEducation?: string;
  /** ユーザステータス. */
  status: UserStatus;
  /** 所属. */
  affiliation?: string;
  /** ユーザプロフィール画像のパス. */
  avatarPath?: string;
  /** GitHub URL. */
  githubUrl?: string;
  /** 自己PRテキスト. */
  prText?: string;
  /** 得意な技術分野. */
  specialty?: string;
  /** 得意な技術スキル. */
  techStrength?: string;
  /** 営業コメント. */
  salesComment?: string;
  /** TOEICスコア. */
  toeicScore?: number;
  /** その他のスキル. */
  otherSkills?: string;
};

/** ユーザ情報新規登録用. */
export type NewUser = {
  /** ユーザログイン用ID. */
  userIdentifier: string;
  /** 名前. */
  name: string;
  /** 名前カナ. */
  nameKana: string;
  /** 生年月日. */
  birthDate: SqlDate;
  /** 性別. */
  gender: Gender;
  /** メールアドレス. */
  email: string;
  /** MBTI性格タイプ. */
  mbtiType?: string;
  /** MBTI性格傾向（A or T） */
  mbtiIdentity?: string;
  /** 入社年月日. */
  joinedAt?: SqlDate;
  /** 退職年月日. */
  retiredAt?: SqlDate;
  /** 最終学歴. */
  finalEducation?: string;
  /** ユーザステータス. */
  status: UserStatus;
  /** 所属. */
  affiliation?: string;
  /** ユーザプロフィール画像のパス. */
  avatarPath?: string;
  /** GitHub URL. */
  githubUrl?: string;
  /** 自己PRテキスト. */
  prText?: string;
  /** 得意な技術分野. */
  specialty?: string;
  /** 得意な技術スキル. */
  techStrength?: string;
  /** 営業コメント. */
  salesComment?: string;
  /** TOEICスコア. */
  toeicScore?: number;
  /** その他のスキル. */
  otherSkills?: string;
};

/** ユーザ情報更新用. */
export type UpdateUser = {
  /** ユーザログイン用ID. */
  userIdentifier?: string;
  /** 名前. */
  name?: string;
  /** 名前カナ. */
  nameKana?: string;
  /** 生年月日. */
  birthDate?: SqlDate;
  /** 性別. */
  gender?: Gender;
  /** メールアドレス. */
  email?: string;
  /** MBTI性格タイプ. */
  mbtiType?: string;
  /** MBTI性格傾向（A or T） */
  mbtiIdentity?: string;
  /** 入社年月日. */
  joinedAt?: SqlDate;
  /** 退職年月日. */
  retiredAt?: SqlDate;
  /** 最終学歴. */
  finalEducation?: string;
  /** ユーザステータス. */
  status?: UserStatus;
  /** 所属. */
  affiliation?: string;
  /** ユーザプロフィール画像のパス. */
  avatarPath?: string;
  /** GitHub URL. */
  githubUrl?: string;
  /** 自己PRテキスト. */
  prText?: string;
  /** 得意な技術分野. */
  specialty?: string;
  /** 得意な技術スキル. */
  techStrength?: string;
  /** 営業コメント. */
  salesComment?: string;
  /** TOEICスコア. */
  toeicScore?: number;
  /** その他のスキル. */
  otherSkills?: string;
};

/** ユーザーリストDTO（バックエンドレスポンス用） */
export type UserListDto = {
  users: User[];
  total_count: number;
};
