import { ButtonVariant } from '@/types/common';
import classNames from 'classnames';
import { FC } from 'react';

type ButtonProps = {
  label: string;
  isWide?: boolean;
  disabled?: boolean;
  onClick: () => void;
  variant?: ButtonVariant;
  isOutline?: boolean;
};

// ボタンをクリックしたときに発火するイベントをPropsで渡せるようにする。
const Button: FC<ButtonProps> = ({ label, isWide, disabled, onClick, variant, isOutline }) => {
  const buttonClassNames = classNames({
    btn: true,
    'btn-wide': isWide,
    'drop-shadow-sm': true,
    [`btn-${variant}`]: variant,
    'btn-outline': isOutline,
  });

  return (
    <button type="submit" className={buttonClassNames} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
