import React from 'react';
import { UserStatusConst } from '@/constants/constants';

export type UserStatus = 'inProject' | 'available' | 'onLeave' | 'retired';

interface StatusBadgeProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  inProject: {
    label: UserStatusConst.inProject,
    className: 'badge-info',
  },
  available: {
    label: UserStatusConst.available,
    className: 'badge-success',
  },
  onLeave: {
    label: UserStatusConst.onLeave,
    className: 'badge-warning',
  },
  retired: {
    label: UserStatusConst.retired,
    className: 'badge-error',
  },
};

const sizeConfig = {
  sm: 'badge-sm',
  md: '',
  lg: 'badge-lg',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];
  
  return (
    <div className={`badge ${config.className} ${sizeClass} font-medium`}>
      {config.label}
    </div>
  );
}