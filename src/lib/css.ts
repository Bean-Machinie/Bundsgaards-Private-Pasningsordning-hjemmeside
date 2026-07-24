import type { CSSProperties } from 'react';

/**
 * `style` that may also carry CSS custom properties. React writes unknown
 * `--*` keys straight through, but CSSProperties has no index signature, so
 * they need to be declared.
 */
export type StyleWithVars = CSSProperties & Record<`--${string}`, string>;

/** Tunes the column floor of the shared `.grid` primitive. */
export const gridMin = (min: string): StyleWithVars => ({ '--min': min });

/** Tunes the gap of `.grid`, `.stack` or `.row`. */
export const gap = (value: string): StyleWithVars => ({ '--gap': value });
