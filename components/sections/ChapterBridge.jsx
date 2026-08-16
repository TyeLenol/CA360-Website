import { ArrowRight } from '../shared/Icons';

const CHAPTERS = [
  { index: '01', label: 'Understand the why', href: '#mission' },
  { index: '02', label: 'See how it works', href: '#programs' },
  { index: '03', label: 'Meet the people', href: '#mentors' },
];

export function ChapterBridge() {
  return (
    <section className="chapter-bridge" aria-label="Choose where to explore next">
      <div className="chapter-bridge-head">
        <span className="chapter-bridge-kicker">KEEP EXPLORING</span>
        <p>Start with the part of CA360 that feels most like you.</p>
      </div>
      <div className="chapter-bridge-links">
        {CHAPTERS.map((chapter) => (
          <a key={chapter.index} className="chapter-bridge-link" href={chapter.href}>
            <span className="chapter-bridge-index">{chapter.index}</span>
            <span>{chapter.label}</span>
            <ArrowRight size={14} color="#d68307" />
          </a>
        ))}
      </div>
    </section>
  );
}
