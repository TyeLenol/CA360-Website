"use client";

import { useState, useEffect } from 'react';
import { LogoMark, ArrowRight } from '../shared/Icons';

const NAV_SECTIONS = [
  { id: 'home',       label: 'Home',        href: '#home' },
  { id: 'blog',       label: 'Blog',        href: '/journal' },
  { id: 'about',      label: 'About',       href: '#mission' },
  { id: 'contact',    label: 'Contact Us',  href: '#contact' },
  { id: 'gallery',    label: 'Gallery',     href: '#gallery' },
  { id: 'mentorship', label: 'Mentorship',  href: '#join' },
];

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [mode, setMode] = useState('light');
  const [isHome, setIsHome] = useState(true);

  // Detect current page on mount — sets active state and home flag
  useEffect(() => {
    const path = window.location.pathname;
    setIsHome(path === '/');
    if (path === '/journal') setActive('blog');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy only runs on homepage where section IDs exist
  useEffect(() => {
    const domIds = ['home', 'mission', 'join', 'gallery', 'contact'];
    const els = domIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      let best = null;
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
      });
      if (best) setActive(best.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // On non-home pages, turn #hash links into /#hash so the browser navigates home first
  const getHref = (s) => {
    if (!s.href.startsWith('#')) return s.href;
    return isHome ? s.href : '/' + s.href;
  };

  const jump = (s) => (e) => {
    if (!s.href.startsWith('#')) return;
    if (!isHome) return; // let /#mission navigate naturally
    e.preventDefault();
    const el = document.getElementById(s.href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const applyHref = isHome ? '#join' : '/#join';

  return (
    <nav className={'nav' + (scrolled ? ' is-scrolled' : '')}>
      <a className="nav-brand" href="/">
        <span className="nav-brand-mark">
          <LogoMark color="#fff" accent="#fff" size={22} />
        </span>
        <span className="nav-brand-text">
          Career Arcadia 360
          <small>mentorship that shows up</small>
        </span>
      </a>

      <div className="nav-pill">
        {NAV_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={getHref(s)}
            className={'nav-link' + (active === s.id ? ' is-active' : '')}
            onClick={jump(s)}
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="nav-actions">
        <button
          className="nav-mode"
          onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          aria-label="Toggle mode (decorative)"
          title="Mode toggle — decorative for now"
        >
          <span className={mode === 'light' ? 'on' : ''}>☀</span>
          <span className={mode === 'dark' ? 'on' : ''}>☾</span>
        </button>
        <a className="btn btn-primary nav-cta" href={applyHref}>
          Apply <ArrowRight color="#fff" size={14} />
        </a>
      </div>
    </nav>
  );
}
