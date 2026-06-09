"use client";

import { useRef } from 'react';
import { useInView } from '../../hooks/ui-hooks';

export function Footer() {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { threshold: 0.1, once: false });
  // Word-by-word reveal for the mega line
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
        <div className="footer-col" data-reveal>
          <h4>Sitemap</h4>
          <ul>
            <li><a>Home</a></li>
            <li><a>About</a></li>
            <li><a>Mentors</a></li>
            <li><a>Membership</a></li>
            <li><a>The Blog</a></li>
            <li><a>Gallery</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>

        <div className="footer-col" data-reveal data-reveal-delay="1">
          <h4>Follow</h4>
          <ul>
            <li><a>Instagram <span className="footer-handle">@careerarcadia360</span></a></li>
            <li><a>LinkedIn <span className="footer-handle">/career-arcadia-360</span></a></li>
            <li><a>YouTube <span className="footer-handle">@CA360</span></a></li>
            <li><a>X / Twitter <span className="footer-handle">@CA_360</span></a></li>
            <li><a>TikTok <span className="footer-handle">@careerarcadia</span></a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>PRIVACY · TERMS · COOKIES</span>
      </div>
    </footer>
  );
}
