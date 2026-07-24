import type { Photo } from '../content/photos';

import './ImageSlot.css';

interface ImageSlotProps {
  photo: Photo;
  /** CSS aspect-ratio, e.g. '4 / 5'. */
  ratio?: string;
  /** Corner rounding, relative to --radius-lg. */
  rounding?: 'md' | 'lg' | 'xl';
  className?: string;
  /** Native lazy-loading. Turn off for the hero, which is above the fold. */
  eager?: boolean;
}

/**
 * The React stand-in for the prototype's <image-slot> web component.
 *
 * The original was a drag-and-drop editor tool that persisted uploads to a
 * sidecar JSON file — useful inside the design canvas, meaningless in a
 * deployed site. Here the slot simply renders the photo when the registry in
 * content/photos.ts has one, and a labelled placeholder describing the wanted
 * picture when it doesn't.
 */
export default function ImageSlot({
  photo,
  ratio = '4 / 5',
  rounding = 'lg',
  className = '',
  eager = false,
}: ImageSlotProps) {
  const frameClass = [
    'image-slot',
    `image-slot--${rounding}`,
    photo.src ? '' : 'image-slot--empty',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={frameClass} style={{ aspectRatio: ratio }}>
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt ?? ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <span className="image-slot__label">{photo.placeholder}</span>
      )}
    </div>
  );
}
