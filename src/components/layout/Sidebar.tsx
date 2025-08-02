'use client';

import { COMMON_STYLES, SIZES } from '@/constants/styles';
import { A11Y_LABELS, APP_NAME, MENU_LABELS } from '@/constants/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdBarChart,
  MdHelpOutline,
  MdHome,
  MdLogout,
  MdPeople,
  MdSettings,
} from 'react-icons/md';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'admin' | 'sales' | 'engineer';
}

const menuItems = [
  {
    name: MENU_LABELS.home,
    href: '/dashboard',
    icon: MdHome,
    roles: ['admin', 'sales', 'engineer'],
  },
  {
    name: MENU_LABELS.engineers,
    href: '/engineers',
    icon: MdPeople,
    roles: ['admin', 'sales'],
  },
  {
    name: MENU_LABELS.summary,
    href: '/summary',
    icon: MdBarChart,
    roles: ['admin', 'sales'],
  },
  {
    name: MENU_LABELS.myProfile,
    href: '/my-profile',
    icon: MdPeople,
    roles: ['engineer'],
  },
  {
    name: MENU_LABELS.settings,
    href: '/settings',
    icon: MdSettings,
    roles: ['admin'],
  },
];

export default function Sidebar({
  isOpen,
  onClose,
  userRole = 'admin',
}: SidebarProps) {
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* オーバーレイ（モバイル時） */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-300
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* ヘッダー */}
        <div className='flex h-16 items-center justify-between px-6 border-b border-base-300'>
          <h2 className='text-lg font-semibold text-neutral'>{APP_NAME}</h2>
          <button
            className={`${COMMON_STYLES.btnGhost} btn-sm lg:hidden`}
            onClick={onClose}
            aria-label={A11Y_LABELS.closeMenu}
          >
            ✕
          </button>
        </div>

        {/* メニュー */}
        <nav className='flex-1 px-4 py-4'>
          <ul className='menu bg-base-100 w-full'>
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'
                    }`}
                    onClick={() => onClose()}
                  >
                    <Icon className={SIZES.iconMd} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* フッターメニュー */}
        <div className='border-t border-base-300 p-4'>
          <ul className='menu bg-base-100 w-full'>
            <li>
              <button className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 w-full text-left'>
                <MdHelpOutline className={SIZES.iconMd} />
                <span>{MENU_LABELS.help}</span>
              </button>
            </li>
            <li>
              <button className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 w-full text-left text-error'>
                <MdLogout className={SIZES.iconMd} />
                <span>{MENU_LABELS.logout}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
