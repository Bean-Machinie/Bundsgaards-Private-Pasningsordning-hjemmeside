/**
 * The sheet, as something the pages can read.
 *
 * Three sources feed one value, best last:
 *
 *   1. `sheet-snapshot.csv` — compiled into the bundle, so the very first
 *      paint of a first-ever visit already has the real hours on it. This is
 *      why the site has no loading state in practice: it isn't waiting for
 *      anything to know what to draw.
 *   2. `localStorage` — what this browser saw last time, which is newer than
 *      the snapshot for anyone who has been here since the last deploy.
 *   3. The live sheet — fetched in the background, and applied only if it
 *      actually differs from what's on screen.
 *
 * Each layer is merged over the one before it *per block* (see SheetContent),
 * so a partial answer can improve the page but never strip it.
 *
 * The skeletons the pages carry are therefore not the normal path — they are
 * what's left when layer 1 fails too, which means a corrupted bundle. They
 * exist because "then the page is blank" is not an acceptable answer, not
 * because a visitor is expected to see them.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { stockGallery } from '../../content/photos';
import snapshotCsv from '../../content/sheet-snapshot.csv?raw';
import { fetchSheetCsv, hashCsv, readStored, writeStored } from './client';
import { REVALIDATE_AFTER_MS, USING_PUBLISHED_FALLBACK } from './config';
import { applySheet, parseSheet } from './parse';
import type { SheetContent, SheetSource, SheetStatus, SiteData } from './types';

/** The floor. Every list empty, the gallery on its local stock photos — what
 *  is left if literally nothing parses, and the shape everything merges onto. */
const EMPTY: SiteData = {
  cards: [],
  openingHours: [],
  notes: [],
  faqs: [],
  gallery: stockGallery,
  stamp: null,
};

const SNAPSHOT_CONTENT: SheetContent = parseSheet(snapshotCsv);
const SNAPSHOT: SiteData = applySheet(EMPTY, SNAPSHOT_CONTENT);
const HAS_SNAPSHOT = Object.keys(SNAPSHOT_CONTENT).length > 0;

interface SheetState {
  data: SiteData;
  status: SheetStatus;
  source: SheetSource;
}

interface Boot {
  state: SheetState;
  /** Hash of the copy on screen, or null when it's the snapshot. */
  hash: string | null;
  /** When that copy was fetched — epoch 0 for the snapshot, which is always
   *  stale by construction and so always triggers a first look. */
  at: number;
}

/** Everything the first render needs, worked out once. */
function boot(): Boot {
  const stored = readStored();
  if (stored) {
    const content = parseSheet(stored.csv);
    if (Object.keys(content).length > 0) {
      return {
        state: { data: applySheet(SNAPSHOT, content), status: 'ready', source: 'cache' },
        hash: stored.hash,
        at: stored.at,
      };
    }
  }
  return {
    state: {
      data: SNAPSHOT,
      status: HAS_SNAPSHOT ? 'ready' : 'loading',
      source: 'snapshot',
    },
    hash: null,
    at: 0,
  };
}

const SheetContext = createContext<SheetState>({
  data: EMPTY,
  status: 'loading',
  source: 'snapshot',
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  // Lazy, and once: reading storage and parsing it must not repeat on every
  // render, and the refs below need the same answer the state was built from.
  const bootRef = useRef<Boot | undefined>(undefined);
  if (!bootRef.current) bootRef.current = boot();

  const [state, setState] = useState<SheetState>(bootRef.current.state);

  /* Both live in refs rather than in state: they decide whether to fetch and
     whether the answer is news, and neither should cause a render on its own.
     A revalidation that finds no change must be invisible. */
  const hashRef = useRef<string | null>(bootRef.current.hash);
  const checkedRef = useRef<number>(bootRef.current.at);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info(`[sheet] first paint from the ${bootRef.current?.state.source}`);
      if (USING_PUBLISHED_FALLBACK) {
        console.warn(
          '[sheet] reading the published /pub snapshot, not the live document. ' +
            'That snapshot is served from a CDN whose nodes hold different vintages, ' +
            'so an edit can appear and disappear between reloads. ' +
            'Set SHEET_DOC_ID in src/lib/sheet/config.ts to switch to the live endpoint.',
        );
      }
    }

    const controller = new AbortController();
    let cancelled = false;
    let inFlight = false;

    /**
     * @param force Skip the staleness check.
     *
     * Set for the look on page load, and only then. Loading a page is someone
     * asking for the current state of things, and answering it out of a copy
     * stored minutes ago — which is what this did at first — makes the site
     * look broken to the one person most likely to be watching it: whoever
     * just edited the sheet and reloaded to see. One request per page load is
     * not what the throttle is there to prevent.
     *
     * The throttle still governs the other caller, the tab-refocus check,
     * where flicking between tabs really could ask repeatedly for a body
     * Google won't have regenerated yet.
     */
    const revalidate = async (force = false) => {
      if (cancelled || inFlight) return;
      if (!force && Date.now() - checkedRef.current < REVALIDATE_AFTER_MS) return;

      inFlight = true;
      try {
        const csv = await fetchSheetCsv(controller.signal);
        if (cancelled) return;

        const content = parseSheet(csv);
        // An empty tab, a sheet that was unpublished, a sign-in page where the
        // CSV should be: all answer 200, and none of them are a reason to
        // replace content that is on screen and correct.
        if (Object.keys(content).length === 0) {
          checkedRef.current = Date.now();
          if (import.meta.env.DEV) {
            console.warn('[sheet] fetched, but no blocks recognised — keeping current content');
          }
          setState((prev) => (prev.status === 'loading' ? { ...prev, status: 'error' } : prev));
          return;
        }

        const hash = hashCsv(csv);
        checkedRef.current = Date.now();
        writeStored({ csv, hash, at: checkedRef.current });

        // The whole point: identical bytes end here, with no state update and
        // so no re-render anywhere on the page.
        if (hash === hashRef.current) {
          if (import.meta.env.DEV) console.info('[sheet] checked — unchanged');
          return;
        }
        hashRef.current = hash;
        if (import.meta.env.DEV) {
          console.info('[sheet] applied from the live sheet', {
            blocks: Object.keys(content),
            stamp: content.stamp ? content.stamp.sublines.join(' ') : 'skjult',
            cards: content.cards?.map((card) => `${card.title} (${card.rows.length})`),
            faqs: content.faqs?.length,
            billeder: content.gallery?.length,
          });
        }
        setState({ data: applySheet(SNAPSHOT, content), status: 'ready', source: 'network' });
      } catch (error) {
        if (cancelled) return;
        if (import.meta.env.DEV) console.warn('[sheet] fetch failed', error);
        // Only a page with nothing on it has anything to report; everyone else
        // keeps reading the copy they already have.
        setState((prev) => (prev.status === 'loading' ? { ...prev, status: 'error' } : prev));
      } finally {
        inFlight = false;
      }
    };

    void revalidate(true);

    /* A tab left open all morning would otherwise still be showing yesterday's
       hours. Coming back to it is the natural moment to look again — and the
       staleness check above means flicking between tabs costs nothing. */
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void revalidate();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      controller.abort();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <SheetContext.Provider value={state}>{children}</SheetContext.Provider>;
}

/** The content the page should render. Never null, never half-built. */
export function useSiteData(): SiteData {
  return useContext(SheetContext).data;
}

/**
 * Whether that content is real yet.
 *
 * `ready` for all but a broken bundle — see the note at the top of this file
 * before reaching for a skeleton on the strength of it.
 */
export function useSheetStatus(): { status: SheetStatus; source: SheetSource } {
  const { status, source } = useContext(SheetContext);
  return { status, source };
}
