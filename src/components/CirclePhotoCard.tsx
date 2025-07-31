import { FC } from 'react';

type CirclePhotoCardProps = {
  src?: string;
  altText?: string;
  size?: number;
};

const CirclePhotoCard: FC<CirclePhotoCardProps> = ({
  src,
  altText,
  size = 96,
}) => {
  return (
    <div className='avatar'>
      <div
        className='aspect-square overflow-hidden rounded-full bg-neutral-700'
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          className='object-cover w-full h-full'
          src={src || '/img/avatar_img.png'}
          alt={altText}
        />
      </div>
    </div>
  );
};

export default CirclePhotoCard;
