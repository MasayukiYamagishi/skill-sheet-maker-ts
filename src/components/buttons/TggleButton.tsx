import React, { FC } from 'react';
import classNames from 'classnames';

export type ToggleButtonProps = {
  label: string;
  toggled: boolean;
  onToggle: (newState: boolean) => void;
  btnWidth?: number;
  className?: string; // 例: "btn-primary"
  disabled?: boolean;
};

const ToggleButton: FC<ToggleButtonProps> = ({
  label,
  toggled,
  onToggle,
  btnWidth,
  className,
  disabled = false,
}) => {
  const btnClass = classNames('btn', toggled ? 'btn-active' : 'btn-outline', className);
  const btnStyle = btnWidth ? { width: `${btnWidth}px` } : undefined;

  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle(!toggled)}
      disabled={disabled}
      className={btnClass}
      style={btnStyle}
    >
      {label}
    </button>
  );
};

export default ToggleButton;
