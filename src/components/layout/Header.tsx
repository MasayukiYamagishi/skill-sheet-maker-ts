'use client';

import { COMMON_STYLES, SIZES } from '@/constants/styles';
import {
  A11Y_LABELS,
  APP_NAME,
  BUTTON_LABELS,
  MENU_LABELS,
} from '@/constants/ui';
import { MdAccountCircle, MdMenu } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  };
  onSidebarToggle: () => void;
}

export default function Header({ user, onSidebarToggle }: HeaderProps) {
  const router = useRouter();

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className='navbar bg-base-100 border-b border-base-300 px-4 lg:px-6'>
      {/* モバイル用サイドバートグル */}
      <div className='navbar-start'>
        <button
          className='btn btn-ghost btn-square lg:hidden'
          onClick={onSidebarToggle}
          aria-label={A11Y_LABELS.openMenu}
        >
          <MdMenu className={SIZES.iconLg} />
        </button>

        {/* ロゴ */}
        <div className='hidden lg:flex'>
          <h1 className='text-xl font-bold text-neutral'>{APP_NAME}</h1>
        </div>
      </div>

      {/* 中央 */}
      <div className='navbar-center lg:hidden'>
        <h1 className='text-xl font-bold text-neutral'>{APP_NAME}</h1>
      </div>

      {/* 右側 */}
      <div className='navbar-end'>
        {user ? (
          <div className='dropdown dropdown-end'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-ghost btn-circle avatar'
            >
              <div className='w-10 rounded-full'>
                <MdAccountCircle className='h-10 w-10 text-base-content' />
              </div>
            </div>
            <ul
              tabIndex={0}
              className='menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300'
            >
              <li className='menu-title'>
                <span>{user.name}</span>
                <span className='text-xs text-base-content/60'>
                  {user.email}
                </span>
              </li>
              <li>
                <a onClick={() => handleMenuClick('/my-profile')} className='cursor-pointer'>
                  {MENU_LABELS.myProfile}
                </a>
              </li>
              <li>
                <a onClick={() => handleMenuClick('/settings')} className='cursor-pointer'>
                  {MENU_LABELS.settings}
                </a>
              </li>
              <li>
                <a>{MENU_LABELS.help}</a>
              </li>
              <div className='divider my-1'></div>
              <li>
                <a className='text-error'>{MENU_LABELS.logout}</a>
              </li>
            </ul>
          </div>
        ) : (
          <button className={COMMON_STYLES.btnPrimary}>
            {BUTTON_LABELS.login}
          </button>
        )}
      </div>
    </div>
  );
}
