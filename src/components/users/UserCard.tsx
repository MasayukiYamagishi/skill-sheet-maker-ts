import React from 'react';
import Link from 'next/link';
import { MdAccountCircle, MdDownload } from 'react-icons/md';
import StatusBadge, { UserStatus } from '../common/StatusBadge';
import { BUTTON_LABELS, FIELD_LABELS } from '@/constants/ui';
import { COMMON_STYLES, SIZES, TRANSITIONS } from '@/constants/styles';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
    lastUpdated?: string;
    profileImage?: string;
  };
  showActions?: boolean;
  onPdfExport?: (id: string) => void;
}

export default function UserCard({ user, showActions = true, onPdfExport }: UserCardProps) {
  const handlePdfExport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPdfExport?.(user.id);
  };

  return (
    <Link href={`/engineers/${user.id}`}>
      <div className={`${COMMON_STYLES.card} ${TRANSITIONS.default} cursor-pointer hover:border-primary/20`}>
        <div className="card-body p-4">
          <div className="flex items-start gap-4">
            {/* プロフィール画像 */}
            <div className="avatar">
              <div className="w-12 h-12 rounded-full">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={`${user.name}のプロフィール画像`}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <MdAccountCircle className={`${SIZES.avatarMd} text-base-content/50`} />
                )}
              </div>
            </div>

            {/* ユーザー情報 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral text-lg truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-base-content/70 truncate">
                    {user.email}
                  </p>
                  {user.lastUpdated && (
                    <p className="text-xs text-base-content/50 mt-1">
                      {FIELD_LABELS.lastUpdated}: {user.lastUpdated}
                    </p>
                  )}
                </div>

                {/* ステータスとアクション */}
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={user.status} size="sm" />
                  
                  {showActions && (
                    <button
                      onClick={handlePdfExport}
                      className={`${COMMON_STYLES.btnGhost} btn-sm btn-square`}
                      title={BUTTON_LABELS.pdfExport}
                    >
                      <MdDownload className={SIZES.iconSm} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}