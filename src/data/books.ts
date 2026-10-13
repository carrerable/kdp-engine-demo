import type { BookConfig } from '../lib/kdp';

// Fictional book configs: the engine builds every book from data like this.
export const BOOKS: BookConfig[] = [
  { id: 'cozy-01', title: 'Cozy Corners Vol. 1', trim: { w: 8.5, h: 11 }, pages: 34, paper: 'white', theme: 'coffee shops' },
  { id: 'cozy-02', title: 'Cozy Corners Vol. 2', trim: { w: 8.5, h: 11 }, pages: 54, paper: 'cream', theme: 'autumn havens' },
  { id: 'mini-01', title: 'Pocket Garden', trim: { w: 6, h: 9 }, pages: 104, paper: 'white', theme: 'greenhouse nooks' },
];
