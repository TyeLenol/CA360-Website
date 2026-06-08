/* ============================================================
   02 — MISSION (Manifesto) + ORIGIN (Playground)
   ============================================================ */

function Mission() {
  return (
    <section id="mission" className="mission">
      <div className="mission-label" data-reveal>
        <span className="mission-num">01 / MISSION</span>
        <span className="mission-tag">— What we exist for</span>
      </div>
      <p className="mission-text" data-reveal data-reveal-delay="1">
        We bridge the gap between aspiring professionals and the
        {' '}
        <mark className="mission-mark">knowledge</mark>
        {' '}
        they need to succeed — through honest mentorship, lived experience,
        and a community that <em>shows up</em>.
      </p>

      {/* Footer rail: brand promise + signature */}
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

function Origin() {
  return (
    <section id="origin" className="origin">
      <div className="origin-inner">
        <div className="sec-eyebrow" data-reveal>02 — Origin</div>

        <div className="origin-grid">
          <div className="origin-photo-wrap" data-reveal data-reveal-delay="1">
            <div className="origin-photo">
              <PhotoPlaceholder tone="warm" label="DR. ASARE · FOUNDER" style={{ width: '100%', height: '100%' }}>
                <Portrait seed={1} bg="transparent" tone="#d68307" />
              </PhotoPlaceholder>
              <div className="origin-stamp">Founder<br />Est. 2024</div>
            </div>
            {/* Decorative star sticker behind */}
            <span className="origin-deco-star" aria-hidden="true">✦</span>
            <span className="origin-deco-circle" aria-hidden="true" />
          </div>

          <div className="origin-text">
            <h3 className="origin-heading" data-reveal data-reveal-delay="2">
              Built by someone<br />who needed <em>this</em> first.
            </h3>

            <div className="origin-pull" data-reveal data-reveal-delay="3">
              &ldquo;Right after SHS, I didn&apos;t know what medicine actually
              looked like — only what people told me to chase. CA360 is the older
              sister I needed in that moment.&rdquo;
            </div>

            <p className="origin-body" data-reveal data-reveal-delay="4">
              A young Ghanaian medical doctor started CA360 with a single
              session for friends of friends. Five sessions later, with 300+
              students in, the dream is the same: nobody should have to guess
              what their career actually looks like before they walk into it.
            </p>

            <div className="origin-attr" data-reveal data-reveal-delay="5">
              <strong>Dr. A. Asare</strong>
              <span> · Founder &amp; Lead Mentor · Medicine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Mission, Origin });
