import classNames from 'classnames';
import { FC } from 'react';

type DeviconIconProps = {
  name: string;
  fontSize?: number;
  className?: string;
};

const DeviconIcon: FC<DeviconIconProps> = ({ name, fontSize = 16, className }) => {
  const deviconClassName = classNames('devicon-' + name + '-original', 'colored', className);

  return (
    <div>
      <i className={deviconClassName} style={{ fontSize: fontSize, verticalAlign: 'middle' }}></i>
    </div>
  );
};

export default DeviconIcon;
