import { useEffect, useMemo, useState } from 'react';
import { EditorView } from '@codemirror/view';

interface Heading {
  level: number;
  text: string;
  pos: number;
}

// Extract ATX headings (# … ######), skipping frontmatter and fenced code blocks.
export function extractHeadings(src: string): Heading[] {
  const out: Heading[] = [];
  const fm = src.match(/^---\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/);
  let pos = 0;
  let fence: string | null = null;
  const lines = src.split('\n');
  const fmEnd = fm ? fm[0].length : 0;
  for (const raw of lines) {
    const lineStart = pos;
    pos += raw.length + 1;
    if (lineStart < fmEnd) continue;
    const line = raw.replace(/\r$/, '');
    const f = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;
    const m = line.match(/^ {0,3}(#{1,6})[ \t]+(.*?)[ \t]*$/);
    if (!m) continue;
    const text = m[2]
      .replace(/[ \t]+#+$/, '')
      .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
      .replace(/[*_`~=]/g, '')
      .trim();
    if (text) out.push({ level: m[1].length, text, pos: lineStart });
  }
  return out;
}

const SCROLL_OFFSET = 12;

export default function DocOutline({ view, content }: { view: EditorView | null; content: string }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [active, setActive] = useState(-1);
  const minLevel = useMemo(() => headings.reduce((m, h) => Math.min(m, h.level), 6), [headings]);

  // Track the section at the top of the viewport.
  useEffect(() => {
    if (!view || headings.length === 0) return;
    const scroller = view.scrollDOM;
    const update = () => {
      const y = scroller.getBoundingClientRect().top + SCROLL_OFFSET + 8 - view.documentTop;
      const top = view.lineBlockAtHeight(y).from;
      let idx = -1;
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].pos <= top) idx = i;
        else break;
      }
      setActive(idx);
    };
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    return () => scroller.removeEventListener('scroll', update);
  }, [view, headings]);

  if (!view || headings.length === 0) return null;

  const go = (h: Heading) => {
    const pos = Math.min(h.pos, view.state.doc.length);
    // Use CodeMirror's own scroll effect rather than a one-shot scrollTo(lineBlockAt().top):
    // lines far from the viewport only have ESTIMATED heights until they are rendered, so a
    // computed offset undershoots in long notes, and a smooth-scroll animation toward it is
    // cancelled when CodeMirror re-measures and adjusts scrollTop (it stalled thousands of px
    // short of the heading). scrollIntoView re-measures as it goes; a second pass settles
    // whatever remains after the first measure.
    const jump = () => view.dispatch({ effects: EditorView.scrollIntoView(pos, { y: 'start', yMargin: SCROLL_OFFSET }) });
    jump();
    window.setTimeout(jump, 150);
  };

  return (
    <nav className="doc-outline" aria-label="Document outline">
      <ul className="doc-outline-markers">
        {headings.map((h, i) => (
          <li key={`${i}-${h.pos}`}>
            <button
              type="button"
              className={'doc-outline-marker' + (i === active ? ' active' : '')}
              style={{ width: Math.max(8, 22 - (h.level - minLevel) * 4) }}
              onClick={() => go(h)}
              aria-label={h.text}
            />
          </li>
        ))}
      </ul>
      <ul className="doc-outline-panel">
        {headings.map((h, i) => (
          <li key={`${i}-${h.pos}`}>
            <button
              type="button"
              className={'doc-outline-item' + (i === active ? ' active' : '')}
              style={{ paddingLeft: 10 + (h.level - minLevel) * 12 }}
              onClick={() => go(h)}
              title={h.text}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
