/* ============================================================
   03 — FIELDS TIMELINE + PROGRAMS (alternating beeline)
   ============================================================ */

/* === FIELDS — Issue-style horizontal timeline === */
function Fields() {
  const fields = [
    { id: 1, active: true,  name: 'Medicine',    stage: '● 2024 · LIVE NOW',  yr: 'COHORT 06 OPEN',
      desc: 'SHS to med school. Admissions, study technique, life beyond the white coat.' },
    { id: 2, active: false, name: 'Law',         stage: 'Q2 2026',            yr: 'COMING SOON',
      desc: 'Pre-law preparation, faculty navigation, building a public voice.' },
    { id: 3, active: false, name: 'Engineering', stage: 'Q4 2026',            yr: 'PLANNED',
      desc: 'Choosing a track, the maths, internships and the first job.' },
    { id: 4, active: false, name: 'Business',    stage: '2027',               yr: 'PLANNED',
      desc: 'Founders, finance, consulting and the underrated paths between.' },
  ];

  return (
    <section id="fields" className="fields-sec">
      <div className="fields-head">
        <div className="sec-eyebrow" data-reveal>03 — The roadmap</div>
        <h2 className="fields-title" data-reveal data-reveal-delay="1">
          One field <em>live</em>.<br />Three on the runway.
        </h2>
        <p className="fields-note" data-reveal data-reveal-delay="2">
          We grow depth-first. A new field opens only when we have mentors who&apos;ve
          actually lived it — never before.
        </p>
      </div>

      <div className="fields-grid">
        {fields.map((f, i) => (
          <div
            key={f.id}
            className={'fields-card' + (f.active ? ' is-active' : '')}
            data-reveal data-reveal-delay={i + 1}
          >
            <div className="fields-stage">{f.stage}</div>
            <h3 className="fields-name">
              {f.active ? f.name : <em>{f.name}</em>}
            </h3>
            <p className="fields-desc">{f.desc}</p>
            <div className="fields-yr">{f.yr}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* === PROGRAMS — Issue style with alternating beeline ===
   Cards alternate left/right, connected by an orange dashed
   "beeline" that draws as each card enters view.            */
function Programs() {
  const programs = [
    { n: '01', side: 'left',  tag: 'CORE · MONTHLY',
      title: 'Virtual sessions',
      desc: 'Live cohort calls with doctors, students and admissions officers, every six weeks. Bring your questions, walk out with a plan.',
      bullets: ['90-minute live calls', 'Open Q&A with mentors', 'Recordings stay free'] },
    { n: '02', side: 'right', tag: 'CORE · ROLLING',
      title: '1:1 mentorship matching',
      desc: 'Paired with a mentor who walked your exact path two or three years before you — same school, same field, similar starting point.',
      bullets: ['Hand-matched within 14 days', '3-month minimum', 'Voice notes, calls, WhatsApp'] },
    { n: '03', side: 'left',  tag: 'IN PERSON',
      title: 'School visits',
      desc: 'In-person sessions inside SHS classrooms and university lecture halls — by invitation from a teacher, dean, or student rep.',
      bullets: ['Half-day or full-day', 'Open to all forms', 'Free for partner schools'] },
    { n: '04', side: 'right', tag: 'OPEN ACCESS',
      title: 'Resource hub',
      desc: 'Guides, recorded sessions and reading lists that stay free forever. Built from every session we&apos;ve ever run.',
      bullets: ['Recorded session library', 'Field-specific reading lists', 'Application timelines'] },
  ];

  return (
    <section id="programs" className="programs-sec">
      <div className="programs-head">
        <div className="sec-eyebrow" data-reveal>04 — What we do</div>
        <h2 className="programs-title" data-reveal data-reveal-delay="1">
          Four ways mentorship<br /><em>actually</em> happens.
        </h2>
      </div>

      <div className="programs-track">
        {/* Vertical center spine (decorative) */}
        <div className="programs-spine" aria-hidden="true" />

        {programs.map((p, i) => (
          <div
            key={p.n}
            className={'programs-row programs-row-' + p.side}
            data-reveal
          >
            <div className="programs-pin" aria-hidden="true">
              <span className="programs-pin-num">{p.n}</span>
            </div>

            <div className="programs-card">
              <span className="programs-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <ul className="programs-bullets">
                {p.bullets.map((b) => (
                  <li key={b}>
                    <span className="programs-bullet-tick" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l4 4L19 6" stroke="#d68307" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <a className="programs-more">
                Learn more <ArrowRight size={14} />
              </a>
            </div>

            {/* Beeline — dashed orange path connecting to next card */}
            {i < programs.length - 1 && (
              <svg className="programs-beeline" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
                {p.side === 'left' ? (
                  <path d="M 30 20 C 30 100, 370 120, 370 200" fill="none"
                        stroke="#d68307" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray="3 12" />
                ) : (
                  <path d="M 370 20 C 370 100, 30 120, 30 200" fill="none"
                        stroke="#d68307" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray="3 12" />
                )}
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Fields, Programs });
