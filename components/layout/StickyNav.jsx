"use client";

import { useState, useEffect } from 'react';
import { LogoMark, ArrowRight } from '../shared/Icons';

const NAV_SECTIONS = [
  { id: 'home',       label: 'Home',        href: '#home' },
  { id: 'blog',       label: 'Journal',     href: '/journal' },
  { id: 'about',      label: 'About',       href: '/about' },
  { id: 'contact',    label: 'Contact Us',  href: '/contact' },
  { id: 'gallery',    label: 'Gallery',     href: '/gallery' },
  { id: 'mentorship', label: 'Mentorship',  href: '/mentorship' },
];

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [isHome, setIsHome] = useState(true);
  const [isMentorship, setIsMentorship] = useState(false);

  // Detect current page on mount — sets active state and home flag
  useEffect(() => {
    const path = window.location.pathname;
    setIsHome(path === '/');
    setIsMentorship(path.startsWith('/mentorship'));
    if (path === '/journal') setActive('blog');
    if (path === '/about') setActive('about');
    if (path === '/gallery') setActive('gallery');
    if (path === '/contact') setActive('contact');
    if (path.startsWith('/mentorship')) setActive('mentorship');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep Home active throughout the homepage; the section IDs are content anchors,
  // not separate destinations in the primary navigation.
  useEffect(() => {
    if (!isHome) return;
    const domIds = ['home', 'mission', 'join', 'gallery', 'contact'];
    const els = domIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(() => setActive('home'), { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

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

  const applyHref = isMentorship ? '/contact?type=student' : (isHome ? '#join' : '/#join');

  return (
    <nav className={'nav' + (scrolled ? ' is-scrolled' : '')}>
      <a className="nav-brand" href="/">
        <span className="nav-brand-mark">
          <LogoMark color="#fff" accent="#fff" size={22} />
        </span>
        <span className="nav-brand-text">
          Career Arcadia 360
          <small>Guiding futures, unlocking potential</small>
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
        <a className="btn btn-primary nav-cta" href={applyHref}>
          Apply <ArrowRight color="#0a1f29" size={14} />
        </a>
      </div>
    </nav>
  );
}
