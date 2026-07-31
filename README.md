# Bundsgård — privat pasningsordning

Website for Bundsgård, a private childcare arrangement (privatpasningsordning)
in Stenløse. React + TypeScript + Vite, plain CSS.

The site is in Danish; so is all page copy in `src/content/`. Code, comments and
this README are in English. The caretaker's own guide to the sheet that drives
the changeable content is [REGNEARK.md](REGNEARK.md), and it is in Danish
because she is who it is for.

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run build` | Sync the sheet snapshot, typecheck (`tsc -b`), build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Types only, no build |
| `npm run sync:sheet` | Pull the live sheet into `src/content/sheet-snapshot.csv` |

`prebuild` runs `sync:sheet --soft` before every build, which never fails the
build — see [Content from the sheet](#content-from-the-sheet).

## Where things live

```
src/
  styles/theme.css     Design tokens — palette, type, spacing, radius scale.
  styles/base.css      Element defaults + component classes (.btn/.card/.tag…).
  styles/global.css    App layer — layout primitives built on those tokens.
  assets/              Local images; stock.ts names each photo (see Photos).
  content/             Copy and data, typed. Edit text here, not in JSX —
                       except the parts that come from the sheet, below.
  lib/sheet/           The Google Sheet content layer: fetch, cache, parse.
  components/          Header (nav + drawer), Footer, Layout, HeroCarousel,
                       ImageSlot, Skeleton, Icons.
  pages/               One component + one stylesheet per route.
  routes.ts            Paths, nav labels and document titles, in one place.
```

### Header

The top panel carries a soft shadow that deepens once the page scrolls
(`.site-header.is-scrolled`). On desktop the nav has a single sliding highlight
— one absolutely-positioned `.site-nav__highlight` that measures the hovered
`<li>` against the live list and animates its `transform`/`width`, so adding a
nav item needs no other change. Below 1080px the nav collapses to a menu-icon
button and an **overlay** drawer (`Header.tsx`): it's `position: fixed` below the
header, fades its backdrop in, slides the panel down, and locks body scroll —
it never pushes the page content.

### Hero

`components/HeroCarousel.tsx` is a self-contained slide carousel: seamless
infinite loop (clone-based, snapped on a timeout so it can't strand),
self-re-arming autoplay that resets on any interaction and pauses on a hidden
tab, morphing dots (circle → amber bar), arrows, and touch/pointer swipe. Slides
live in `content/heroSlides.ts` — add one entry and the dots and looping follow.

### Styling

Three layers, loaded in this order:

- **`theme.css` — the tokens.** Amber-cream ground, deep forest green as the
  acting colour, sage as a secondary surface, terracotta rationed to small
  labels. Fraunces display + Figtree body. A 4px spacing scale and the radius
  scale below. This is the only file with raw hex values; retune the look here.
- **`base.css` — element defaults + component classes** (`.btn`, `.card`,
  `.tag`, `.input`, `.field` …), all built from the tokens.
- **`global.css` — layout primitives** (`.shell`, `.section`, `.band`,
  `.grid`, `.kicker`, `.panel` …). Page-specific rules live next to the page in
  `src/pages/*.css`.

Outside `theme.css`, nothing hard-codes a hex, a font name, a radius or a raw
spacing value — everything is a `var(--…)`.

#### Radius standard

A bigger box needs a bigger radius to look equally rounded, so the token is
picked by the element's **physical size**, not by what it is:

| Token | Value | Size bucket → used for |
| --- | --- | --- |
| `--radius-sm` | 1px | micro — badges, tags, chips |
| `--radius-md` | 3px | small — buttons, inputs, menu rows |
| `--radius-lg` | 5px | medium — cards, content blocks |
| `--radius-xl` | 8px | large — hero banners, modals, big panels |
| `--radius-full` | 999px | fully round — avatars, dots, pill counters |

Values are deliberately tiny — this design is near-square, not pill-shaped.
Never hard-code a px radius; always take a token.

**Nested concentricity.** When a rounded box wraps rounded children with padding
between them, the curves only stay parallel if `outer = inner + padding`. So a
container uses a `calc()`, not the next token up:

```css
border-radius: calc(var(--radius-lg) + var(--space-1));
```

That's `.panel` in `global.css` (child cards at `--radius-lg`, padding a
spacing step). Flush children — zero padding — share the parent's radius
exactly. The full rationale is commented at the top of `theme.css`.

### Content

Copy lives in two places, split by who changes it.

**In the repo**, `src/content/` — prose that only changes when the site does:

| File | Holds |
| --- | --- |
| `site.ts` | Address, phone, email, availability |
| `schedule.ts` | The day's rhythm and the weekly highlights |
| `values.ts` | The pedagogy (long form + front-page teasers) |
| `practical.ts` | The Praktisk page's *types*, and the derived headline strip |
| `faqs.ts` | The FAQ band's anchor and closing line |
| `photos.ts` | The photo registry, and the gallery's stock fallback |

**In the Google Sheet** — everything the caretaker keeps current herself. See
the next section.

### Content from the sheet

Six things are read out of one published Google Sheet tab at runtime: the
opening hours, the front page's wax seal, every card on the Praktisk page, the
"Godt at vide" notes, the FAQ list, and the gallery's photos. `REGNEARK.md` is
the caretaker's guide to it; `src/lib/sheet/parse.ts` is the grammar.

The tab is published to the web and read as CSV — no API key, no OAuth, no
backend. Which also means everything in that tab is public.

**Three layers, best last** (`lib/sheet/provider.tsx`):

1. `src/content/sheet-snapshot.csv`, compiled into the bundle. This is why the
   site has no loading state in practice: the first paint of a first-ever visit
   already has the real hours on it.
2. `localStorage` — what this browser saw last time.
3. The live sheet, fetched in the background and applied only if the bytes
   differ from what's already on screen (compared by hash; the export carries
   no usable ETag). An unchanged sheet causes no state update and no re-render.

**Every page load fetches**, unthrottled. Loading a page is someone asking for
the current state, and answering that out of a copy stored minutes ago makes
the site look broken to the one person most likely to be watching — whoever
just edited the sheet and reloaded to check. The five-minute throttle applies
only to the in-session re-check when a backgrounded tab is brought forward.
What remains is Google's own publishing lag, which is a few minutes and is not
ours to shorten.

**The safety property is in the parser.** A block the sheet doesn't mention
leaves that part of the site alone, so an empty tab, a half-written one, a
truncated response or a sign-in page all render the previous content instead of
blanking the page. A block that *is* present and empty is an instruction, and
the page shows its empty state — that is how "the holiday dates aren't settled
yet" is expressed.

Two blocks bend that rule, each for a stated reason (both documented where they
are made, in `parse.ts`):

- **The seal** is off unless a usable sheet says otherwise. It is an
  announcement rather than durable content, and a stale "Ledige pladser" left
  standing because a row was deleted by accident actively misleads. Emptying
  the month, deleting the row and deleting the whole block all hide it.
- **The gallery** ignores a block with no usable links, rather than reading it
  as "no photographs". An empty photo page is a broken photo page, and a block
  written before the links are pasted in is the likelier explanation.

`npm run sync:sheet` refreshes the committed snapshot; `prebuild` runs it with
`--soft`, which warns and continues on any failure. A stale snapshot costs a
few hundred milliseconds of staleness on one page load; a failed build costs a
deploy.

### Photos

Page imagery is **local** — files live in `src/assets/images/stock/`;
`src/assets/stock.ts` imports each one under a friendly name (so Vite
fingerprints and bundles them), and `src/content/photos.ts` /
`content/heroSlides.ts` reference those names.

The source photos were 6000px originals (~23 MB total); they were downscaled to
a 2000px cap and re-encoded (mozjpeg q78) to ~3 MB total. `sharp` is a
devDependency kept for re-running that if you add more.

To use a caretaker's own photography: replace a file in `stock/` (keep the
import name), or add a file, import it in `stock.ts`, and reference it. Any
registry entry whose `src` is `null` renders as a labelled placeholder — the two
"Portræt af Dorte" slots are left null on purpose, since no real photo of the
caretaker exists yet.

**The Galleri page is the exception**: it reads Drive share links from the
sheet, and `lib/sheet/drive.ts` turns each one into a set of renditions off
Google's image CDN (`lh3.googleusercontent.com/d/<id>=w<width>`). One ladder of
widths serves both the mosaic — which declares a quarter or half of the
viewport and takes a low rung — and the viewer, which declares 90vw and takes a
high one. So a phone is served a 480px re-encode of whatever came off the
caretaker's camera roll, and the same photograph is never downloaded twice.
`stockGallery` in `photos.ts` is what stands there until the sheet has links.

`ImageSlot` carries the arrival: a shimmer holds the frame until the photo
decodes, it fades up only if it wasn't already cached, and a failed load gets
one retry at Drive's other endpoint before the frame falls back to its
placeholder.

### Contact

There is no contact page or form: the footer is the contact section on every
page. The "Kontakt" links (header, hero, page CTAs) scroll to it via
`src/lib/scrollToContact.ts`, which targets the footer's `id="kontakt"`.

## Deploying

It's a client-routed SPA, so the host must serve `index.html` for unknown paths
— otherwise a hard refresh on `/praktisk` 404s. On Netlify that's a `_redirects`
with `/* /index.html 200`; on Vercel a rewrite; on nginx `try_files $uri
/index.html`.

## Known placeholders

Carried over from the prototype and still needing real values:

- Phone number (`00 00 00 00` in `src/content/site.ts`)
- Photos are stock stand-ins — replace with real photography of the place. The
  gallery's are now replaced from the Drive folder rather than from the repo
- Two "Portræt af Dorte" image slots are intentionally blank until a real
  caretaker photo exists
- The "Persondatapolitik" link in the footer goes nowhere yet

The holiday dates are no longer in this list: they are the caretaker's to set
in the sheet, and the card says so on its own until she does.

## Origin

The **structure** — routing, typed content, components — was built from the
Claude Design prototype *Bundsgård dagpleje prototype* (`Bundsgård.dc.html`).
Its conditional pages became routes, its `sc-for` lists became typed content
modules, and its canvas-only runtime (`<x-dc>`, `sc-if`/`sc-for`, the
`<image-slot>` web component, the Desktop/Mobile toggle) was dropped in favour
of real React and media queries.

The **look** — the amber-cream + forest-green + terracotta palette, the
Fraunces/Figtree pairing, and the near-square radius standard — comes from the
later "Website UI/UX for Daycare" design (a Figma Make export). Its Tailwind
theme was reworked into the plain-CSS token layer in `theme.css`; its shadcn/ui
component set was not used. Photography is local stock imagery (Pexels),
optimised and bundled from `src/assets/`.
