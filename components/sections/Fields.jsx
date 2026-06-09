"use client";

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

export function Fields() {
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
            data-reveal
            data-reveal-delay={i + 1}
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
