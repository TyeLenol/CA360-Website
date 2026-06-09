/* ============================================================
   THE BLOG — index
   Editorial layout inspired by Royal Stranger. Big serif title,
   featured spread, modern filter bar, Crafted-Edits article grid,
   inline newsletter CTA. Reuses StickyNav + Footer from the
   homepage components.
   ============================================================ */

/* ============================================================
   Local parallax hook — returns a normalized value:
     −1 when element's center is one viewport below center
      0 when element's center is at viewport center
     +1 when element's center is one viewport above center
   ============================================================ */
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
        const offset = (wh / 2 - center) / wh; // −1..+1 roughly
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

/* ===== ARTICLES (8 total: 1 featured + 7 in grid) ===== */
const ARTICLES = [
  /* 0 — featured */
  { id: 'a1', featured: true, cat: 'mentor',
    catLabel: 'MENTOR STORY',
    title: 'The white coat, unmasked: a year inside the ward.',
    excerpt: 'Three house officers walked our biggest cohort yet through their first 12 months on the ward — the wins, the burnout, and the moments they almost quit. Plus the seven questions that broke the room.',
    author: 'Dr. A. Asare',
    authorSeed: 1,
    date: 'FEB 28, 2026',
    readTime: '8 min read',
    venue: 'University of Ghana Medical School · Korle Bu',
    tone: 'teal',
    label: 'INTERVIEW · KORLE BU' },

  { id: 'a2', cat: 'essay',
    catLabel: 'FOUNDER ESSAY',
    title: 'A letter to the SHS-3 girl I was.',
    excerpt: 'On picking medicine by elimination, the older sister I didn\'t have, and the kind of advice I would have actually heard at 17.',
    author: 'Dr. A. Asare',
    authorSeed: 1,
    date: 'FEB 14, 2026',
    readTime: '5 min',
    tone: 'warm', label: 'ESSAY' },

  { id: 'a3', cat: 'news',
    catLabel: 'NEWS',
    title: 'Why we delayed the Law track — and what that taught us.',
    excerpt: 'We almost shipped a Law cohort before we had the mentors to back it up. Here\'s why we pulled the plug, and the rule we made afterwards.',
    author: 'CA360 Team',
    authorSeed: 7,
    date: 'JAN 30, 2026',
    readTime: '3 min',
    tone: 'orange', label: 'INTERNAL' },

  { id: 'a4', cat: 'student',
    catLabel: 'STUDENT STORY',
    title: 'How Akua got into UG Law without a debate coach.',
    excerpt: 'Six rejections, one acceptance, and a lot of YouTube debate replays. A first-person account from one of our SHS alumni.',
    author: 'Akua Boateng',
    authorSeed: 3,
    date: 'JAN 18, 2026',
    readTime: '6 min',
    tone: 'deep', label: 'CLASS OF 2025' },

  { id: 'a5', cat: 'guide',
    catLabel: 'CAREER GUIDE',
    title: 'The four books Dr. Mensah wishes someone gave him at 17.',
    excerpt: 'Two on study, one on bedside manner, one that has nothing to do with medicine. With links and a one-paragraph reason.',
    author: 'Dr. K. Mensah',
    authorSeed: 2,
    date: 'JAN 09, 2026',
    readTime: '4 min',
    tone: 'cream', label: 'READING LIST' },

  { id: 'a6', cat: 'spotlight',
    catLabel: 'FIELD SPOTLIGHT',
    title: 'Medicine, by the numbers: who actually gets in?',
    excerpt: 'A look at admissions data across UGMS, KNUST and UCC over the last five intake cycles — and what it means for next year\'s applicants.',
    author: 'CA360 Research',
    authorSeed: 4,
    date: 'DEC 21, 2025',
    readTime: '9 min',
    tone: 'teal', label: 'DATA · ANNUAL' },

  { id: 'a7', cat: 'mentor',
    catLabel: 'MENTOR STORY',
    title: 'Three mentors on the rejection they almost didn\'t recover from.',
    excerpt: 'A residency that almost wasn\'t. A law school no. A grad scheme that came down to one phone call. Three stories, three reframes.',
    author: 'Esi Adjei',
    authorSeed: 6,
    date: 'DEC 12, 2025',
    readTime: '7 min',
    tone: 'warm', label: 'INTERVIEWS · 03' },

  { id: 'a8', cat: 'guide',
    catLabel: 'CAREER GUIDE',
    title: 'How to read a textbook without falling asleep.',
    excerpt: 'Active recall, spaced practice, and the one technique that took my retention from 30% to 80% in a term. Tested, not theorised.',
    author: 'Dr. A. Asare',
    authorSeed: 1,
    date: 'NOV 28, 2025',
    readTime: '6 min',
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

/* ===== HERO =====
   Mix of our existing big-serif title + Royal Stranger's small-label
   + big-statement intro. Title is the anchor; the statement sits beside
   it like RS, and a READ ARTICLES anchor pulls people down to the grid. */
function JournalHero() {
  const heroRef = useRef(null);
  const scroll = useElementScroll(heroRef);
  // Title moves slower than scroll — lingers in view (extended range for a longer, smoother feel)
  const titleY = scroll * 180;

  const jump = (e) => {
    e.preventDefault();
    const el = document.getElementById('journal-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <section className="jh-hero" id="journal-top" ref={heroRef}>
      <div className="jh-hero-top">
        <div className="sec-eyebrow" data-reveal>The blog</div>
        <div className="jh-hero-side" data-reveal data-reveal-delay="1">
          A quarterly on mentorship,<br />
          <em>medicine, and the life after SHS.</em>
        </div>
      </div>

      <div
        className="jh-hero-title-wrap"
        style={{ transform: `translate3d(0, ${titleY.toFixed(1)}px, 0)` }}
      >
        <h1 className="jh-hero-title" data-reveal data-reveal-delay="1">
          The <em>Blog</em>.
        </h1>
      </div>

      {/* Statement headline + anchor CTA */}
      <div className="jh-hero-statement-row">
        <p className="jh-hero-statement" data-reveal data-reveal-delay="2">
          At the core of Career Arcadia 360 lies an unwavering commitment to
          <em> honest mentorship</em>, lived experience, and the questions
          nobody answered for us.
        </p>
        <a className="jh-hero-anchor" href="#journal-grid" onClick={jump} data-reveal data-reveal-delay="3">
          <span>READ ARTICLES</span>
          <span className="jh-hero-anchor-arrow"><ArrowDown color="#fff" size={14} /></span>
        </a>
      </div>

      <div className="jh-hero-foot">
        <div className="jh-hero-meta" data-reveal data-reveal-delay="3">
          <div className="jh-hero-meta-item">
            <div className="jh-hero-meta-l">PUBLISHED</div>
            <div className="jh-hero-meta-v">{ARTICLES.length}</div>
            <div className="jh-hero-meta-suf">articles</div>
          </div>
          <div className="jh-hero-meta-item">
            <div className="jh-hero-meta-l">LAST UPDATED</div>
            <div className="jh-hero-meta-v jh-hero-meta-v-sm">Feb 28</div>
            <div className="jh-hero-meta-suf">2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== FEATURED ===== */
function JournalFeatured({ article }) {
  const secRef = useRef(null);
  const scroll = useElementScroll(secRef);
  // Image drifts vertically inside its frame, slower & longer travel.
  const imgY = scroll * -70;

  return (
    <section className="jf-sec" ref={secRef}>
      <div className="jf-eyebrow" data-reveal>
        <span className="jf-eyebrow-mark">★</span>
        Featured · This issue
        <span className="jf-eyebrow-rule" />
      </div>
      <article className="jf-card">
        <div className="jf-img" data-reveal>
          <div
            className="jf-img-inner"
            style={{ transform: `translate3d(0, ${imgY.toFixed(1)}px, 0)` }}
          >
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
        <div className="jf-body">
          <div className="jf-meta" data-reveal>
            <span>{article.date}</span>
            <span className="dot" />
            <span>{article.readTime}</span>
            <span className="dot" />
            <span>{article.author.toUpperCase()}</span>
          </div>
          <h2 className="jf-title" data-reveal data-reveal-delay="1">
            {article.title}
          </h2>
          <p className="jf-excerpt" data-reveal data-reveal-delay="2">
            {article.excerpt}
          </p>

          {article.venue && (
            <div className="jf-venue" data-reveal data-reveal-delay="3">
              <PinIcon size={14} color="#d68307" />
              Hosted at <span>{article.venue}</span>
            </div>
          )}

          <div className="jf-foot" data-reveal data-reveal-delay="3">
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
    </section>
  );
}

/* ===== FILTER BAR =====
   Modern lipedema-guru-style: a big rounded search input on top,
   then a horizontal row of pill category buttons below. No sort
   toggle, no meta counter, non-sticky. Clean and roomy. */
function JournalFilter({ filter, onFilter, query, onQuery }) {
  return (
    <section className="jfilter-sec">
      <div className="jfilter-inner">
        <label className="jfilter-search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search articles by topic, author, or keyword…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="jfilter-search-clear"
              onClick={() => onQuery('')}
              aria-label="Clear search"
            >×</button>
          )}
        </label>

        <div className="jfilter-tabs" role="tablist">
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
      </div>
    </section>
  );
}

/* ===== ARTICLE CARD =====
   Royal Stranger "Crafted Edits" tile, dark mode:
   landscape image LEFT, text block RIGHT (small label → big bold
   uppercase title → READ ARTICLE link). Cream type on dark teal,
   orange accents. Two cards per row, thin rule below each row.   */
function ArticleCard({ article, index }) {
  return (
    <article
      className="jcard"
      data-reveal
      data-reveal-delay={index % 2}
    >
      <a className="jcard-link">
        <div className="jcard-img">
          <PhotoPlaceholder
            tone={article.tone}
            label={article.label}
            style={{ width: '100%', height: '100%' }}
          />
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

/* ===== NEWSLETTER =====
   Long-form orange band. As scroll progresses, the tag → headline →
   sub → input arrive in sequence. Section is taller than the
   viewport so the arrival has room to play. The bottom of the
   section gradients smoothly from orange → ink into the footer. */
function JournalNewsletter() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 4000);
    }
  };

  // Stagger thresholds for sequential arrival
  const reveal = (lo, hi) => Math.max(0, Math.min(1, (prog - lo) / (hi - lo)));
  const tagP   = reveal(0.08, 0.22);
  const titleP = reveal(0.18, 0.36);
  const subP   = reveal(0.30, 0.46);
  const formP  = reveal(0.40, 0.56);
  const sideP  = reveal(0.46, 0.62);

  const arrive = (p) => ({
    opacity: p,
    transform: `translate3d(0, ${((1 - p) * 28).toFixed(1)}px, 0)`,
  });

  return (
    <section className="jnews-sec" ref={ref}>
      <div className="jnews-sticky">
        <article className="jnews-inset">
          <div className="jnews-inset-body">
            <div className="jnews-inset-tag" style={arrive(tagP)}>
              DON&apos;T MISS AN ISSUE
            </div>
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

/* ===== GRID =====
   Dark teal grid, Royal-Stranger-style. 2 cards per row.
   No header — the filter bar above is the entry point.   */
function JournalGrid({ articles }) {
  return (
    <section className="jgrid-sec" id="journal-grid">
      <div className="jgrid">
        {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
      </div>
    </section>
  );
}

/* ===== FEATURED-ARTICLE TITLE BAND =====
   Sits between Hero and Featured Article. Cream-paper background.
   Giant italic "Featured Article" that drifts horizontally as you
   scroll past, with a tiny rotating circular mark.                */
function JournalFeaturedTitle() {
  const ref = useRef(null);
  const scroll = useElementScroll(ref);
  const xPct = -scroll * 22;
  return (
    <section className="jftitle" ref={ref} aria-hidden="true">
      <div className="jftitle-mark">
        <svg viewBox="0 0 80 80" width="68" height="68" className="jftitle-mark-svg">
          <defs>
            <path id="jftitle-circle" d="M40,40 m-28,0 a28,28 0 1,1 56,0 a28,28 0 1,1 -56,0" />
          </defs>
          <text className="jftitle-mark-text" fontSize="6.4" letterSpacing="2.3">
            <textPath href="#jftitle-circle">FEATURED · THE BLOG · FEATURED · THE BLOG · </textPath>
          </text>
          <text x="40" y="46" textAnchor="middle" fontSize="22"
                fontFamily="Fraunces" fontStyle="italic" fill="#d68307">01</text>
        </svg>
      </div>
      <div
        className="jftitle-word"
        style={{ transform: `translate3d(${xPct.toFixed(1)}%, 0, 0)` }}
      >
        <span>Featured</span>
        <em>Article.</em>
      </div>
    </section>
  );
}

/* ===== SCROLL BRIDGE =====
   Awwwards-style "continue reading" interstitial between Featured
   and the Grid. Centered vertical column: tick row at top, rotating
   circular badge, a long orange line drawn by scroll, a chevron at
   the bottom marking the grid below.                              */
function JournalScrollBridge() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const lineScale = Math.max(0, Math.min(1, (prog - 0.15) / 0.65));
  const dotY = lineScale * 100;
  const angle = prog * 360;
  return (
    <section className="jbridge" ref={ref} aria-hidden="true">
      <div className="jbridge-inner">
        <div className="jbridge-ticks">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ height: i === 4 ? 14 : (i % 2 === 0 ? 8 : 4) }} />
          ))}
        </div>

        <div
          className="jbridge-badge"
          style={{ transform: `rotate(${angle.toFixed(1)}deg)` }}
        >
          <svg viewBox="0 0 140 140" width="140" height="140">
            <defs>
              <path id="jbridge-circle" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
            </defs>
            <text className="jbridge-badge-text" fontSize="9.4" letterSpacing="3.6">
              <textPath href="#jbridge-circle">CONTINUE READING · 07 STORIES BELOW · </textPath>
            </text>
          </svg>
          <span className="jbridge-badge-center" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 4v16M12 20l-6-6M12 20l6-6"
                    stroke="#d68307" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </div>

        <div className="jbridge-line">
          <span
            className="jbridge-line-fill"
            style={{ transform: `scaleY(${lineScale.toFixed(3)})` }}
          />
          <span
            className="jbridge-line-dot"
            style={{ top: `${dotY.toFixed(1)}%` }}
          />
        </div>

        <div className="jbridge-foot">
          <span className="jbridge-foot-label">07 — BELOW</span>
        </div>
      </div>
    </section>
  );
}

/* ===== DRIFT BAND =====
   Sits between the Grid and Newsletter. Tall section (~150vh) so the
   paper airplane has scroll-distance to trace its dashed beeline
   across the band. Title "Letters." with sub "Don't miss a single
   one." Gradient teal-deep → orange opens into the newsletter.   */
function JournalDrift() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const pathRef = useRef(null);
  const [planePos, setPlanePos] = useState({ x: 0, y: 0, angle: 0, len: 1 });

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPlanePos((p) => ({ ...p, len }));
    }
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    const t = Math.max(0, Math.min(1, (prog - 0.08) / 0.80));
    const pt = pathRef.current.getPointAtLength(t * len);
    const ptAhead = pathRef.current.getPointAtLength(Math.min(len, t * len + 6));
    const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * 180 / Math.PI;
    setPlanePos({ x: pt.x, y: pt.y, angle, len });
  }, [prog]);

  const dashLen = planePos.len;
  const trail   = Math.max(0, Math.min(1, (prog - 0.08) / 0.80)) * dashLen;
  const titleP  = Math.max(0, Math.min(1, (prog - 0.06) / 0.30));
  const subP    = Math.max(0, Math.min(1, (prog - 0.22) / 0.30));
  const titleY  = (1 - titleP) * 40;
  const subY    = (1 - subP) * 30;

  return (
    <section className="jdrift" ref={ref} aria-hidden="true">
      <div className="jdrift-sticky">
        <div className="jdrift-stripe">
          <span className="jdrift-mark">—— STAY IN THE LOOP ——</span>
        </div>

        <svg className="jdrift-flight" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <path
            ref={pathRef}
            className="jdrift-flight-path"
            d="M -40 480 C 200 460, 280 200, 480 250 S 800 460, 980 280 S 1200 80, 1280 60"
            fill="none"
            stroke="#d68307"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="4 8"
            style={{ strokeDashoffset: (dashLen - trail).toFixed(1) }}
          />
          <g
            className="jdrift-plane"
            transform={`translate(${planePos.x.toFixed(1)} ${planePos.y.toFixed(1)}) rotate(${planePos.angle.toFixed(1)})`}
          >
            <path d="M -16 -10 L 22 0 L -16 10 L -8 0 Z"
                  fill="#fef9ee" stroke="#0a1f29" strokeWidth="1.2"
                  strokeLinejoin="round" />
            <path d="M -16 -10 L -8 0 L -16 10"
                  fill="none" stroke="#0a1f29" strokeWidth="1.2"
                  strokeLinejoin="round" />
            <line x1="-8" y1="0" x2="22" y2="0" stroke="#0a1f29" strokeWidth="0.9" opacity="0.6" />
          </g>
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

function JournalApp() {
  useGlobalRevealObserver();

  const [filter, setFilter] = useState('all');
  const [query,  setQuery]  = useState('');

  // The featured article is always pinned (index 0) — exclude from grid.
  const [featured, ...rest] = ARTICLES;

  const sorted = rest
    .filter((a) => filter === 'all' || a.cat === filter)
    .filter((a) => !query ||
      (a.title + ' ' + a.excerpt + ' ' + a.author).toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="app-root journal-page">
      <StickyNav activeOverride="sessions" />
      <main>
        <JournalHero />
        <JournalFeaturedTitle />
        <JournalFeatured article={featured} />
        <JournalScrollBridge />
        <JournalFilter
          filter={filter} onFilter={setFilter}
          query={query}   onQuery={setQuery}
        />
        <JournalGrid articles={sorted} />

        {sorted.length === 0 && (
          <div className="jgrid-empty">
            <p>Nothing matched <em>&ldquo;{query || CATEGORIES.find((c) => c.id === filter)?.label}&rdquo;</em>.</p>
            <button className="btn btn-ghost" onClick={() => { setFilter('all'); setQuery(''); }}>
              Clear filters
            </button>
          </div>
        )}

        <section className="jload-sec">
          <button className="jload">
            Load older articles
            <span className="jload-arrow"><ArrowDown color="#fff" size={16} /></span>
          </button>
          <div className="jload-foot">
            <span>VIEWING {sorted.length + 1} OF {ARTICLES.length} ARTICLES</span>
          </div>
        </section>

        <JournalDrift />
        <JournalNewsletter />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<JournalApp />);
