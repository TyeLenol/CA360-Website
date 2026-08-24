import { ArrowRight } from '../shared/Icons';

const CHAPTERS = [
  { label: 'Understand the why', href: '#mission' },
  { label: 'See how it works', href: '#programs' },
  { label: 'Meet the people', href: '#mentors' },
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
          <a key={chapter.label} className="chapter-bridge-link" href={chapter.href}>
            <span>{chapter.label}</span>
            <ArrowRight size={14} color="#d68307" />
          </a>
        ))}
      </div>
    </section>
  );
}
