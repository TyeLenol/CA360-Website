"use client";

import { useState } from 'react';
import { ArrowRight } from '../shared/Icons';

export function Newsletter() {
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
