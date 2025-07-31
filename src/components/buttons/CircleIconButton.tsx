import { FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../icons/Icon';
import type { IconKey } from '../icons/icons';

export type CircleIconButtonProps = {
  icon: IconKey;
  iconSize?: number;
  iconColor?: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
};

const CircleIconButton: FC<CircleIconButtonProps> = ({
  icon,
  iconSize = 16,
  onClick,
  iconColor,
  className,
  disabled = false,
}) => {
  const btnClass = classNames(
    'btn',
    'btn-circle',
    className // 追加のユーティリティ（例: "btn-primary"）
  );

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={btnClass}
    >
      <Icon icon={icon} size={iconSize} color={iconColor} />
    </button>
  );
};

export default CircleIconButton;
