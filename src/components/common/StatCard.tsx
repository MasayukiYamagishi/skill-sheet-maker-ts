import { COMMON_STYLES, SIZES } from '@/constants/styles';
import React from 'react';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  trend,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up')
      return <MdArrowUpward className={`${SIZES.iconSm} text-success`} />;
    if (trend === 'down')
      return <MdArrowDownward className={`${SIZES.iconSm} text-error`} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-base-content';
  };

  return (
    <div className={COMMON_STYLES.card}>
      <div className={COMMON_STYLES.cardBody}>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-base-content/70 mb-2'>
              {title}
            </h3>
            <div className='text-3xl font-bold text-neutral mb-2'>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {change !== undefined && (
              <div
                className={`flex items-center gap-1 text-sm ${getTrendColor()}`}
              >
                {getTrendIcon()}
                <span>
                  {change > 0 ? '+' : ''}
                  {change}
                  {typeof change === 'number' && change !== 0 && '%'}
                </span>
              </div>
            )}
          </div>
          {icon && <div className='text-primary opacity-80'>{icon}</div>}
        </div>
      </div>
    </div>
  );
}
