/* ============================================================
   07 — FAQ (split: left list / right answer) + FOOTER (reveal)
   ============================================================ */

const FAQS = [
  { id: 'who',  q: 'Who can attend a session?',
    a: 'Any SHS student, recent graduate, or first-year undergrad. The Medicine track is open to SHS-3 science students and first-/second-year medical students. We have never turned anyone away for being "not quite the right stage" — if the topic interests you, you belong in the room.',
    cat: 'STUDENTS' },
  { id: 'free', q: 'Is it really free? What\'s the catch?',
    a: 'Yes — free, always. There is no catch. Sessions are funded by partner schools, individual donors, and the mentors\' time. Our only ask is that you show up prepared, and that you pass what you learn on to one person behind you.',
    cat: 'COSTS' },
  { id: 'post', q: 'I\'m past SHS already. Still useful?',
    a: 'Absolutely. Roughly 40% of our community is in their first or second year of university, often re-evaluating their choice or planning for residency, internships, or grad school. The earlier the better — but it\'s never too late.',
    cat: 'STUDENTS' },
  { id: 'mentor', q: 'How do I become a mentor?',
    a: 'Fill in the mentor application (linked in the nav). We ask for a short bio, the track you\'d mentor in (Medicine for now), and your availability. We aim to respond within 14 days and pair you with a student within 30.',
    cat: 'MENTORS' },
  { id: 'school', q: 'Do you visit schools? Can mine host you?',
    a: 'Yes. We run in-person school visits termly, by invitation. A teacher, headteacher, or student rep can reach out via the Partner form. We bring 2-3 mentors, run a 90-120 minute session, and stay for an hour of open Q&A. Free for partner schools.',
    cat: 'SCHOOLS' },
  { id: 'tracks', q: 'When do Law, Engineering, Business open?',
    a: 'Law in Q2 2026, Engineering in Q4 2026, Business in 2027. Each opens only when we have at least 5 mentors who\'ve actually walked the path — we never run a track on theory alone. You can sign up for the waiting list any time.',
    cat: 'FIELDS' },
  { id: 'lang', q: 'Are sessions in English?',
    a: 'Yes — sessions run in English, though mentors regularly switch to Twi, Ga, Ewe, or Hausa during open Q&A when it helps a student think more clearly. Recordings are in English with captions.',
    cat: 'GENERAL' },
];

function FAQ() {
  const [active, setActive] = useState(0);
  const m = FAQS[active];

  return (
    <section id="faq" className="faq-sec">
      <div className="faq-head">
        <div className="sec-eyebrow" data-reveal>11 — Common questions</div>
        <h2 className="faq-title" data-reveal data-reveal-delay="1">
          Anything you wanted to <em>ask</em>.
        </h2>
        <p className="faq-sub" data-reveal data-reveal-delay="2">
          The questions students and mentors actually send us. Pick one on the
          left — the answer slides in on the right.
        </p>
      </div>

      <div className="faq-stage" data-reveal>
        {/* LEFT — list of questions */}
        <ol className="faq-list" role="tablist">
          {FAQS.map((f, i) => (
            <li
              key={f.id}
              className={'faq-item' + (i === active ? ' is-active' : '')}
              role="tab"
            >
              <button onClick={() => setActive(i)}>
                <span className="faq-item-n">0{i + 1}</span>
                <span className="faq-item-q">
                  {f.q}
                  <span className="faq-item-cat">{f.cat}</span>
                </span>
                <span className="faq-item-chev" aria-hidden="true">
                  <ArrowRight size={16} color="currentColor" />
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* RIGHT — answer card */}
        <div className="faq-answer">
          <div className="faq-answer-meta">
            <span className="faq-answer-n">0{active + 1} / 0{FAQS.length}</span>
            <span className="faq-answer-cat">{m.cat}</span>
          </div>
          <h3 className="faq-answer-q" key={'q-' + m.id}>
            {m.q}
          </h3>
          <p className="faq-answer-a" key={'a-' + m.id}>
            {m.a}
          </p>

          <div className="faq-answer-foot">
            <a className="faq-answer-link">
              Ask a follow-up question <ArrowRight size={14} color="#d68307" />
            </a>
            <span className="faq-answer-hint">
              Still stuck? <strong>hello@careerarcadia360.org</strong>
            </span>
          </div>

          {/* Big decorative number */}
          <span className="faq-answer-deco" aria-hidden="true">
            {('0' + (active + 1)).slice(-2)}
          </span>
        </div>
      </div>
    </section>
  );
}

/* === FOOTER — scroll-reveal mega text, then sitemap + social ===
   Removed Reach us + Programs columns per brief.                  */
function Footer() {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { threshold: 0.1, once: false });
  // Word-by-word reveal for the mega line
  const phrase = ['From', 'SHS,', 'somewhere', 'real.'];

  return (
    <footer className="footer-sec" ref={wrapRef}>
      <div className={'footer-mega' + (inView ? ' is-in' : '')}>
        {phrase.map((w, i) => (
          <span
            key={i}
            className={'footer-mega-word' + (w === 'somewhere' ? ' is-em' : '')}
            style={{ transitionDelay: (i * 110) + 'ms' }}
          >
            {w}
            <span className="footer-mega-word-stroke" />
          </span>
        ))}
      </div>

      <div className="footer-top">
        <div className="footer-brand" data-reveal>
          <LogoMark color="#fef9ee" accent="#d68307" size={40} />
          <h3>Career <em>Arcadia</em> 360</h3>
          <p>
            Bridging the gap between aspiring professionals and the knowledge
            they need to succeed. Built in Ghana — independent, free, year-round.
          </p>
          <a className="footer-newsletter">
            Subscribe to the journal <ArrowRight color="#d68307" size={14} />
          </a>
        </div>

        <div className="footer-col" data-reveal data-reveal-delay="1">
          <h4>Sitemap</h4>
          <ul>
            <li><a>Home</a></li>
            <li><a>About</a></li>
            <li><a>Mentors</a></li>
            <li><a>Membership</a></li>
            <li><a>The Journal</a></li>
            <li><a>Gallery</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>

        <div className="footer-col" data-reveal data-reveal-delay="2">
          <h4>Follow</h4>
          <ul>
            <li><a>Instagram <span className="footer-handle">@careerarcadia360</span></a></li>
            <li><a>LinkedIn <span className="footer-handle">/career-arcadia-360</span></a></li>
            <li><a>YouTube <span className="footer-handle">@CA360</span></a></li>
            <li><a>X / Twitter <span className="footer-handle">@CA_360</span></a></li>
            <li><a>TikTok <span className="footer-handle">@careerarcadia</span></a></li>
          </ul>
        </div>

        <div className="footer-col footer-col-cta" data-reveal data-reveal-delay="3">
          <h4>Ready?</h4>
          <a className="footer-cta-card">
            <span className="footer-cta-tag">FOR STUDENTS</span>
            <span className="footer-cta-line">Attend the next session</span>
            <span className="footer-cta-arrow"><ArrowRight color="#fff" size={16} /></span>
          </a>
          <a className="footer-cta-card footer-cta-card-alt">
            <span className="footer-cta-tag">FOR PROFESSIONALS</span>
            <span className="footer-cta-line">Become a mentor</span>
            <span className="footer-cta-arrow"><ArrowRight color="#0a1f29" size={16} /></span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CAREER ARCADIA 360 · A GHANAIAN NGO</span>
        <span className="footer-bottom-mid">EST. 2024 · ACCRA, GHANA · ISSUE 06</span>
        <span>PRIVACY · TERMS · COOKIES</span>
      </div>
    </footer>
  );
}

Object.assign(window, { FAQ, Footer });
