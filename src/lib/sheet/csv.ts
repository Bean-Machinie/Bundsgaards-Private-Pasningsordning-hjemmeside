/**
 * A CSV reader, to RFC 4180.
 *
 * Google's published-sheet export is real CSV: a cell containing a comma, a
 * quote or a line break comes back quoted, and a quote inside a quoted cell is
 * doubled. Splitting on commas would therefore tear a footnote in half the
 * first time someone writes one with a comma in it — which is the first thing
 * anyone writes. Hence a proper scanner rather than `text.split(',')`.
 *
 * Deliberately not a dependency: the whole grammar is the twenty lines below,
 * and the site ships no third-party runtime code it doesn't have to.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  /* Google prefixes the export with a UTF-8 BOM. Left in place it would glue
     itself to the first cell, so the very first section header would never
     match its name. */
  let i = text.charCodeAt(0) === 0xfeff ? 1 : 0;

  const endField = () => {
    row.push(field);
    field = '';
  };
  const endRow = () => {
    endField();
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const ch = text[i];

    if (quoted) {
      if (ch === '"') {
        // A doubled quote is one literal quote; a lone one closes the cell.
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      // Commas and newlines are ordinary characters inside quotes.
      field += ch;
      i += 1;
      continue;
    }

    // Only a quote at the very start of a cell opens a quoted run; anywhere
    // else it is someone's inch mark and stays as typed.
    if (ch === '"' && field === '') {
      quoted = true;
      i += 1;
      continue;
    }
    if (ch === ',') {
      endField();
      i += 1;
      continue;
    }
    if (ch === '\n') {
      endRow();
      i += 1;
      continue;
    }
    // Bare CR only ever shows up as the first half of a CRLF here.
    if (ch === '\r') {
      i += 1;
      continue;
    }

    field += ch;
    i += 1;
  }

  // A trailing newline ends the last row rather than starting an empty one.
  if (field !== '' || row.length > 0) endRow();

  return rows;
}

/** Cell at `index`, trimmed, or '' — reading past a short row is normal here:
 *  Google truncates trailing empty cells, so a two-column row is two cells. */
export function cell(row: string[], index: number): string {
  return (row[index] ?? '').trim();
}

/**
 * A comparison key for text the caretaker types.
 *
 * Section and field names are matched against this, so `Åbningstider`,
 * `ÅBNINGSTIDER` and `Abningstider ` are all the same name — the sheet must
 * never break because a capital or an accent was missed. Danish æ/ø don't
 * decompose under NFD, so they are folded by hand; å does (a + ring).
 */
export function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/\s+/g, ' ')
    .trim();
}
