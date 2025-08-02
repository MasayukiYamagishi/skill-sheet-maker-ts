import { UserStatus } from '@/types/user';

/** 性別. */
export const GenderConst = {
  male: '男',
  female: '女',
  other: 'その他',
} as const;

/** ユーザステータス. */
export const UserStatusConst = {
  inProject: '案件参画中',
  available: '営業中',
  onLeave: '休職中',
  retired: '離職済み',
} as const;

/** ユーザステータスごとのクラス名マップ. */
export const UserStatusBadgeClass: Record<UserStatus, string> = {
  inProject: 'badge badge-info',
  available: 'badge badge-success',
  onLeave: 'badge badge-warning',
  retired: 'badge badge-error',
};

/** 担当工程マスタ. */
export const ProcessMasterConst = [
  { id: 1, name: '要件定義' },
  { id: 2, name: '基本設計' },
  { id: 3, name: '詳細設計' },
  { id: 4, name: '実装' },
  { id: 5, name: 'テスト' },
  { id: 6, name: '保守・運用' },
] as const;
