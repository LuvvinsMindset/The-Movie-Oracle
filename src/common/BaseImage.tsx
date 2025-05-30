import Image, { ImageProps } from 'next/image';
import { Omit } from './CommonTypes';

type BaseImageProps = Omit<ImageProps, 'alt'> &
  Required<Pick<ImageProps, 'alt'>>;

function BaseImage({ src, alt, ...rest }: BaseImageProps) {
  return (
    <Image
      src={src ?? '/placeholder.png'}
      alt={alt}
      {...rest}
      unoptimized
    />
  );
}

export default BaseImage;
