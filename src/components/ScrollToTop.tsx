import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Browsers restore scroll position on client-side navigation; the prototype
 * scrolled to the top on every page change, so we keep that. A hash scrolls
 * to its element instead — the router doesn't do that on its own — with the
 * offset handled by the sections' scroll-margin-top.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = () => document.getElementById(hash.slice(1));
      // While the document is still loading (a cold load of a redirected
      // URL), the browser's own load-time scroll handling cancels a smooth
      // ride — jump instantly, and re-assert once loading finishes.
      if (document.readyState !== 'complete') {
        const jump = () => target()?.scrollIntoView({ block: 'start' });
        jump();
        window.addEventListener('load', jump, { once: true });
        return () => window.removeEventListener('load', jump);
      }
      target()?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
