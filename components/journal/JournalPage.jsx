"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown, PinIcon } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { RouteMarker } from '../shared/RouteMarker';
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
    author: 'Dr. A. Asare', authorSeed: 1, authorRole: 'Founder · CA360', date: 'FEB 28, 2026', readTime: '8 min read',
    venue: 'University of Ghana Medical School · Korle Bu', tone: 'teal', label: 'INTERVIEW · KORLE BU' },
  { id: 'a2', cat: 'mentor', catLabel: 'FOUNDER ESSAY',
    title: 'A letter to the SHS-3 girl I was.',
    excerpt: "On picking a career by elimination, the older sister I didn't have, and the kind of advice I would have actually heard at 17.",
    author: 'Dr. A. Asare', authorSeed: 1, authorRole: 'Founder · CA360', date: 'FEB 14, 2026', readTime: '5 min',
    tone: 'warm', label: 'ESSAY' },
  { id: 'a3', cat: 'news', catLabel: 'NEWS & UPDATES',
    title: 'Why we delayed the Law track — and what that taught us.',
    excerpt: "We almost shipped a Law cohort before we had the mentors to back it up. Here's why we pulled the plug, and the rule we made afterwards.",
    author: 'CA360 Team', authorSeed: 7, authorRole: 'CA360 Editorial', date: 'JAN 30, 2026', readTime: '3 min',
    tone: 'orange', label: 'INTERNAL' },
  { id: 'a4', cat: 'student', catLabel: 'STUDENT STORY',
    title: 'How Akua got into UG Law without a debate coach.',
    excerpt: 'Six rejections, one acceptance, and a lot of YouTube debate replays. A first-person account from one of our SHS alumni.',
    author: 'Akua Boateng', authorSeed: 3, authorRole: 'CA360 Alumna', date: 'JAN 18, 2026', readTime: '6 min',
    tone: 'deep', label: 'CLASS OF 2025' },
  { id: 'a5', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'The four books Dr. Mensah wishes someone gave him at 17.',
    excerpt: 'Two on career navigation, one on self-awareness, one that has nothing to do with work. With links and a one-paragraph reason for each.',
    author: 'Dr. K. Mensah', authorSeed: 2, authorRole: 'Surgery Resident · KATH', date: 'JAN 09, 2026', readTime: '4 min',
    tone: 'cream', label: 'READING LIST' },
  { id: 'a6', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'Medicine, by the numbers: who actually gets in?',
    excerpt: "A look at admissions data across UGMS, KNUST and UCC over the last five intake cycles — and what it means for next year's applicants.",
    author: 'CA360 Research', authorSeed: 4, authorRole: 'CA360 Research', date: 'DEC 21, 2025', readTime: '9 min',
    tone: 'teal', label: 'DATA · ANNUAL' },
  { id: 'a7', cat: 'mentor', catLabel: 'MENTOR STORY',
    title: "Three mentors on the rejection they almost didn't recover from.",
    excerpt: "A residency that almost wasn't. A law school no. A grad scheme that came down to one phone call. Three stories, three reframes.",
    author: 'Esi Adjei', authorSeed: 6, authorRole: 'Paediatrics House Officer', date: 'DEC 12, 2025', readTime: '7 min',
    tone: 'warm', label: 'INTERVIEWS · 03' },
  { id: 'a8', cat: 'guide', catLabel: 'CAREER GUIDE',
    title: 'Five questions to ask before you commit to a course.',
    excerpt: 'The ones that would have saved a lot of people a lot of confusion — and the answers you should actually demand before signing anything.',
    author: 'CA360 Team', authorSeed: 7, authorRole: 'CA360 Editorial', date: 'NOV 28, 2025', readTime: '5 min',
    tone: 'orange', label: 'CAREER PREP' },
];

const CATEGORIES = [
  { id: 'all',     label: 'All articles' },
  { id: 'student', label: 'Student stories' },
  { id: 'mentor',  label: 'Mentor stories' },
  { id: 'guide',   label: 'Career guides' },
  { id: 'news',    label: 'News & updates' },
];

/* ===== JOURNAL HERO ===== */
function JournalHero() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const jump = (e) => {
    e.preventDefault();
    document.getElementById('journal-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const arrive = (lo, hi, dy = 44) => {
    if (isMobile) return {};
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
          <RouteMarker index="02" label="Journal" context="stories, guides, honest takes" />
          <div className="jh-hero-side" data-reveal data-reveal-delay="1">
            A journal on mentorship,<br />
            <em>careers, and the life after SHS.</em>
          </div>
        </div>

        {/* Title visible immediately on load — CSS animation, not scroll-gated */}
        <div className="jh-hero-title-wrap">
          <h1 className="jh-hero-title">
            The <em className="jh-hero-em">
              Journal
              <svg className="jh-hero-scribble" viewBox="0 0 160 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 10 C 30 4, 70 13, 110 7 S 148 12, 158 8" stroke="#d68307" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </em>
          </h1>
        </div>

        {/* Metric + statement — scroll-animated on desktop, always visible on mobile */}
        <div className="jh-hero-lower">
          <div className="jh-hero-metric">
            <div className="jh-hero-metric-label">PUBLISHED</div>
            <div className="jh-hero-metric-num">{ARTICLES.length}</div>
            <div className="jh-hero-metric-suf">articles</div>
          </div>

          <div className="jh-hero-statement-row">
            <p className="jh-hero-statement">
              Stories, guides, and honest takes for the path after <em>SHS</em> — from people who have already walked it.
            </p>
            <a className="jh-hero-anchor" href="#journal-start" onClick={jump}>
              <span>CHOOSE YOUR WAY IN</span>
              <span className="jh-hero-anchor-arrow"><ArrowDown color="#fff" size={14} /></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


const JOURNAL_PATHS = [
  {
    id: 'clarity',
    label: 'IF YOU ARE CHOOSING',
    title: 'I need career clarity.',
    detail: 'Start with guides, admissions context, and the questions worth asking before you commit.',
    filter: 'guide',
    target: 'journal-grid',
  },
  {
    id: 'stories',
    label: 'IF YOU WANT THE REAL VERSION',
    title: 'Show me the path.',
    detail: 'Hear from students and mentors about the turns, doubts, and decisions behind the polished title.',
    filter: 'student',
    target: 'journal-grid',
  },
  {
    id: 'wander',
    label: 'IF YOU ARE JUST EXPLORING',
    title: 'Start with what is new.',
    detail: 'Begin with this month’s featured story, then keep wandering through the archive at your own pace.',
    filter: 'all',
    target: 'journal-featured',
  },
];

function JournalStart({ onChoose }) {
  return (
    <section className="jstart-sec" id="journal-start" aria-labelledby="journal-start-title">
      <div className="jstart-head">
        <div className="jstart-marker" data-reveal>
          <RouteMarker index="02" label="Start here" context="choose a way in" />
        </div>
        <div>
          <p className="jstart-kicker" data-reveal>NO RIGHT ORDER REQUIRED</p>
          <h2 id="journal-start-title" data-reveal data-reveal-delay="1">
            Not sure where to begin?<br /><em>Start with the question.</em>
          </h2>
        </div>
        <p className="jstart-intro" data-reveal data-reveal-delay="2">
          The Journal is not a test. Pick the sentence that sounds most like you and we will take you to a good first story.
        </p>
      </div>
      <div className="jstart-paths">
        {JOURNAL_PATHS.map((path, index) => (
          <button
            type="button"
            className={'jstart-path' + (index === 0 ? ' is-primary' : '')}
            key={path.id}
            onClick={() => onChoose(path.filter, path.target)}
            data-reveal
            data-reveal-delay={index + 1}
          >
            <span className="jstart-path-label">{path.label}</span>
            <strong>{path.title}</strong>
            <span className="jstart-path-detail">{path.detail}</span>
            <span className="jstart-path-arrow"><ArrowRight color={index === 0 ? '#fff' : '#d68307'} size={15} /></span>
          </button>
        ))}
      </div>
      <div className="jstart-browse" data-reveal>
        <span>Already know what you want?</span>
        <a href="#journal-grid">Browse every story <ArrowRight color="#d68307" size={14} /></a>
      </div>
    </section>
  );
}

/* ===== FEATURED ARTICLE ===== */
function JournalFeatured({ article, onOpen }) {
  const secRef = useRef(null);
  const prog = useScrollProgress(secRef);
  const scroll = useElementScroll(secRef);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const imgY = isMobile ? 0 : scroll * -70;

  const arrive = (lo, hi, dy = 40) => {
    if (isMobile) return {};
    const p = Math.max(0, Math.min(1, (prog - lo) / (hi - lo)));
    return { opacity: p, transform: `translate3d(0, ${((1 - p) * dy).toFixed(1)}px, 0)`, willChange: 'opacity, transform' };
  };

  return (
    <section className="jf-sec" id="journal-featured" ref={secRef}>
      <div className="jf-sticky">
        <div className="jf-eyebrow" data-reveal>
          <span className="jf-eyebrow-mark">★</span>
          A good place to begin · Featured story
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
                  <div className="jf-author-role">{article.authorRole}</div>
                </div>
              </div>
              <a
                className="jf-cta"
                href={`/journal#${article.id}`}
                onClick={(e) => { e.preventDefault(); onOpen(article); }}
              >
                Read the featured story
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
          Stories. Guides. Honest takes.
        </p>
        <p
          className="jscrollcue-part2"
          style={{ opacity: p2, transform: `translateY(${((1 - p2) * 32).toFixed(1)}px)` }}
        >
          All of it, below.
        </p>
      </div>
    </section>
  );
}

/* ===== FILTER BAR (integrated into grid header) ===== */
function JournalFilter({ filter, onFilter }) {
  return (
          <div className="jfilter-bar" role="tablist" aria-label="Filter journal stories">

      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          id={`journal-filter-${c.id}`}
          className={'jfilter-tab' + (filter === c.id ? ' is-active' : '')}
          onClick={() => onFilter(c.id)}
          role="tab"
          aria-selected={filter === c.id}
          aria-controls="journal-grid-list"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

/* ===== ARTICLE CARD ===== */
function ArticleCard({ article, index, onOpen }) {
  return (
    <article className="jcard" data-reveal data-reveal-delay={index % 2}>
      <a
        className="jcard-link"
        href={`/journal#${article.id}`}
        onClick={(e) => { e.preventDefault(); onOpen(article); }}
      >
        <div className="jcard-img">
          <PhotoPlaceholder tone={article.tone} label={article.label} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="jcard-body">
          <div className="jcard-label">{article.catLabel}</div>
          <h3 className="jcard-title">{article.title}</h3>
          <p className="jcard-excerpt">{article.excerpt}</p>
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

/* ===== READING ROOM ===== */
function JournalReader({ article, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div className="jreader" role="dialog" aria-modal="true" aria-labelledby="jreader-title">
      <button className="jreader-backdrop" aria-label="Close article" onClick={onClose} />
      <article className="jreader-panel">
        <div className="jreader-topline">
          <span>READING ROOM · {article.catLabel}</span>
          <button ref={closeRef} className="jreader-close" onClick={onClose} aria-label="Close article">
            CLOSE <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="jreader-body">
          <div className="jreader-kicker">{article.date} · {article.readTime}</div>
          <h2 id="jreader-title">{article.title}</h2>
          <div className="jreader-author">
            <Portrait seed={article.authorSeed} bg="transparent" tone="#d68307" />
            <span>{article.author} · {article.authorRole}</span>
          </div>
          <p className="jreader-excerpt">{article.excerpt}</p>
          <div className="jreader-next">
            <span className="jreader-next-label">KEEP GOING</span>
            <strong>Turn the thought into a next step.</strong>
            <p>See what is open at CA360, or get the next letter when another story goes live.</p>
            <div className="jreader-actions">
              <a className="btn btn-primary" href="/#opportunity" onClick={onClose}>
                See what&apos;s open <ArrowRight color="#fff" size={14} />
              </a>
              <a className="jreader-secondary" href="#journal-letter" onClick={onClose}>
                Get the monthly letter <ArrowRight color="#0a1f29" size={14} />
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ===== GRID ===== */
function JournalGrid({ articles, filter, onFilter, onOpen }) {
  return (
    <section className="jgrid-sec" id="journal-grid">
      <div className="jgrid-header">
        <JournalFilter filter={filter} onFilter={onFilter} />
      </div>
      <div className="jgrid" id="journal-grid-list" role="tabpanel" aria-live="polite">
        {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i} onOpen={onOpen} />)}
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const arrive = (p) => isMobile ? {} : ({
    opacity: p,
    transform: `translate3d(0, ${((1 - p) * 28).toFixed(1)}px, 0)`,
  });

  return (
    <section className="jnews-sec" id="journal-letter" ref={ref}>
      <div className="jnews-sticky">
        <article className="jnews-inset">
          <div className="jnews-inset-body">
            <div className="jnews-inset-tag" style={arrive(tagP)}>DON&apos;T MISS AN ISSUE</div>
            <h3 className="jnews-inset-title" style={arrive(titleP)}>
              One letter, <em>once a month</em>.
            </h3>
            <p className="jnews-inset-sub" style={arrive(subP)}>
              Recaps, essays, and career talks — the moment they go live. No spam, ever.
            </p>
            <form className="jnews-inset-form" onSubmit={submit} style={arrive(formP)}>
              <label className="sr-only" htmlFor="journal-letter-email">Email address</label>
              <input
                id="journal-letter-email"
                type="email"
                placeholder="your@email.com"
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
  const [selectedArticle, setSelectedArticle] = useState(null);

  const chooseJournalPath = (nextFilter, targetId) => {
    setFilter(nextFilter);
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const openArticle = (article) => {
    setSelectedArticle(article);
    window.history.replaceState(null, '', `/journal#${article.id}`);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    window.history.replaceState(null, '', '/journal');
  };

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      const article = ARTICLES.find((item) => item.id === id);
      if (article) setSelectedArticle(article);
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const [featured, ...rest] = ARTICLES;
  const sorted = rest.filter((a) => filter === 'all' || a.cat === filter);

  return (
    <main className="journal-page">
      <JournalHero />
      <JournalStart onChoose={chooseJournalPath} />
      <JournalFeatured article={featured} onOpen={openArticle} />
      <JournalScrollCue />
      <JournalGrid articles={sorted} filter={filter} onFilter={setFilter} onOpen={openArticle} />

      {sorted.length === 0 && (
        <div className="jgrid-empty">
          <p>Nothing in <em>&ldquo;{CATEGORIES.find((c) => c.id === filter)?.label}&rdquo;</em> yet.</p>
          <button className="btn btn-ghost" onClick={() => setFilter('all')}>
            Show all
          </button>
        </div>
      )}

      <section className="jload-sec">
        <div className="jload" aria-live="polite">
          You&apos;re caught up — more stories arrive once a month.
          <a className="jload-link" href="#journal-letter">
            Get the monthly letter <ArrowRight color="#fff" size={14} />
          </a>
        </div>
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
      {selectedArticle && <JournalReader article={selectedArticle} onClose={closeArticle} />}
    </main>
  );
}
