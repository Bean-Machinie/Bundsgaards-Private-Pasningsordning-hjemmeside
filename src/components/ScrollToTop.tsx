import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Browsers restore scroll position on client-side navigation; the prototype
 * scrolled to the top on every page change, so we keep that. Hash links are
 * left alone so in-page anchors still work.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
