"use client";

import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';

export function Origin() {
  return (
    <section id="origin" className="origin">
      <div className="origin-inner">
        <div className="origin-grid">
          <div className="origin-photo-wrap" data-reveal data-reveal-delay="1">
            <div className="origin-photo">
              <PhotoPlaceholder tone="warm" label="DR. ASARE · FOUNDER" style={{ width: '100%', height: '100%' }}>
                <Portrait seed={1} bg="transparent" tone="#d68307" />
              </PhotoPlaceholder>
              <div className="origin-stamp">Founder<br />Est. 2024</div>
            </div>
            <span className="origin-deco-star" aria-hidden="true">✦</span>
            <span className="origin-deco-circle" aria-hidden="true" />
          </div>

          <div className="origin-text">
            <h3 className="origin-heading" data-reveal data-reveal-delay="2">
              Built by someone<br />who needed <em>this</em> first.
            </h3>

            <div className="origin-pull" data-reveal data-reveal-delay="3">
              &ldquo;I got into medical school and realised I had no idea what
              I&apos;d actually signed up for. The students who did? They all had
              someone in the field. CA360 is that someone — for everyone else.&rdquo;
            </div>

            <p className="origin-body" data-reveal data-reveal-delay="4">
              Too many students pick careers based on pressure, popularity, or
              a vague idea of what the job looks like. CA360 was built to change
              that — one honest conversation at a time. Started in 2024, we&apos;ve
              now reached 2,000+ students across Ghana with real talk from people
              already living the careers they&apos;re curious about.
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
