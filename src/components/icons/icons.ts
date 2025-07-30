// src/components/icons.ts
import {
  MdDownload,
  MdOutlineArchive,
  MdOutlineCheckCircleOutline,
  MdOutlineClose,
  MdOutlineErrorOutline,
  MdOutlineFavorite,
  MdOutlineInfo,
  MdOutlineMailOutline,
  MdOutlineShare,
  MdOutlineWarningAmber,
  MdSearch,
} from 'react-icons/md';

// 使いたいアイコンをここに追加していく
export const iconMap = {
  archive: MdOutlineArchive,
  close: MdOutlineClose,
  error: MdOutlineErrorOutline,
  download: MdDownload,
  favorite: MdOutlineFavorite,
  info: MdOutlineInfo,
  mail: MdOutlineMailOutline,
  share: MdOutlineShare,
  search: MdSearch,
  success: MdOutlineCheckCircleOutline,
  warning: MdOutlineWarningAmber,
} as const;

export type IconKey = keyof typeof iconMap;
