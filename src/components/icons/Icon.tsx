// src/components/Icon.tsx
import { FC } from 'react';
import type { IconType } from 'react-icons';
import { IconKey, iconMap } from './icons';

export type IconProps = {
  icon: IconKey;
  size?: number;
  color?: string;
  className?: string;
};

export const Icon: FC<IconProps> = ({ icon, size = 16, color, className }) => {
  const IconComponent = iconMap[icon] as IconType | undefined;
  if (!IconComponent) {
    return undefined;
  }

  return (
    <span className='flex items-center content-center'>
      <IconComponent size={size} color={color} className={className} />
    </span>
  );
};
