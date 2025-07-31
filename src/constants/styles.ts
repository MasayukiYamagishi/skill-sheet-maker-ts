// スタイル関連の定数

/** サイズ定数 */
export const SIZES = {
  avatarSm: 'w-8 h-8',
  avatarMd: 'w-12 h-12',
  avatarLg: 'w-16 h-16',
  avatarXl: 'w-32 h-32',
  iconSm: 'h-4 w-4',
  iconMd: 'h-5 w-5',
  iconLg: 'h-6 w-6',
  iconXl: 'h-8 w-8',
  iconXxl: 'h-16 w-16',
} as const;

/** スペーシング定数 */
export const SPACING = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  cardPadding: 'p-6',
  sectionPadding: 'p-4 lg:p-6',
  containerMargin: 'space-y-6',
} as const;

/** レイアウト定数 */
export const LAYOUT = {
  sidebarWidth: 'w-64',
  headerHeight: 'h-16',
  containerMaxWidth: 'max-w-7xl',
  cardShadow: 'shadow-lg hover:shadow-xl',
  cardBorder: 'border border-base-300',
  cardRadius: 'rounded-xl',
  buttonRadius: 'rounded-lg',
  inputRadius: 'rounded-lg',
} as const;

/** トランジション定数 */
export const TRANSITIONS = {
  default: 'transition-all duration-200',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-300',
  shadow: 'transition-shadow',
  colors: 'transition-colors',
  transform: 'transition-transform',
} as const;

/** Z-index定数 */
export const Z_INDEX = {
  dropdown: 'z-[1]',
  modal: 'z-40',
  overlay: 'z-40',
  sidebar: 'z-50',
  skipLink: 'z-50',
} as const;

/** 共通スタイルクラス */
export const COMMON_STYLES = {
  // カード
  card: 'card bg-base-100 shadow-lg hover:shadow-xl transition-shadow',
  cardBody: 'card-body p-6',

  // ボタン
  btnPrimary: 'btn btn-primary',
  btnSecondary: 'btn btn-secondary',
  btnOutline: 'btn btn-outline',
  btnGhost: 'btn btn-ghost',
  btnError: 'btn btn-error',
  btnSm: 'btn-sm',
  btnMd: '',
  btnLg: 'btn-lg',

  // フォーム
  formInput: 'input input-bordered w-full',
  formSelect: 'select select-bordered',
  formTextarea: 'textarea textarea-bordered',
  formLabel: 'label label-text font-medium',

  // レスポンシブグリッド
  gridCols1: 'grid grid-cols-1',
  gridCols2: 'grid grid-cols-1 md:grid-cols-2',
  gridCols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gridCols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',

  // フレックス
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-row',

  // テキスト
  textHeadingH1: 'text-3xl font-bold text-neutral',
  textHeadingH2: 'text-2xl font-bold text-neutral',
  textHeadingH3: 'text-xl font-bold text-neutral',
  textBody: 'text-base text-base-content',
  textMuted: 'text-sm text-base-content/70',
  textError: 'text-error',
  textSuccess: 'text-success',
  textWarning: 'text-warning',
  textInfo: 'text-info',

  // 状態
  loading: 'loading loading-spinner loading-md',
  skeleton: 'skeleton',

  // バッジ
  badgePrimary: 'badge badge-primary',
  badgeSecondary: 'badge badge-secondary',
  badgeSuccess: 'badge badge-success',
  badgeWarning: 'badge badge-warning',
  badgeError: 'badge badge-error',
  badgeInfo: 'badge badge-info',
  badgeSm: 'badge-sm',
  badgeMd: '',
  badgeLg: 'badge-lg',
  badgeOutline: 'badge-outline',

  // アニメーション
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',

  // レスポンシブ表示/非表示
  hiddenMobile: 'hidden md:block',
  hiddenDesktop: 'block md:hidden',
  hiddenTablet: 'hidden lg:block',

  // ポジショニング
  absolute: 'absolute',
  relative: 'relative',
  fixed: 'fixed',
  sticky: 'sticky',

  // オーバーフロー
  overflowHidden: 'overflow-hidden',
  overflowScroll: 'overflow-scroll',
  overflowAuto: 'overflow-auto',

  // カーソル
  cursorPointer: 'cursor-pointer',
  cursorNotAllowed: 'cursor-not-allowed',
  cursorDefault: 'cursor-default',
} as const;

/** ユーザーステータス別のスタイル */
export const STATUS_STYLES = {
  inProject: {
    badge: 'badge badge-info',
    text: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info',
  },
  available: {
    badge: 'badge badge-success',
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success',
  },
  onLeave: {
    badge: 'badge badge-warning',
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning',
  },
  retired: {
    badge: 'badge badge-error',
    text: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error',
  },
} as const;

/** アニメーション用のクラス */
export const ANIMATIONS = {
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideInLeft: 'animate-in slide-in-from-left duration-300',
  slideInRight: 'animate-in slide-in-from-right duration-300',
  slideInUp: 'animate-in slide-in-from-bottom duration-300',
  slideInDown: 'animate-in slide-in-from-top duration-300',
  scaleIn: 'animate-in zoom-in duration-200',
  scaleOut: 'animate-out zoom-out duration-200',
} as const;
