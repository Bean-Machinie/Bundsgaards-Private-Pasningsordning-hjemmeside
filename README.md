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
  styles/organic.css   Design system — tokens + component classes. Vendored.
  styles/global.css    App layer — layout primitives built on those tokens.
  content/             All copy and data, typed. Edit text here, not in JSX.
  components/          Header, Footer, Layout, ImageSlot, Icons.
  pages/               One component + one stylesheet per route.
  routes.ts            Paths, nav labels and document titles, in one place.
```

### Styling

Two layers, and the distinction matters:

- **`organic.css` is vendored** from the Claude Design project this site was
  built from. It owns every colour, font, radius, shadow and spacing step, plus
  the `.btn` / `.card` / `.tag` / `.input` component classes. Retune the design
  by editing the tokens at the top of that file — don't fork its classes.
- **`global.css` is ours.** Layout primitives (`.shell`, `.section`, `.band`,
  `.grid`, `.kicker`, `.panel` …) composed from those tokens, and shared across
  pages. Page-specific rules live next to the page in `src/pages/*.css`.

No component hard-codes a hex, a font name or a raw spacing value. If something
needs a colour, it comes from a `var(--color-*)`.

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

The design ships with empty image slots. `src/content/photos.ts` names every one
and describes the picture that belongs there. To fill a slot:

1. Drop the file in `public/images/`.
2. Set `src: '/images/<file>.jpg'` and write a real `alt` on that entry.

Until then `<ImageSlot>` renders a labelled placeholder showing the brief, so an
unfinished page still reads as intentional. Real photos get the design system's
`.washed` treatment automatically.

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
- Every photo
- The "Persondatapolitik" link in the footer goes nowhere yet

## Origin

Built from the Claude Design prototype *Bundsgård dagpleje prototype*
(`Bundsgård.dc.html`) using the **Organic** design system. The prototype's
runtime — `<x-dc>`, `sc-if` / `sc-for`, the `<image-slot>` web component, the
Desktop/Mobile preview toggle — was a canvas-only harness and is not part of
this codebase. Its conditional pages became routes, its `sc-for` lists became
typed content modules, its inline styles became the CSS layers above, and the
fixed 412px "mobile" shell became real media queries.
