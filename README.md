# Bundsgård — privat pasningsordning

Website for Bundsgård, a private childcare arrangement (privatpasningsordning)
in Stenløse. React + TypeScript + Vite, plain CSS.

The site is in Danish; so is all page copy in `src/content/`. Code, comments and
this README are in English.

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run build` | Typecheck (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Types only, no build |

## Where things live

```
src/
  styles/theme.css     Design tokens — palette, type, spacing, radius scale.
  styles/base.css      Element defaults + component classes (.btn/.card/.tag…).
  styles/global.css    App layer — layout primitives built on those tokens.
  assets/              Local images; stock.ts names each photo (see Photos).
  content/             All copy and data, typed. Edit text here, not in JSX.
  components/          Header (nav + drawer), Footer, Layout, HeroCarousel,
                       ImageSlot, Icons.
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

Everything a non-developer would want to change is in `src/content/`:

| File | Holds |
| --- | --- |
| `site.ts` | Address, phone, email, opening hours, current availability |
| `schedule.ts` | The day's rhythm and the weekly highlights |
| `values.ts` | The pedagogy (long form + front-page teasers) |
| `practical.ts` | Opening hours, holidays, price, FAQ-adjacent notes |
| `faqs.ts` | Ofte stillede spørgsmål |
| `photos.ts` | The photo registry — see below |

### Photos

All imagery is **local** — no external image hosts. Files live in
`src/assets/images/stock/`; `src/assets/stock.ts` imports each one under a
friendly name (so Vite fingerprints and bundles them), and
`src/content/photos.ts` / `content/heroSlides.ts` reference those names.

The source photos were 6000px originals (~23 MB total); they were downscaled to
a 2000px cap and re-encoded (mozjpeg q78) to ~3 MB total. `sharp` is a
devDependency kept for re-running that if you add more.

To use a caretaker's own photography: replace a file in `stock/` (keep the
import name), or add a file, import it in `stock.ts`, and reference it. Any
registry entry whose `src` is `null` renders as a labelled placeholder — the two
"Portræt af Dorte" slots are left null on purpose, since no real photo of the
caretaker exists yet.

Photos are stock imagery of children outdoors, standing in until real
photography of the place is taken.

### The contact form

`src/lib/enquiry.ts` posts the enquiry as JSON to `VITE_CONTACT_ENDPOINT`.

**Until that variable is set, nothing is delivered** — the form logs to the
console and shows the thank-you state, so the flow is testable in development.
Point it at a form service or your own function to go live:

```
# .env.local
VITE_CONTACT_ENDPOINT=https://…
```

## Deploying

It's a client-routed SPA, so the host must serve `index.html` for unknown paths
— otherwise a hard refresh on `/praktisk` 404s. On Netlify that's a `_redirects`
with `/* /index.html 200`; on Vercel a rewrite; on nginx `try_files $uri
/index.html`.

## Known placeholders

Carried over from the prototype and still needing real values:

- Phone number (`00 00 00 00` in `src/content/site.ts`)
- Holiday dates in `src/content/practical.ts`
- Photos are stock stand-ins — replace with real photography of the place
- Two "Portræt af Dorte" image slots are intentionally blank until a real
  caretaker photo exists
- The "Persondatapolitik" link in the footer goes nowhere yet

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
