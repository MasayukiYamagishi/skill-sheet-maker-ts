import classNames from 'classnames';
import { FC } from 'react';
import { Icon } from '../icons/Icon';
import { IconKey } from '../icons/icons';

type SquareIconButtonProps = {
  icon: IconKey;
  iconSize?: number;
  iconColor?: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
};

const SquareIconButton: FC<SquareIconButtonProps> = ({
  icon,
  iconSize = 16,
  iconColor,
  className,
  disabled,
  onClick,
}) => {
  const btnClass = classNames(
    'btn',
    'btn-square',
    className // 追加のユーティリティ（例: "btn-primary"）
  );

  return (
    <button
      type='button'
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon icon={icon} size={iconSize} color={iconColor} />
    </button>
  );
};

export default SquareIconButton;
