import { useState } from 'react';
import type { Lang } from './i18n';
import { Shell } from './ui/Shell';
import { Frame } from './ui/Frame';
import { BOOKS } from './data/books';
import { coverSpec, toPixels, validateConfig, type BookConfig, type Paper } from './lib/kdp';

const T = {
  en: {
    eyebrow: 'Case study / publishing engine', title: 'KDP publishing engine: config-driven books',
    lead: 'A book is a small config. The engine derives the spine, the full cover size and the checks from it.',
    book: 'Book config', titleL: 'Title', trim: 'Trim (in)', pages: 'Pages', paper: 'Paper', papers: { white: 'White', cream: 'Cream', premiumColor: 'Premium color' },
    out: 'Derived values', spine: 'Spine', cw: 'Cover width', ch: 'Cover height', px: 'Cover file at 300 dpi', ok: 'Config is valid', json: 'Config as data',
    formulas: 'Formulas', f1: 'spine = pages x inches per page (white 0.002252, cream 0.0025, premium color 0.002347)', f2: 'cover width = bleed + trim width + spine + trim width + bleed', f3: 'cover height = bleed + trim height + bleed (bleed 0.125 in)',
    src: 'Source: KDP help, "Create a paperback cover", consulted 2026-10-13.', samples: 'Sample interior pages (reduced to 800 px, no metadata)', alt: 'Black and white coloring page',
  },
  es: {
    eyebrow: 'Caso de estudio / motor de publicación', title: 'Motor de publicación KDP: libros por configuración',
    lead: 'Un libro es una configuración pequeña. El motor deriva el lomo, el tamaño de la portada completa y las validaciones.',
    book: 'Configuración del libro', titleL: 'Título', trim: 'Corte (in)', pages: 'Páginas', paper: 'Papel', papers: { white: 'Blanco', cream: 'Crema', premiumColor: 'Color premium' },
    out: 'Valores derivados', spine: 'Lomo', cw: 'Ancho de portada', ch: 'Alto de portada', px: 'Archivo de portada a 300 dpi', ok: 'La configuración es válida', json: 'Configuración como datos',
    formulas: 'Fórmulas', f1: 'lomo = páginas x pulgadas por página (blanco 0.002252, crema 0.0025, color premium 0.002347)', f2: 'ancho de portada = sangrado + ancho de corte + lomo + ancho de corte + sangrado', f3: 'alto de portada = sangrado + alto de corte + sangrado (sangrado 0.125 in)',
    src: 'Fuente: ayuda de KDP, "Create a paperback cover", consultada el 2026-10-13.', samples: 'Páginas interiores de muestra (reducidas a 800 px, sin metadatos)', alt: 'Página para colorear en blanco y negro',
  },
};

const f = (n: number, d = 4) => n.toFixed(d);

export function Demo({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [book, setBook] = useState<BookConfig>(BOOKS[0]);
  const issues = validateConfig(book);
  const spec = coverSpec(book);
  const base = import.meta.env.BASE_URL;

  return (
    <Shell lang={lang} eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
      <Frame tl="CONFIG">
        <h2>{t.book}</h2>
        <div className="row" style={{ marginBottom: 'var(--s-3)' }}>
          {BOOKS.map((b) => <button key={b.id} className="toggle" aria-pressed={book.id === b.id} onClick={() => setBook(b)}>{b.id}</button>)}
        </div>
        <div className="row">
          <label>{t.titleL}<input value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} /></label>
          <label>{t.trim} W<input type="number" step={0.25} min={1} value={book.trim.w} onChange={(e) => setBook({ ...book, trim: { ...book.trim, w: Number(e.target.value) } })} style={{ width: '6rem' }} /></label>
          <label>{t.trim} H<input type="number" step={0.25} min={1} value={book.trim.h} onChange={(e) => setBook({ ...book, trim: { ...book.trim, h: Number(e.target.value) } })} style={{ width: '6rem' }} /></label>
          <label>{t.pages}<input type="number" min={1} value={book.pages} onChange={(e) => setBook({ ...book, pages: Number(e.target.value) })} style={{ width: '6rem' }} /></label>
          <label>{t.paper}
            <select value={book.paper} onChange={(e) => setBook({ ...book, paper: e.target.value as Paper })}>
              {(Object.keys(t.papers) as Paper[]).map((p) => <option key={p} value={p}>{t.papers[p]}</option>)}
            </select>
          </label>
        </div>
        <p role="status" className="note" style={{ marginTop: 'var(--s-3)' }}>{issues.length === 0 ? t.ok : issues.map((i) => i.message).join('; ')}</p>
        <pre>{JSON.stringify(book, null, 2)}</pre>
      </Frame>

      <Frame tl="DERIVED">
        <h2>{t.out}</h2>
        <div className="grid">
          <div className="card"><div className="num" data-testid="spine">{f(spec.spine)}</div><div className="label">{t.spine} (in)</div></div>
          <div className="card"><div className="num" data-testid="cw">{f(spec.width)}</div><div className="label">{t.cw} (in)</div></div>
          <div className="card"><div className="num" data-testid="ch">{f(spec.height, 3)}</div><div className="label">{t.ch} (in)</div></div>
          <div className="card"><div className="num" style={{ fontSize: '1.6rem' }}>{toPixels(spec.width)} x {toPixels(spec.height)}</div><div className="label">{t.px}</div></div>
        </div>
        <h3 style={{ marginTop: 'var(--s-4)' }}>{t.formulas}</h3>
        <ul><li>{t.f1}</li><li>{t.f2}</li><li>{t.f3}</li></ul>
        <p className="note">{t.src}</p>
      </Frame>

      <Frame tl="SAMPLES">
        <h2>{t.samples}</h2>
        <div className="grid">
          {[1, 2, 3].map((n) => <img key={n} src={`${base}samples/sample-${n}.png`} alt={t.alt} loading="lazy" width={800} height={1035} style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: 4 }} />)}
        </div>
      </Frame>
    </Shell>
  );
}
