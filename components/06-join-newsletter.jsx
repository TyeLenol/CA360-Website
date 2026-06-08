/* ============================================================
   06 — JOIN IN (pinned + swapped) + NEWSLETTER (editorial)
   ============================================================ */

const JOIN_PANELS = [
  {
    n: '01',
    tag: 'FOR STUDENTS',
    title: 'Attend a session.',
    titleEm: 'session',
    body: 'Free, online or on your campus. Bring a friend, bring a question, leave with a plan that actually fits your life — not someone else\'s.',
    bullets: ['Free for all SHS and undergrad students', 'Online and in-person formats', 'Recordings stay free forever'],
    cta: 'Reserve a seat',
    bg: 'rgba(214, 131, 7, 1)',
    fg: '#fff',
    photoTone: 'teal',
    photoLabel: 'STUDENTS · SESSION 04',
  },
  {
    n: '02',
    tag: 'FOR PROFESSIONALS',
    title: 'Become a mentor.',
    titleEm: 'mentor',
    body: 'If you walked the path — medicine, law, engineering, business — share it with someone behind you. We match you with a student who started where you did.',
    bullets: ['3-month rolling commitment', 'Hand-matched within 14 days', 'Async or live, your call'],
    cta: 'Apply to mentor',
    bg: 'rgba(54, 114, 143, 1)',
    fg: '#fff',
    photoTone: 'warm',
    photoLabel: 'MENTOR · WHITEBOARD',
  },
  {
    n: '03',
    tag: 'FOR PARTNERS',
    title: 'Support the mission.',
    titleEm: 'mission',
    body: 'Sponsor a session, partner with us as a school, or fund a cohort that wouldn\'t happen otherwise. Every cedi turns into a seat — guaranteed.',
    bullets: ['School and university partnerships', 'Per-session sponsorship', 'Annual cohort funding'],
    cta: 'Partner with us',
    bg: 'rgba(10, 31, 41, 1)',
    fg: '#fff',
    photoTone: 'deep',
    photoLabel: 'PARTNER · HANDSHAKE',
  },
];

function JoinIn() {
  const wrapRef = useRef(null);
  const progress = useScrollProgress(wrapRef);

  // Map scroll progress to active panel index (0, 1, 2)
  // 0.00 - 0.33  → 0
  // 0.33 - 0.66  → 1
  // 0.66 - 1.00  → 2
  const PANEL_COUNT = JOIN_PANELS.length;
  // Determine active and "intra-panel" sub-progress for crossfade
  const t = progress * PANEL_COUNT;
  const active = Math.min(PANEL_COUNT - 1, Math.floor(t));
  const localT = t - active; // 0..1 within current panel

  return (
    <section id="join" className="join-sec" ref={wrapRef}>
      <div className="join-pin">
        <div className="join-stage">
          {/* Active panel intro (left) */}
          {JOIN_PANELS.map((p, i) => {
            const isActive = i === active;
            const isPrev = i < active;

            // crossfade between adjacent
            let opacity = 0;
            let translateY = 40;
            let scale = 0.96;
            if (isActive) {
              // fade in at start, slight fade out near end
              const inFade = Math.min(1, localT / 0.18);
              const outFade = i < PANEL_COUNT - 1 ? Math.max(0, 1 - Math.max(0, (localT - 0.78) / 0.22)) : 1;
              opacity = inFade * outFade;
              translateY = (1 - inFade) * 40;
              scale = 0.96 + inFade * 0.04;
            } else if (i === active + 1) {
              // about to enter
              const k = Math.max(0, (localT - 0.78) / 0.22);
              opacity = k;
              translateY = (1 - k) * 40;
              scale = 0.96 + k * 0.04;
            } else if (isPrev) {
              opacity = 0;
            }

            return (
              <div
                key={p.n}
                className={'join-panel' + (isActive ? ' is-active' : '')}
                style={{
                  opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  pointerEvents: isActive ? 'auto' : 'none',
                  background: p.bg,
                  color: p.fg,
                }}
                aria-hidden={!isActive}
              >
                <div className="join-panel-grid">
                  <div className="join-panel-left">
                    <div className="join-panel-num">{p.n}</div>
                    <div className="join-panel-tag">{p.tag}</div>
                    <h3 className="join-panel-title">
                      {p.title.split(p.titleEm)[0]}<em>{p.titleEm}</em>{p.title.split(p.titleEm)[1]}
                    </h3>
                    <p className="join-panel-body">{p.body}</p>
                    <ul className="join-panel-bullets">
                      {p.bullets.map((b) => (
                        <li key={b}>
                          <span className="join-panel-tick">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a className="join-panel-cta">
                      {p.cta} <ArrowRight color="currentColor" size={16} />
                    </a>
                  </div>
                  <div className="join-panel-right">
                    <PhotoPlaceholder tone={p.photoTone} label={p.photoLabel} style={{ width: '100%', height: '100%' }} />
                    {/* Decorative overlay shapes per panel */}
                    <span className="join-panel-deco" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Persistent progress rail */}
        <div className="join-rail" aria-hidden="true">
          <div className="join-rail-label">JOIN IN · 26</div>
          <div className="join-rail-steps">
            {JOIN_PANELS.map((p, i) => (
              <div
                key={p.n}
                className={'join-rail-step'
                  + (i === active ? ' is-active' : '')
                  + (i < active ? ' is-done' : '')}
              >
                <span className="join-rail-num">{p.n}</span>
                <span className="join-rail-name">{p.tag.replace('FOR ', '')}</span>
              </div>
            ))}
          </div>
          <div className="join-rail-progress">
            <div className="join-rail-progress-bar" style={{ width: (progress * 100) + '%' }} />
          </div>
        </div>

        {/* Section title overlay */}
        <div className="join-overlay-head">
          <div className="sec-eyebrow" style={{ color: '#fff' }}>09 — Get involved</div>
          <h2 className="join-overlay-title">
            Three ways to <em>show up</em>.
          </h2>
        </div>
      </div>
    </section>
  );
}

/* === NEWSLETTER — Issue editorial, underlined input === */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && /^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail('');
    }
  };

  return (
    <section id="news" className="news-sec">
      <div className="news-grid">
        <div className="news-folio" data-reveal>
          <strong>10</strong>
          STAY<br />IN TOUCH
        </div>

        <div className="news-copy" data-reveal data-reveal-delay="1">
          <h2 className="news-title">
            Once a month. One <em>letter</em>. No spam.
          </h2>
          <p className="news-sub">
            Session recaps, mentor essays, and the new fields as they open.
            Unsubscribe in one click — promise.
          </p>
        </div>

        <form className="news-form" onSubmit={onSubmit} data-reveal data-reveal-delay="2">
          <label className="news-lab">YOUR EMAIL</label>
          <div className={'news-input-wrap' + (submitted ? ' is-success' : '')}>
            <input
              type="email"
              placeholder="you@university.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              {submitted ? '✓ SUBSCRIBED' : <>SUBSCRIBE <ArrowRight size={14} color="#d68307" /></>}
            </button>
          </div>
          <div className="news-foot">
            <span>· Free</span>
            <span>· No tracking</span>
            <span>· Once a month, max</span>
          </div>
        </form>
      </div>
    </section>
  );
}

Object.assign(window, { JoinIn, Newsletter });
