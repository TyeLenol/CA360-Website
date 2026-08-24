"use client";

import { useState } from 'react';
import { ArrowRight } from '../shared/Icons';

export function NewsletterSignup({ contact = false }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputId = contact ? 'contact-newsletter-email' : 'newsletter-email';

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && /^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail('');
    }
  };

  return (
    <form className={'news-form' + (contact ? ' news-form--contact' : '')} onSubmit={onSubmit}>
      <label className="news-lab" htmlFor={inputId}>YOUR EMAIL</label>
      <div className={'news-input-wrap' + (submitted ? ' is-success' : '')}>
        <input
          id={inputId}
          type="email"
          placeholder="you@university.edu.gh"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" aria-label="Subscribe">
          {submitted ? 'SUBSCRIBED' : <>SUBSCRIBE <ArrowRight size={14} color="#d68307" /></>}
        </button>
      </div>
    </form>
  );
}

export function Newsletter() {
  return (
    <section id="news" className="news-sec">
      <div className="news-grid">
        <div className="news-copy" data-reveal>
          <h2 className="news-title">
            Once a month. One <em>letter</em>. No spam.
          </h2>
          <p className="news-sub">
            Session recaps, mentor essays, and the new fields as they open.
            Unsubscribe in one click — promise.
          </p>
        </div>

        <NewsletterSignup />
      </div>
    </section>
  );
}

export function ContactNewsletter() {
  return (
    <section className="ct-newsletter" id="newsletter" data-reveal aria-labelledby="ct-newsletter-title">
      <div className="ct-newsletter-copy">
        <h2 id="ct-newsletter-title">Keep the useful things <em>coming.</em></h2>
        <p>One calm email a month with session recaps, mentor notes, and practical career guidance.</p>
      </div>
      <NewsletterSignup contact />
    </section>
  );
}
