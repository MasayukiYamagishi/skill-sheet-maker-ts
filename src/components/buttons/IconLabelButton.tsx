import classNames from 'classnames';
import { FC } from 'react';
import { Icon } from '../icons/Icon';
import type { IconKey } from '../icons/icons';

export type IconLabelButtonProps = {
  icon: IconKey;
  label: string;
  onClick: () => void;
  btnWidth?: number;
  iconSize?: number;
  iconColor?: string;
  className?: string; // 例: "btn-primary"
  disabled?: boolean;
};

const IconLabelButton: FC<IconLabelButtonProps> = ({
  icon,
  label,
  onClick,
  btnWidth,
  iconSize = 16,
  iconColor,
  className,
  disabled = false,
}) => {
  const btnClass = classNames('btn', 'flex', 'items-center', 'justify-center', 'gap-2', className);
  const btnStyle = btnWidth ? { width: `${btnWidth}px` } : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={btnClass}
      style={btnStyle}
    >
      <Icon icon={icon} size={iconSize} color={iconColor} />
      <span>{label}</span>
    </button>
  );
};

export default IconLabelButton;
