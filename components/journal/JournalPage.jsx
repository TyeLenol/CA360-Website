"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown, PinIcon } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { useScrollProgress } from '../../hooks/ui-hooks';

/* ===== LOCAL HOOK — element-relative scroll progress ===== */
function useElementScroll(ref) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const wh = window.innerHeight;
        const center = r.top + r.height / 2;
        const offset = (wh / 2 - center) / wh;
        setV(Math.max(-1.5, Math.min(1.5, offset)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return v;
}

/* ===== DATA ===== */
const ARTICLES = [
  { id: 'a1', featured: true, cat: 'mentor', catLabel: 'MENTOR STORY',
    title: 'The white coat, unmasked: a year inside the ward.',
    excerpt: 'Three house officers walked our biggest cohort yet through their first 12 months on the ward — the wins, the burnout, and the moments they almost quit. Plus the seven questions that broke the room.',
    author: 'Dr. A. Asare', authorSeed: 1, date: 'FEB 28, 2026', readTime: '8 min read',
    venue: 'University of Ghana Medical School · Korle Bu', tone: 'teal', label: 'INTERVIEW · KORLE BU' },
  { id: 'a2', cat: 'essay', catLabel: 'FOUNDER ESSAY',
    title: 'A letter to the SHS-3 girl I was.',
    excerpt: "On picking medicine by elimination, the older sister I didn't have, and the kind of advice I would have actually heard at 17.",
    author: 'Dr. A. Asare', authorSeed: 1, date: 'FEB 14, 2026', readTime: '5 min',
    tone: 'warm', label: 'ESSAY' },
  { id: 'a3', cat: 'news', catLabel: 'NEWS',
    title: 'Why we delayed the Law track — and what that taught us.',
    excerpt: "We almost shipped a Law cohort before we had the mentors to back it up. Here's why we pulled the plug, and the rule we made afterwards.",
    author: 'CA360 Team', authorSeed: 7, date: 'JAN 30, 2026', readTime: '3 min',
    tone: 'orange', label: 'INTERNAL' },
  { id: 'a4', cat: 'student', catLabel: 'STUDENT STORY',
    title: 'How Akua got into UG Law without a debate coach.',
    excerpt: 'Six rejections, one acceptance, and a lot of YouTube debate replays. A first-person account from one of our SHS alumni.',
    author: 'Akua Boateng', authorSeed: 3, date: 'JAN 18, 2026', readTime: '6 min',
    tone: 'deep', label: 'CLASS OF 2025' },
  { id: 'a5', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'The four books Dr. Mensah wishes someone gave him at 17.',
    excerpt: 'Two on study, one on bedside manner, one that has nothing to do with medicine. With links and a one-paragraph reason.',
    author: 'Dr. K. Mensah', authorSeed: 2, date: 'JAN 09, 2026', readTime: '4 min',
    tone: 'cream', label: 'READING LIST' },
  { id: 'a6', cat: 'spotlight', catLabel: 'FIELD SPOTLIGHT',
    title: 'Medicine, by the numbers: who actually gets in?',
    excerpt: "A look at admissions data across UGMS, KNUST and UCC over the last five intake cycles — and what it means for next year's applicants.",
    author: 'CA360 Research', authorSeed: 4, date: 'DEC 21, 2025', readTime: '9 min',
    tone: 'teal', label: 'DATA · ANNUAL' },
  { id: 'a7', cat: 'mentor', catLabel: 'MENTOR STORY',
    title: "Three mentors on the rejection they almost didn't recover from.",
    excerpt: "A residency that almost wasn't. A law school no. A grad scheme that came down to one phone call. Three stories, three reframes.",
    author: 'Esi Adjei', authorSeed: 6, date: 'DEC 12, 2025', readTime: '7 min',
    tone: 'warm', label: 'INTERVIEWS · 03' },
  { id: 'a8', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'How to read a textbook without falling asleep.',
    excerpt: 'Active recall, spaced practice, and the one technique that took my retention from 30% to 80% in a term. Tested, not theorised.',
    author: 'Dr. A. Asare', authorSeed: 1, date: 'NOV 28, 2025', readTime: '6 min',
    tone: 'orange', label: 'STUDY TECHNIQUE' },
];

const CATEGORIES = [
  { id: 'all',       label: 'All articles' },
  { id: 'student',   label: 'Student stories' },
  { id: 'mentor',    label: 'Mentor stories' },
  { id: 'guide',     label: 'Career guides' },
  { id: 'spotlight', label: 'Field spotlights' },
  { id: 'essay',     label: 'Founder essays' },
  { id: 'news',      label: 'News' },
];

/* ===== JOURNAL HERO ===== */
function JournalHero() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);

  const jump = (e) => {
    e.preventDefault();
    document.getElementById('journal-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const arrive = (lo, hi, dy = 44) => {
    const p = Math.max(0, Math.min(1, (prog - lo) / (hi - lo)));
    return {
      opacity: p,
      transform: `translate3d(0, ${((1 - p) * dy).toFixed(1)}px, 0)`,
      willChange: 'opacity, transform',
    };
  };

  return (
    <section className="jh-hero" id="journal-top" ref={ref}>
      <div className="jh-hero-sticky">
        <div className="jh-hero-top">
          <div className="sec-eyebrow" data-reveal>The blog</div>
          <div className="jh-hero-side" data-reveal data-reveal-delay="1">
            A quarterly on mentorship,<br />
            <em>careers, and the life after SHS.</em>
          </div>
        </div>

        {/* Title visible immediately on load — CSS animation, not scroll-gated */}
        <div className="jh-hero-title-wrap">
          <h1 className="jh-hero-title">
            The <em>Blog</em>.
          </h1>
        </div>

        {/* Metric + statement in one pinned block — they can never overlap each other or the title */}
        <div className="jh-hero-lower">
          <div className="jh-hero-metric" style={arrive(0.30, 0.64, 60)}>
            <div className="jh-hero-metric-label">PUBLISHED</div>
            <div className="jh-hero-metric-num">{ARTICLES.length}</div>
            <div className="jh-hero-metric-suf">articles</div>
          </div>

          <div className="jh-hero-statement-row" style={arrive(0.66, 0.90, 36)}>
            <p className="jh-hero-statement">
              At the core of Career Arcadia 360 lies an unwavering commitment to
              <em> honest mentorship</em>, lived experience, and the questions
              nobody answered for us.
            </p>
            <a className="jh-hero-anchor" href="#journal-grid" onClick={jump}>
              <span>READ ARTICLES</span>
              <span className="jh-hero-anchor-arrow"><ArrowDown color="#fff" size={14} /></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== FEATURED SIGNPOST — editorial chapter opener ===== */
function JournalSignpost() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);

  const arrive = (lo, hi, dy = 52) => {
    const p = Math.max(0, Math.min(1, (prog - lo) / (hi - lo)));
    return {
      opacity: p,
      transform: `translate3d(0, ${((1 - p) * dy).toFixed(1)}px, 0)`,
      willChange: 'opacity, transform',
    };
  };

  return (
    <section className="jfsign" ref={ref}>
      <div className="jfsign-sticky">
        <div className="jfsign-eyebrow" data-reveal>
          01 — UP NEXT
        </div>
        <div className="jfsign-line1" style={arrive(0.10, 0.34, 62)}>
          SEE OUR
        </div>
        <div className="jfsign-line2" style={arrive(0.30, 0.56, 72)}>
          Featured
        </div>
        <div className="jfsign-line3" style={arrive(0.52, 0.76, 64)}>
          Article.
          <span className="jfsign-arrow" aria-hidden="true">↓</span>
        </div>
      </div>
    </section>
  );
}

/* ===== FEATURED ARTICLE ===== */
function JournalFeatured({ article }) {
  const secRef = useRef(null);
  const prog = useScrollProgress(secRef);
  const scroll = useElementScroll(secRef);
  const imgY = scroll * -70;

  const arrive = (lo, hi, dy = 40) => {
    const p = Math.max(0, Math.min(1, (prog - lo) / (hi - lo)));
    return { opacity: p, transform: `translate3d(0, ${((1 - p) * dy).toFixed(1)}px, 0)`, willChange: 'opacity, transform' };
  };

  return (
    <section className="jf-sec" ref={secRef}>
      <div className="jf-sticky">
        <div className="jf-eyebrow" data-reveal>
          <span className="jf-eyebrow-mark">★</span>
          Featured · This issue
          <span className="jf-eyebrow-rule" />
        </div>
        <article className="jf-card">
          {/* Image arrives first */}
          <div className="jf-img" style={arrive(0.04, 0.26, 70)}>
            <div className="jf-img-inner" style={{ transform: `translate3d(0, ${imgY.toFixed(1)}px, 0)` }}>
              <PhotoPlaceholder tone={article.tone} label={article.label} style={{ width: '100%', height: '100%' }} />
            </div>
            <span className="jf-img-cat">{article.catLabel}</span>
            <span className="jf-img-corner" aria-hidden="true">
              <svg viewBox="0 0 60 60" width="60" height="60">
                <circle cx="30" cy="30" r="28" fill="none" stroke="#fff" strokeWidth="1" opacity="0.55" />
                <text x="30" y="14" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="JetBrains Mono" letterSpacing="0.2em">
                  THE JOURNAL · CA360 · THE JOURNAL · CA360 ·
                </text>
                <text x="30" y="34" textAnchor="middle" fontSize="14" fill="#fff" fontFamily="Fraunces" fontStyle="italic">06</text>
              </svg>
            </span>
          </div>

          {/* Text body — meta + title then blurb then rest */}
          <div className="jf-body">
            <div className="jf-meta" style={arrive(0.26, 0.44, 28)}>
              <span>{article.date}</span>
              <span className="dot" />
              <span>{article.readTime}</span>
              <span className="dot" />
              <span>{article.author.toUpperCase()}</span>
            </div>
            <h2 className="jf-title" style={arrive(0.38, 0.58, 44)}>{article.title}</h2>
            <p className="jf-excerpt" style={arrive(0.54, 0.72, 32)}>{article.excerpt}</p>

            {article.venue && (
              <div className="jf-venue" style={arrive(0.64, 0.80, 24)}>
                <PinIcon size={14} color="#d68307" />
                Hosted at <span>{article.venue}</span>
              </div>
            )}

            <div className="jf-foot" style={arrive(0.74, 0.90, 22)}>
              <div className="jf-author">
                <div className="jf-author-avatar">
                  <PhotoPlaceholder tone="warm" label="" style={{ width: '100%', height: '100%' }}>
                    <Portrait seed={article.authorSeed} bg="transparent" tone="#d68307" />
                  </PhotoPlaceholder>
                </div>
                <div>
                  <div className="jf-author-name">{article.author}</div>
                  <div className="jf-author-role">Founder · Medicine</div>
                </div>
              </div>
              <a className="jf-cta">
                Read the recap
                <span className="jf-cta-arrow"><ArrowRight color="#fff" size={16} /></span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ===== SCROLL CUE — text-based transition to blog grid ===== */
function JournalScrollCue() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const [coverAlpha, setCoverAlpha] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      // Grid covers text center when grid top reaches viewport center.
      // rect.bottom is section bottom in viewport coords → add scrollY = section doc bottom.
      // Subtract half viewport to get the scroll position where grid top = screen center.
      const rect = el.getBoundingClientRect();
      const coverAt = window.scrollY + rect.bottom - window.innerHeight * 0.5;
      const alpha = 1 - Math.max(0, Math.min(1, (window.scrollY - coverAt) / (window.innerHeight * 0.35)));
      setCoverAlpha(alpha);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const p1 = Math.max(0, Math.min(1, (prog - 0.03) / 0.14));
  const p2 = Math.max(0, Math.min(1, (prog - 0.20) / 0.14));

  return (
    <section className="jscrollcue" ref={ref}>
      <div className="jscrollcue-panel" style={{ opacity: coverAlpha }}>
        <p
          className="jscrollcue-part1"
          style={{ opacity: p1, transform: `translateY(${((1 - p1) * 32).toFixed(1)}px)` }}
        >
          Keep scrolling to see
        </p>
        <p
          className="jscrollcue-part2"
          style={{ opacity: p2, transform: `translateY(${((1 - p2) * 32).toFixed(1)}px)` }}
        >
          ...the blog content.
        </p>
      </div>
    </section>
  );
}

/* ===== FILTER BAR (integrated into grid header) ===== */
function JournalFilter({ filter, onFilter }) {
  return (
    <div className="jfilter-bar">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          className={'jfilter-tab' + (filter === c.id ? ' is-active' : '')}
          onClick={() => onFilter(c.id)}
          role="tab"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

/* ===== ARTICLE CARD ===== */
function ArticleCard({ article, index }) {
  return (
    <article className="jcard" data-reveal data-reveal-delay={index % 2}>
      <a className="jcard-link">
        <div className="jcard-img">
          <PhotoPlaceholder tone={article.tone} label={article.label} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="jcard-body">
          <div className="jcard-label">{article.catLabel}</div>
          <h3 className="jcard-title">{article.title}</h3>
          <div className="jcard-foot">
            <span className="jcard-read">READ ARTICLE</span>
            <span className="jcard-meta">
              <span>{article.date}</span>
              <span className="jcard-meta-sep">·</span>
              <span>{article.readTime}</span>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

/* ===== GRID ===== */
function JournalGrid({ articles, filter, onFilter }) {
  return (
    <section className="jgrid-sec" id="journal-grid">
      <div className="jgrid-header">
        <JournalFilter filter={filter} onFilter={onFilter} />
      </div>
      <div className="jgrid">
        {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
      </div>
    </section>
  );
}

/* ===== DRIFT BAND ===== */
function JournalDrift() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const pathRef = useRef(null);
  const [planePos, setPlanePos] = useState({ x: 0, y: 0, angle: 0, len: 1 });
  const [approachP, setApproachP] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPlanePos((p) => ({ ...p, len }));
    }
  }, []);

  // Tracks section_rect.top to animate letters during the approach phase (before pinning)
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setApproachP(Math.max(0, Math.min(1, 1 - r.top / window.innerHeight)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    const t = Math.max(0, Math.min(1, prog / 0.53));
    const pt = pathRef.current.getPointAtLength(t * len);
    const ptAhead = pathRef.current.getPointAtLength(Math.min(len, t * len + 6));
    const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * 180 / Math.PI;
    setPlanePos({ x: pt.x, y: pt.y, angle, len });
  }, [prog]);

  const dashLen = planePos.len;
  const trail    = Math.max(0, Math.min(1, prog / 0.53)) * dashLen;
  const titleP   = approachP;
  const subP     = Math.max(0, Math.min(1, (prog - 0.65) / 0.07));
  const exitFade = 1 - Math.max(0, Math.min(1, (prog - 0.65) / 0.25));
  const titleY   = (1 - titleP) * 40;
  const subY     = (1 - subP) * 30;

  return (
    <section className="jdrift" ref={ref} aria-hidden="true">
      <div className="jdrift-sticky">
        <div className="jdrift-orange-flood" style={{ opacity: 1 - exitFade }} />
        <div className="jdrift-stripe" style={{ opacity: exitFade }}>
          <span className="jdrift-mark">—— STAY IN THE LOOP ——</span>
        </div>

        <svg className="jdrift-flight" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <path
            ref={pathRef}
            className="jdrift-flight-path"
            d="M -40 480 C 200 460, 280 200, 480 250 S 800 460, 980 280 S 1200 80, 1280 60"
            fill="none" stroke="#fef9ee" strokeWidth="1.8" strokeLinecap="round"
            strokeDasharray="4 8"
            style={{ strokeDashoffset: (dashLen - trail).toFixed(1) }}
          />
          {planePos.len > 1 && (
            <g
              className="jdrift-plane"
              transform={`translate(${planePos.x.toFixed(1)} ${planePos.y.toFixed(1)}) rotate(${planePos.angle.toFixed(1)})`}
            >
              <path d="M -16 -10 L 22 0 L -16 10 L -8 0 Z"
                    fill="#fef9ee" stroke="#0a1f29" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M -16 -10 L -8 0 L -16 10"
                    fill="none" stroke="#0a1f29" strokeWidth="1.2" strokeLinejoin="round" />
              <line x1="-8" y1="0" x2="22" y2="0" stroke="#0a1f29" strokeWidth="0.9" opacity="0.6" />
            </g>
          )}
        </svg>

        <div className="jdrift-titles">
          <div
            className="jdrift-title"
            style={{ transform: `translate3d(0, ${titleY.toFixed(1)}px, 0)`, opacity: titleP }}
          >
            <em>Letters.</em>
          </div>
          <div
            className="jdrift-sub"
            style={{ transform: `translate3d(0, ${subY.toFixed(1)}px, 0)`, opacity: subP }}
          >
            Don&apos;t miss a single one.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== NEWSLETTER ===== */
function JournalNewsletter() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [approachP, setApproachP] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setApproachP(Math.max(0, Math.min(1, 1 - r.top / window.innerHeight)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 4000);
    }
  };

  const reveal = (lo, hi) => Math.max(0, Math.min(1, (prog - lo) / (hi - lo)));
  const tagP   = approachP;
  const titleP = Math.max(0, Math.min(1, (approachP - 0.35) / 0.65));
  const subP   = reveal(0.05, 0.20);
  const formP  = reveal(0.18, 0.35);
  const sideP  = reveal(0.30, 0.50);

  const arrive = (p) => ({
    opacity: p,
    transform: `translate3d(0, ${((1 - p) * 28).toFixed(1)}px, 0)`,
  });

  return (
    <section className="jnews-sec" ref={ref}>
      <div className="jnews-sticky">
        <article className="jnews-inset">
          <div className="jnews-inset-body">
            <div className="jnews-inset-tag" style={arrive(tagP)}>DON&apos;T MISS AN ISSUE</div>
            <h3 className="jnews-inset-title" style={arrive(titleP)}>
              One letter, <em>once a month</em>.
            </h3>
            <p className="jnews-inset-sub" style={arrive(subP)}>
              Recaps, essays, and new fields the moment they open. No spam, ever.
            </p>
            <form className="jnews-inset-form" onSubmit={submit} style={arrive(formP)}>
              <input
                type="email"
                placeholder="you@university.edu.gh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                {done ? '✓ SUBSCRIBED' : <><span>SUBSCRIBE</span> <ArrowRight color="#0a1f29" size={14} /></>}
              </button>
            </form>
          </div>
          <div className="jnews-inset-side" aria-hidden="true" style={arrive(sideP)}>
            Letters from the field, written by the people who&apos;ve walked it.
          </div>
        </article>
      </div>
    </section>
  );
}

/* ===== PAGE ROOT ===== */
export function JournalPage() {
  const [filter, setFilter] = useState('all');

  const [featured, ...rest] = ARTICLES;
  const sorted = rest.filter((a) => filter === 'all' || a.cat === filter);

  return (
    <main className="journal-page">
      <JournalHero />
      <JournalSignpost />
      <JournalFeatured article={featured} />
      <JournalScrollCue />
      <JournalGrid articles={sorted} filter={filter} onFilter={setFilter} />

      {sorted.length === 0 && (
        <div className="jgrid-empty">
          <p>Nothing in <em>&ldquo;{CATEGORIES.find((c) => c.id === filter)?.label}&rdquo;</em> yet.</p>
          <button className="btn btn-ghost" onClick={() => setFilter('all')}>
            Show all
          </button>
        </div>
      )}

      <section className="jload-sec">
        <button className="jload">
          Load older articles
          <span className="jload-arrow"><ArrowDown color="#fff" size={16} /></span>
        </button>
        <div className="jload-foot">
          <span>
            {filter === 'all'
              ? `ALL ${ARTICLES.length} ARTICLES`
              : `${sorted.length + 1} OF ${ARTICLES.length} ARTICLES`}
          </span>
        </div>
      </section>

      <div className="jdrift-lead" aria-hidden="true" />
      <JournalDrift />
      <JournalNewsletter />
    </main>
  );
}
