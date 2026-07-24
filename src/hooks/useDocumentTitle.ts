import { useEffect } from 'react';

import { site } from '../content/site';

/**
 * Sets <title> for the current page. The front page uses the descriptive
 * default from index.html; every other page gets `${title} · Bundsgård`.
 */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title
      ? `${title} · ${site.name}`
      : `${site.name} · Privat pasningsordning i ${site.city}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
