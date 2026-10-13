export type Paper = 'white' | 'cream' | 'premiumColor';

/** Inches of spine per page. Source: KDP help "Create a paperback cover", consulted 2026-10-13. */
export const SPINE_PER_PAGE: Record<Paper, number> = { white: 0.002252, cream: 0.0025, premiumColor: 0.002347 };
export const BLEED = 0.125;
export const MIN_PAGES = 24;
export const MAX_PAGES = 828; // black ink on white paper

export const spine = (pages: number, paper: Paper = 'white'): number => pages * SPINE_PER_PAGE[paper];

/** Bleed + back cover + spine + front cover + bleed. */
export const coverWidth = (trimW: number, pages: number, paper: Paper = 'white'): number => BLEED * 2 + trimW * 2 + spine(pages, paper);

/** Bleed + trim height + bleed. */
export const coverHeight = (trimH: number): number => trimH + BLEED * 2;

export interface BookConfig {
  id: string;
  title: string;
  trim: { w: number; h: number };
  pages: number;
  paper: Paper;
  theme: string;
}

export interface Issue { field: 'pages' | 'trim'; message: string }

export function validateConfig(c: BookConfig): Issue[] {
  const issues: Issue[] = [];
  if (!Number.isInteger(c.pages) || c.pages < MIN_PAGES || c.pages > MAX_PAGES) issues.push({ field: 'pages', message: `pages must be an integer between ${MIN_PAGES} and ${MAX_PAGES}` });
  if (c.trim.w <= 0 || c.trim.h <= 0) issues.push({ field: 'trim', message: 'trim must be positive' });
  return issues;
}

export interface CoverSpec { spine: number; width: number; height: number }
export function coverSpec(c: BookConfig): CoverSpec {
  return { spine: spine(c.pages, c.paper), width: coverWidth(c.trim.w, c.pages, c.paper), height: coverHeight(c.trim.h) };
}

/** Pixels at 300 dpi for the full cover file. */
export const toPixels = (inches: number, dpi = 300): number => Math.round(inches * dpi);
