import { render, screen } from '@testing-library/react';
import { BOOKS } from '../data/books';
import { coverHeight, coverSpec, coverWidth, spine, toPixels, validateConfig } from '../lib/kdp';
import { Demo } from '../Demo';

test('spine(34) ~ 0.0766 (+-0.0001)', () => {
  expect(Math.abs(spine(34) - 0.0766)).toBeLessThanOrEqual(0.0001);
});

test('ancho y alto de portada', () => {
  // 8.5 x 11, 34 pages: 0.25 + 17 + 0.076568
  expect(coverWidth(8.5, 34)).toBeCloseTo(17.326568, 6);
  expect(coverHeight(11)).toBe(11.25);
  expect(toPixels(coverHeight(11))).toBe(3375);
});

test('el papel crema y el color premium usan su propio factor', () => {
  expect(spine(100, 'cream')).toBeCloseTo(0.25, 6);
  expect(spine(100, 'premiumColor')).toBeCloseTo(0.2347, 6);
});

test('validacion de paginas', () => {
  expect(validateConfig(BOOKS[0])).toEqual([]);
  expect(validateConfig({ ...BOOKS[0], pages: 10 })).toHaveLength(1);
  expect(validateConfig({ ...BOOKS[0], pages: 30.5 })).toHaveLength(1);
  expect(coverSpec(BOOKS[2]).height).toBe(9.25);
});

test('la interfaz muestra los valores derivados', () => {
  render(<Demo lang="en" />);
  expect(screen.getByTestId('spine')).toHaveTextContent('0.0766');
  expect(screen.getByTestId('cw')).toHaveTextContent('17.3266');
  expect(screen.getAllByRole('img')).toHaveLength(3);
});
