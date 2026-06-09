/* ============================================================
   NAV (sticky with scroll-spy) + HERO (Playground full).
   Section IDs: hero, mission, origin, fields, programs, gain,
   mentors, impact, sessions, join, news, faq.
   ============================================================ */

const NAV_SECTIONS = [
  { id: 'home',     label: 'Home' },
  { id: 'mission',  label: 'About' },
  { id: 'mentors',  label: 'Mentors' },
  { id: 'join',     label: 'Join' },
  { id: 'sessions', label: 'Stories' },
  { id: 'faq',      label: 'FAQ' },
];

function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_SECTIONS.map((s) => s.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      // Pick the entry closest to top with most visibility.
      let best = null;
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
      });
      if (best) setActive(best.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={'nav' + (scrolled ? ' is-scrolled' : '')}>
      <a className="nav-brand" href="#home" onClick={jump('home')}>
        <span className="nav-brand-mark">
          <LogoMark color="#fff" accent="#fff" size={22} />
        </span>
        <span className="nav-brand-text">
          Career Arcadia 360
          <small>mentorship that shows up</small>
        </span>
      </a>

      <div className="nav-pill">
        {NAV_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={'#' + s.id}
            className={'nav-link' + (active === s.id ? ' is-active' : '')}
            onClick={jump(s.id)}
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="nav-actions">
        <button
          className="nav-mode"
          onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          aria-label="Toggle mode (decorative)"
          title="Mode toggle — decorative for now"
        >
          <span className={mode === 'light' ? 'on' : ''}>☀</span>
          <span className={mode === 'dark' ? 'on' : ''}>☾</span>
        </button>
        <a className="btn btn-primary nav-cta" href="#join" onClick={jump('join')}>
          Apply <ArrowRight color="#fff" size={14} />
        </a>
      </div>
    </nav>
  );
}

/* === HERO === */
function Hero() {
  return (
    <section id="home" className="hero">
      {/* Top ticker — borrowed from Manifesto for credibility band */}
     

      <div className="hero-stage">

        <h1 className="hero-headline">
          <span data-reveal>From SHS</span>
          <span data-reveal data-reveal-delay="1">
            to <span className="hero-stamp">the career</span>
          </span>
          <span data-reveal data-reveal-delay="2">
            you were
            {' '}
            <em className="hero-italic">
              meant for
              <svg className="hero-scribble" viewBox="0 0 240 18" preserveAspectRatio="none">
                <path d="M2 12 C 30 4, 60 16, 90 8 S 160 16, 238 6" stroke="#d68307" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </em>
            .
          </span>
        </h1>

        <span className="hero-twinkle hero-twinkle-1" aria-hidden="true">✦</span>
        <span className="hero-twinkle hero-twinkle-2" aria-hidden="true">✦</span>
        <span className="hero-twinkle hero-twinkle-3" aria-hidden="true">✦</span>

        <div className="hero-foot" data-reveal data-reveal-delay="3">
          <div className="hero-foot-left">
            <p>
              Real guidance. Real mentors. Real clarity — for students stepping
              into medicine, law, engineering and business with nobody to ask.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary">
                Attend a session <ArrowRight color="#fff" size={14} />
              </a>
              <a className="btn btn-secondary">Become a mentor</a>
            </div>
          </div>
          <div className="hero-foot-right">
            <div className="hero-foot-num">
              5<span className="dot">·</span>300<span className="plus">+</span>
            </div>
            <div className="hero-foot-lab">SESSIONS · STUDENTS REACHED</div>
          </div>
        </div>

        {/* Collage tiles */}
        <div className="hero-collage" aria-hidden="true">
          <div className="hero-tile hero-tile-1 has-tape">
            <PhotoPlaceholder tone="teal" label="SESSION 05" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="hero-tile hero-tile-2 has-tape">
            <PhotoPlaceholder tone="orange" label="MENTOR" style={{ width: '100%', height: '100%' }}>
              <Portrait seed={5} bg="transparent" tone="#d68307" accent="#fff" />
            </PhotoPlaceholder>
          </div>
          <div className="hero-tile hero-tile-3 has-tape">
            <div className="hero-tile-quote">
              &ldquo;Honestly life-changing. I finally understood what med school is actually like.&rdquo;
            </div>
            <div className="hero-tile-quote-src">— SHS-3 student, Cape Coast</div>
          </div>
        </div>

        {/* Decorative blobs */}
        <span className="hero-blob hero-blob-teal" aria-hidden="true" />
        <span className="hero-blob hero-blob-orange" aria-hidden="true" />
      </div>
    </section>
  );
}

Object.assign(window, { StickyNav, Hero });
