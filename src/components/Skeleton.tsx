import type { CSSProperties } from 'react';

import './Skeleton.css';

interface SkeletonProps {
  /** Any CSS length or percentage. Defaults to filling the line. */
  width?: string;
  /** Defaults to one line of body text. */
  height?: string;
  /** Cream-on-dark, for the footer. */
  tone?: 'light' | 'dark';
  /** Stagger the sheen, so a stack of these reads as one surface being
   *  revealed rather than as several unrelated things flashing at once. */
  delay?: number;
  className?: string;
}

/**
 * A stand-in for a line of text that isn't known yet.
 *
 * Worth being clear about when this is on screen: almost never. The site
 * compiles a copy of the sheet into the bundle (see lib/sheet/provider), so the
 * first paint of a first visit already has the real content — there is no gap
 * to fill. These are for the case where that fails, and for the one thing the
 * bundle genuinely cannot carry: photographs hosted on Google Drive, which are
 * fetched over the network like any other image and are what `ImageSlot` shows
 * this against while they arrive.
 *
 * Hidden from assistive technology — a screen reader should hear the content
 * when it exists and nothing before then, not a description of a grey box.
 */
export default function Skeleton({
  width,
  height,
  tone = 'light',
  delay = 0,
  className = '',
}: SkeletonProps) {
  const style: CSSProperties = { width, height, animationDelay: delay ? `${delay}ms` : undefined };

  return (
    <span
      className={['skeleton', tone === 'dark' ? 'skeleton--dark' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
}
