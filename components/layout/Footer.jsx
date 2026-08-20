"use client";

import { useRef } from 'react';
import { useInView } from '../../hooks/ui-hooks';
import { ArrowRight } from '../shared/Icons';

export function Footer() {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { threshold: 0.1, once: false });
  const phrase = ['Guiding', 'futures,', 'unlocking', 'potentials.'];

  return (
    <footer className="footer-sec" ref={wrapRef}>
      <div className={'footer-mega' + (inView ? ' is-in' : '')}>
        {phrase.map((w, i) => (
          <span
            key={i}
            className={'footer-mega-word' + (w === 'potentials.' ? ' is-em' : '')}
            style={{ transitionDelay: (i * 110) + 'ms' }}
          >
            {w}
            <span className="footer-mega-word-stroke" />
          </span>
        ))}
      </div>

      <div className="footer-top">
        <div className="footer-brand" data-reveal>
          <div className="sec-eyebrow" style={{ color: '#d68307' }}>Career Arcadia 360</div>
          <h3>Guiding futures,<br /><em>unlocking potential.</em></h3>
          <p>Honest career guidance and real mentors for students stepping into life after SHS.</p>
          <a className="footer-newsletter" href="/#news">
            Get the monthly letter <ArrowRight color="#d68307" size={14} />
          </a>
        </div>

        <div className="footer-col" data-reveal data-reveal-delay="1">
          <h4>Sitemap</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/mentorship">Mentorship</a></li>
            <li><a href="/contact?type=student">Start a conversation</a></li>
            <li><a href="/journal">Journal</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-follow-row">
        <div className="footer-col" data-reveal>
          <h4>Follow</h4>
          <ul>
            <li><a href="https://instagram.com/careerarcadia360">Instagram <span className="footer-handle">@careerarcadia360</span></a></li>
            <li><a href="https://linkedin.com/company/career-arcadia-360">LinkedIn <span className="footer-handle">/career-arcadia-360</span></a></li>
            <li><a href="https://youtube.com/@CA360">YouTube <span className="footer-handle">@CA360</span></a></li>
            <li><a href="https://x.com/CA_360">X / Twitter <span className="footer-handle">@CA_360</span></a></li>
            <li><a href="https://tiktok.com/@careerarcadia">TikTok <span className="footer-handle">@careerarcadia</span></a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>PRIVACY · TERMS · COOKIES</span>
      </div>
    </footer>
  );
}
