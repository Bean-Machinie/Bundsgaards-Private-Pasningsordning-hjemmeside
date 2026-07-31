import { Fragment, type ReactNode } from 'react';

/**
 * A line of text from the sheet, with its links made clickable.
 *
 * A cell can't carry a real hyperlink: Google's CSV export is plain text, so
 * the link a caretaker inserts with Ctrl+K arrives here as the words alone,
 * silently stripped. The address therefore has to be *typed*, and the shape
 * chosen is the one most people have seen before:
 *
 *     Tilskuddet søges hos [Egedal Kommune](https://www.egedalkommune.dk).
 *
 * A bare address on its own line works too, so pasting one and moving on is
 * never wrong — it just reads as the address rather than as words.
 *
 * Anything that isn't a plain web, mail or telephone address renders as the
 * text that was typed, exactly as written. That is the same rule the rest of
 * the sheet layer follows — a mistake in a cell shows up as a mistake on the
 * page, never as something broken and never as something dangerous. It is also
 * what keeps a `javascript:` address, which a public spreadsheet could
 * otherwise carry onto the page, from ever becoming a link.
 */

/** `[ord](adresse)`, or an address standing on its own. The bare form stops at
 *  a closing bracket so it can never eat into the written form beside it. */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)|(\bhttps?:\/\/[^\s<>()[\]]+|\bwww\.[^\s<>()[\]]+)/g;

/** The schemes a link is allowed to use. Everything else is not a link. */
const ALLOWED = /^(https?:\/\/|mailto:|tel:)/i;

/** Punctuation that ends the sentence rather than the address. */
const TRAILING = /[.,;:!?]+$/;

function toHref(raw: string): string | null {
  const address = raw.trim();
  if (ALLOWED.test(address)) return address;
  // Typed without a scheme, as people write addresses down.
  if (/^www\./i.test(address)) return `https://${address}`;
  return null;
}

export default function SheetText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let cursor = 0;

  // Fresh instance: the pattern is global, so a shared one would carry its
  // position between renders and start reading each string partway through.
  const pattern = new RegExp(LINK.source, 'g');
  let match = pattern.exec(text);

  while (match !== null) {
    const [whole, label, written, bare] = match;
    if (match.index > cursor) out.push(text.slice(cursor, match.index));

    // A full stop after a pasted address belongs to the sentence, not to the
    // address — linking it would send visitors to a page that doesn't exist.
    const trailing = bare ? (TRAILING.exec(bare)?.[0] ?? '') : '';
    const address = bare ? bare.slice(0, bare.length - trailing.length) : written;
    const href = toHref(address);

    if (href) {
      out.push(
        <a
          href={href}
          /* A page opens in its own tab, so following a link to the
             municipality doesn't cost a family their place here. A mail or
             phone address hands off to another app and never navigates, so
             sending it to a new tab would only strand an empty one. */
          {...(/^https?:/i.test(href)
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {label ?? address}
        </a>,
      );
      if (trailing) out.push(trailing);
    } else {
      out.push(whole);
    }

    cursor = match.index + whole.length;
    match = pattern.exec(text);
  }

  if (cursor < text.length) out.push(text.slice(cursor));

  // A string with no links in it is the common case and stays a plain string.
  if (out.length === 1 && typeof out[0] === 'string') return <>{out[0]}</>;
  return (
    <>
      {out.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}
