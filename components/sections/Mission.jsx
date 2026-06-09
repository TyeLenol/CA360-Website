"use client";

export function Mission() {
  return (
    <section id="mission" className="mission">
      <div className="mission-label" data-reveal>
        <span className="mission-num">01 / MISSION</span>
        <span className="mission-tag">— What we exist for</span>
      </div>
      <p className="mission-text" data-reveal data-reveal-delay="1">
        We bridge the gap between aspiring professionals and the{' '}
        <mark className="mission-mark">knowledge</mark>{' '}
        they need to succeed — through honest mentorship, lived experience,
        and a community that <em>shows up</em>.
      </p>

      <div className="mission-foot" data-reveal data-reveal-delay="2">
        <div>
          <div className="mission-foot-lab">SINCE 2024 · GHANA</div>
          <div className="mission-foot-val">Built for SHS graduates &amp; undergrads.</div>
        </div>
        <div>
          <div className="mission-foot-lab">RUN BY</div>
          <div className="mission-foot-val">Young Ghanaian doctors &amp; alumni.</div>
        </div>
        <div>
          <div className="mission-foot-lab">FREE TO ATTEND</div>
          <div className="mission-foot-val">Online &amp; in person, always.</div>
        </div>
      </div>
    </section>
  );
}
