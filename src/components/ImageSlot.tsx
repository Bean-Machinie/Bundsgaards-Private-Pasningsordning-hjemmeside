import { useLayoutEffect, useRef, useState } from 'react';

import type { Photo } from '../content/photos';
import Skeleton from './Skeleton';

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
  /** How wide this slot will be laid out, for picking among `photo.srcSet`.
   *  Only meaningful for photos that have renditions — Drive-hosted ones. */
  sizes?: string;
}

/**
 * The React stand-in for the prototype's <image-slot> web component.
 *
 * The original was a drag-and-drop editor tool that persisted uploads to a
 * sidecar JSON file — useful inside the design canvas, meaningless in a
 * deployed site. Here the slot simply renders the photo when the registry in
 * content/photos.ts has one, and a labelled placeholder describing the wanted
 * picture when it doesn't.
 *
 * It also carries everything about a photograph *arriving*, because since the
 * gallery moved to Google Drive that is no longer instant:
 *
 *   · Until the first byte decodes, the frame holds a shimmer rather than a
 *     hole, so a page scrolled through quickly never collapses and reflows.
 *   · The photo fades up once it has decoded — but only if it wasn't already
 *     in cache. A bundled image completes before the first paint, and fading
 *     in something that was ready is just a delay with a curve on it.
 *   · A photo with a `retry` URL gets one second chance at a different host
 *     before the frame gives up and shows its placeholder. Drive serves the
 *     same file from two endpoints, and they have different bad days.
 *
 * Loading is left to the browser (`loading="lazy"`), not to an observer of our
 * own: it already starts fetching well before a photo scrolls into view, and it
 * tightens that margin on a slow connection, which no hand-written threshold
 * does.
 */
export default function ImageSlot({
  photo,
  ratio = '4 / 5',
  rounding = 'lg',
  className = '',
  eager = false,
  sizes,
}: ImageSlotProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  /** 0 = the photo's own src, 1 = its retry URL. */
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'pending' | 'loaded' | 'failed'>('pending');

  const retrying = attempt > 0;
  const src = retrying ? photo.retry : photo.src;

  /* A cached or bundled image is already complete by the time this runs, and
     this runs before the browser paints — so the frame goes straight to its
     loaded state and the fade below never gets two frames to animate between.
     That is the intent: no transition on something that was never missing. */
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setStatus('loaded');
  }, [src]);

  const missing = !src || status === 'failed';

  const frameClass = [
    'image-slot',
    `image-slot--${rounding}`,
    missing ? 'image-slot--empty' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={frameClass} style={{ aspectRatio: ratio }}>
      {missing ? (
        <span className="image-slot__label">{photo.placeholder}</span>
      ) : (
        <>
          {status === 'pending' && <Skeleton className="image-slot__pending" height="100%" />}
          <img
            ref={imgRef}
            src={src}
            /* Dropped on the retry: the fallback host takes a different URL
               shape, so the rendition list no longer describes it. */
            srcSet={retrying ? undefined : photo.srcSet}
            sizes={photo.srcSet && !retrying ? sizes : undefined}
            alt={photo.alt ?? ''}
            className={status === 'loaded' ? 'is-loaded' : undefined}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setStatus('loaded')}
            onError={() => {
              if (photo.retry && !retrying) {
                setAttempt(1);
                setStatus('pending');
                return;
              }
              setStatus('failed');
            }}
          />
        </>
      )}
    </div>
  );
}
