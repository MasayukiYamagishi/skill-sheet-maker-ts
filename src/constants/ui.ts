// UI関連の定数

/** アプリケーション名 */
export const APP_NAME = 'Orbit' as const;

/** ページタイトル */
export const PAGE_TITLES = {
  home: 'Dashboard',
  engineers: 'エンジニア一覧',
  engineerDetail: 'エンジニア詳細',
  summary: 'サマリ',
  settings: '設定',
  myProfile: 'マイページ',
} as const;

/** ページ説明文 */
export const PAGE_DESCRIPTIONS = {
  home: 'エンジニア管理システムの概要',
  engineers: '登録されているエンジニアの管理',
  engineerDetail: 'エンジニアの詳細情報',
  summary: 'エンジニアの統計情報',
  settings: 'システム設定',
  myProfile: 'プロフィールの管理',
} as const;

/** ボタンラベル */
export const BUTTON_LABELS = {
  login: 'ログイン',
  logout: 'ログアウト',
  edit: '編集',
  save: '保存',
  cancel: 'キャンセル',
  delete: '削除',
  back: '戻る',
  close: '閉じる',
  search: '検索',
  filter: 'フィルター',
  export: '出力',
  import: '取り込み',
  add: '追加',
  register: '登録',
  update: '更新',
  download: 'ダウンロード',
  upload: 'アップロード',
  selectAll: '全選択',
  deselectAll: '全選択解除',
  csvExport: 'CSV出力',
  pdfExport: 'PDF出力',
  bulkPdfExport: '一括PDF出力',
  newRegistration: '新規登録',
  advancedSearch: '高度な検索',
  showAll: 'すべて表示',
  help: 'ヘルプ',
  settings: '設定',
  profile: 'プロフィール',
  retry: '再試行',
  home: 'ホーム',
  backToHome: 'ホームへ戻る',
  backToList: 'ユーザー一覧へ戻る',
  backToEngineers: 'エンジニア一覧へ戻る',
} as const;

/** メニューラベル */
export const MENU_LABELS = {
  home: 'ホーム',
  engineers: 'エンジニア',
  summary: 'サマリ',
  myProfile: 'マイページ',
  settings: '設定',
  help: 'ヘルプ',
  logout: 'ログアウト',
} as const;

/** プレースホルダーテキスト */
export const PLACEHOLDERS = {
  search: '検索',
  searchByNameEmail: '名前、メールアドレスで検索...',
  email: 'メールアドレス',
  password: 'パスワード',
  name: '名前',
  phoneNumber: '電話番号',
} as const;

/** エラーメッセージ */
export const ERROR_MESSAGES = {
  required: '必須項目です',
  invalidEmail: '有効なメールアドレスを入力してください',
  invalidPassword: 'パスワードが正しくありません',
  networkError: 'ネットワークエラーが発生しました',
  userNotFound: 'ユーザーが見つかりません',
  accessDenied: 'アクセスが拒否されました',
  sessionExpired: 'セッションが期限切れです',
  unexpectedError: '予期しないエラーが発生しました',
} as const;

/** 成功メッセージ */
export const SUCCESS_MESSAGES = {
  saved: '保存しました',
  updated: '更新しました',
  deleted: '削除しました',
  exported: '出力しました',
  imported: '取り込みました',
  registered: '登録しました',
} as const;

/** ローディングメッセージ */
export const LOADING_MESSAGES = {
  loading: '読み込み中...',
  saving: '保存中...',
  updating: '更新中...',
  deleting: '削除中...',
  exporting: '出力中...',
  importing: '取り込み中...',
  userInfo: 'ユーザー情報を読み込み中...',
  mbtiInfo: 'MBTI情報を読み込み中...',
  skillInfo: 'スキル情報を読み込み中...',
  qualificationInfo: '資格情報を読み込み中...',
  careerInfo: '経歴情報を読み込み中...',
} as const;

/** 情報メッセージ */
export const INFO_MESSAGES = {
  noData: 'データがありません',
  noUsers: 'エンジニアが登録されていません',
  noSkills: 'スキル情報が登録されていません',
  noQualifications: '資格情報が登録されていません',
  noCareerHistory: '経歴情報が登録されていません',
  skillsUnderConstruction: '工程中のため、スキル情報を表示できません',
  comingSoon: '実装予定',
  graphArea: 'グラフエリア',
} as const;

/** 統計情報ラベル */
export const STATS_LABELS = {
  totalEngineers: '登録エンジニア数',
  available: '営業中',
  inProject: '案件中',
  onLeave: '休職中',
  retired: '退職済み',
  utilizationRate: '稼働率',
  monthlyIncrease: '今月の増加',
  trend: 'エンジニア数推移',
  recentActivity: '最近の活動',
  quickActions: 'クイックアクション',
  systemInfo: 'システム情報',
  lastDataUpdate: '最終データ更新',
  backup: 'バックアップ',
  systemStatus: 'システム状態',
  normal: '正常',
  running: '稼働中',
  other: 'その他',
} as const;

/** フィルターオプション */
export const FILTER_OPTIONS = {
  allStatuses: 'すべての状態',
  allSkills: 'すべてのスキル',
  allDepartments: 'すべての部署',
} as const;

/** 期間選択オプション */
export const PERIOD_OPTIONS = {
  oneMonth: '1ヶ月',
  threeMonths: '3ヶ月',
  sixMonths: '6ヶ月',
  oneYear: '1年',
} as const;

/** MBTI関連ラベル */
export const MBTI_LABELS = {
  title: 'MBTI',
  type: 'タイプ',
  identity: 'アイデンティティ',
  traits: '特徴',
  positiveKeywords: 'ポジティブキーワード',
  negativeKeywords: 'ネガティブキーワード',
} as const;

/** セクションタイトル */
export const SECTION_TITLES = {
  basicInfo: '基本情報',
  profileInfo: 'プロフィール情報',
  mbti: 'MBTI',
  skills: 'スキル',
  qualifications: '保有資格',
  careerHistory: '学歴・職歴',
  education: '学歴',
  workExperience: '職歴',
  processes: '担当工程',
  technologies: '使用技術',
  statistics: '統計情報',
  filters: 'フィルター',
  bulkOperations: '一括操作',
  pagination: 'ページネーション',
} as const;

/** フィールドラベル */
export const FIELD_LABELS = {
  id: 'ID',
  name: '名前',
  nameKana: 'フリガナ',
  email: 'メールアドレス',
  birthDate: '生年月日',
  age: '年齢',
  gender: '性別',
  joinDate: '受講開始日',
  endDate: '受講終了予定日',
  company: '会社名',
  position: '役職',
  startDate: '開始日',
  role: '役割',
  scale: '規模',
  description: '説明',
  acquiredAt: '取得日',
  obtainedDate: '取得',
  lastUpdated: '最終更新',
  status: '状態',
} as const;

/** アクセシビリティラベル */
export const A11Y_LABELS = {
  openMenu: 'メニューを開く',
  closeMenu: 'メニューを閉じる',
  userMenu: 'ユーザーメニュー',
  profileImage: 'プロフィール画像',
  logo: 'ロゴ',
  searchInput: '検索入力',
  filterButton: 'フィルターボタン',
  sortButton: 'ソートボタン',
  selectAll: 'すべて選択',
  selectItem: 'アイテムを選択',
} as const;