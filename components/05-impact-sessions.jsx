/* ============================================================
   05 — IMPACT (scroll-pinned HUGE) + SESSIONS (Korowa carousel)
   ============================================================ */

/* === IMPACT — pinned, big number tweens up as you scroll ===
   Outer wrapper is tall (3 viewports). Inner content sticks
   at top: 0 with full viewport height. Scroll progress drives
   the number tween, the quote reveal, and the stats slide-in. */
function Impact() {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const progress = useScrollProgress(wrapRef);
  const inView = useInView(wrapRef, { threshold: 0.05, once: true });
  const count = useCountUp(300, inView, { duration: 1800 });

  // Phases: 0-0.4 = number scales in / counts up
  //         0.4-0.7 = quote appears
  //         0.55-1.0 = stats stagger in one by one
  const numScale = 0.7 + Math.min(0.4, progress * 1) * 0.75;
  const numOpacity = Math.min(1, progress * 4);
  const quoteOpacity = Math.max(0, Math.min(1, (progress - 0.35) * 4));
  const quoteY = (1 - Math.max(0, Math.min(1, (progress - 0.35) * 4))) * 24;

  // Per-stat reveal ranges — stagger them as scroll progresses.
  const STATS = [
    { v: '5',  p: '',  l: 'Sessions hosted',
      p2: 'Each one a 90-minute deep-dive on admissions, study technique or life inside the field.',
      startP: 0.55, endP: 0.70 },
    { v: '12', p: '',  l: 'Active mentors',
      p2: 'Doctors, residents and alumni answering questions every week, year-round.',
      startP: 0.65, endP: 0.80 },
    { v: '98', p: '%', l: 'Would recommend',
      p2: 'From post-session surveys across all five cohorts. The other 2% wanted more time.',
      startP: 0.75, endP: 0.90 },
  ];
  const statState = (s) => {
    const raw = Math.max(0, Math.min(1, (progress - s.startP) / (s.endP - s.startP)));
    const eased = 1 - Math.pow(1 - raw, 3);
    return { opacity: eased, y: (1 - eased) * 64 };
  };

  return (
    <section id="impact" className="impact-sec" ref={wrapRef}>
      <div className="impact-pin">
        <div className="impact-inner" ref={innerRef}>
          <div className="impact-tag">
            <span className="impact-tag-pulse" />
            PROOF / 24 MONTHS OF WORK
          </div>

          <div
            className="impact-num"
            style={{
              transform: `scale(${numScale})`,
              opacity: numOpacity,
              transformOrigin: 'left bottom',
            }}
          >
            {count}<span className="impact-num-plus">+</span>
          </div>

          <p
            className="impact-sub"
            style={{
              opacity: quoteOpacity,
              transform: `translateY(${quoteY}px)`,
            }}
          >
            students walked into a room they weren&apos;t supposed to feel
            ready for — and walked out with the language to describe what
            comes next.
          </p>

          <div
            className="impact-quote"
            style={{ opacity: quoteOpacity, transform: `translateY(${quoteY}px) rotate(2deg)` }}
          >
            <span className="impact-quote-mark">&ldquo;</span>
            Inspiring. Life-changing. I finally knew what to study for — and
            what kind of doctor I wanted to be.
            <small>— PARTICIPANT · SESSION 04 · WESLEY GIRLS&apos;</small>
          </div>

          <div className="impact-stats">
            {STATS.map((s) => {
              const { opacity, y } = statState(s);
              return (
                <div
                  className="impact-stat"
                  key={s.l}
                  style={{ opacity, transform: `translateY(${y}px)` }}
                >
                  <div className="impact-stat-v">
                    {s.v}{s.p && <em>{s.p}</em>}
                  </div>
                  <div className="impact-stat-l">{s.l}</div>
                  <p>{s.p2}</p>
                </div>
              );
            })}
          </div>

          {/* Decorative scroll cue */}
          <div className="impact-scroll-cue" aria-hidden="true">
            <span className="impact-cue-line" />
            <span className="impact-cue-track" style={{ '--p': progress }}>
              <span className="impact-cue-dot" />
            </span>
            <span className="impact-cue-line" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* === SESSIONS CAROUSEL — Korowa-style center + peeks ===
   Active card sits centered, larger. Side cards peek out
   behind, smaller + slightly faded. Click prev/next or
   auto-advance every 6s.                                   */
const SESSIONS = [
  { id: 's5', num: '05', date: 'FEB 2026', cat: 'MEDICINE', tone: 'teal',
    title: 'Inside the white coat: what the first clinical year actually feels like.',
    body: 'Three house officers walked our cohort through their first 12 months on the ward — the wins, the burnout, the moments they almost quit.',
    venue: 'University of Ghana Medical School · Korle Bu',
    duration: '90 min · live',
    attendees: 78 },
  { id: 's4', num: '04', date: 'DEC 2025', cat: 'STUDY', tone: 'orange',
    title: 'Study technique for SHS-3 science students.',
    body: 'Active recall, spaced practice, and how to read a textbook without falling asleep in the WAEC home stretch.',
    venue: 'Wesley Girls\' SHS · Cape Coast',
    duration: '120 min · in person',
    attendees: 62 },
  { id: 's3', num: '03', date: 'OCT 2025', cat: 'LIFE', tone: 'deep',
    title: 'Life outside medicine — yes, you\'re allowed.',
    body: 'Doctors who write, run startups, and parent — on holding more than one identity at once.',
    venue: 'KNUST · Kumasi',
    duration: '90 min · live',
    attendees: 54 },
  { id: 's2', num: '02', date: 'JUL 2025', cat: 'ADMISSIONS', tone: 'warm',
    title: 'Cracking the med school application — every form, demystified.',
    body: 'GMAC, UGMS, KNUST, UCC: deadlines, essays, interviews, and the mistakes that quietly cost places.',
    venue: 'Online · open cohort',
    duration: '60 min · live',
    attendees: 64 },
  { id: 's1', num: '01', date: 'APR 2025', cat: 'KICKOFF', tone: 'soft',
    title: 'Why we built this — the first CA360 session, ever.',
    body: 'A founders-only conversation: what we wished someone had told us at 17, and what we promised this org would never become.',
    venue: 'Online · friends and family',
    duration: '60 min · live',
    attendees: 42 },
];

function Sessions() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.2, once: false });

  useEffect(() => {
    if (paused || !inView) return;
    const t = setInterval(() => setActive((i) => (i + 1) % SESSIONS.length), 6000);
    return () => clearInterval(t);
  }, [paused, inView]);

  const prev = () => setActive((i) => (i - 1 + SESSIONS.length) % SESSIONS.length);
  const next = () => setActive((i) => (i + 1) % SESSIONS.length);

  return (
    <section
      id="sessions"
      className="sessions-sec"
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="sessions-head">
        <div className="sec-eyebrow" data-reveal>07 — From the field</div>
        <h2 className="sessions-title" data-reveal data-reveal-delay="1">
          Recent <em>sessions</em>,<br />from the journal.
        </h2>
        <a className="sessions-all" data-reveal data-reveal-delay="2">
          The full journal <ArrowRight size={14} />
        </a>
      </div>

      <div className="sessions-carousel" data-reveal>
        {SESSIONS.map((s, i) => {
          let offset = i - active;
          // wrap to nearest direction so we use shortest path
          if (offset >  SESSIONS.length / 2) offset -= SESSIONS.length;
          if (offset < -SESSIONS.length / 2) offset += SESSIONS.length;
          const absOff = Math.abs(offset);

          // Center, near peeks (±1), far peeks (±2+)
          const visible = absOff <= 2;
          const tx = offset * 360;       // horizontal spread
          const scale = absOff === 0 ? 1 : (absOff === 1 ? 0.78 : 0.58);
          const opacity = visible ? (absOff === 0 ? 1 : (absOff === 1 ? 0.55 : 0.18)) : 0;
          const z = 10 - absOff;
          const rot = offset * -2; // slight rotation outward

          return (
            <article
              key={s.id}
              className={'sessions-card' + (absOff === 0 ? ' is-center' : '')}
              style={{
                transform: `translate(-50%, 0) translateX(${tx}px) scale(${scale}) rotate(${rot}deg)`,
                opacity,
                zIndex: z,
                pointerEvents: absOff === 0 ? 'auto' : 'none',
              }}
              aria-hidden={absOff !== 0}
            >
              <div className="sessions-card-img">
                <PhotoPlaceholder tone={s.tone} label={'SESSION ' + s.num} style={{ width: '100%', height: '100%' }} />
                <span className="sessions-card-num">№ {s.num}</span>
                <span className="sessions-card-date">{s.date}</span>
              </div>
              <div className="sessions-card-body">
                <div className="sessions-card-meta">
                  <span>{s.cat}</span>
                  <span className="dot" />
                  <span>{s.duration}</span>
                  <span className="dot" />
                  <span>{s.attendees} attendees</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="sessions-card-venue">
                  <PinIcon size={14} color="#d68307" />
                  Hosted at <span>{s.venue}</span>
                </div>
                <div className="sessions-card-cta">
                  <a className="sessions-read">Read the recap <ArrowRight size={14} /></a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="sessions-controls">
        <button className="sessions-arrow" onClick={prev} aria-label="Previous session">
          <ArrowLeft size={18} />
        </button>
        <div className="sessions-dots" role="tablist">
          {SESSIONS.map((s, i) => (
            <button
              key={s.id}
              className={'sessions-dot' + (i === active ? ' is-active' : '')}
              onClick={() => setActive(i)}
              aria-label={'Go to session ' + s.num}
            >
              <span className="sessions-dot-label">№ {s.num}</span>
            </button>
          ))}
        </div>
        <button className="sessions-arrow" onClick={next} aria-label="Next session">
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

Object.assign(window, { Impact, Sessions });
