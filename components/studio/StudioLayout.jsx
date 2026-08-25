'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, LogoMark } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';

const NAV_ITEMS = [
  { href: '/studio', label: 'Today', note: 'Overview' },
  { href: '/studio/requests', label: 'Requests', note: 'Mentor introductions' },
  { href: '/studio/inbox', label: 'Inbox', note: 'Messages' },
  { href: '/studio/mentors', label: 'Mentors', note: 'People & specialties' },
  { href: '/studio/sessions', label: 'Sessions', note: 'Events & attendance' },
];

const COMING_ITEMS = [
  { href: '/studio/journal', label: 'Journal', note: 'Editorial desk' },
  { href: '/studio/content', label: 'Site content', note: 'Controlled copy' },
  { href: '/studio/media', label: 'Media', note: 'Approved assets' },
];

function isActive(pathname, href) {
  if (!pathname) return false;
  return href === '/studio' ? pathname === href : pathname.startsWith(href);
}

export function StudioLayout({ children, member }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.assign('/studio/login');
  };

  const closeMenu = () => setMenuOpen(false);
  const role = member?.role?.replace('_', ' ') || 'operator';

  return (
    <div className={`studio-app${menuOpen ? ' studio-app--menu-open' : ''}`}>
      <div className="studio-mobile-bar">
        <button type="button" className="studio-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="studio-sidebar">
          <span className="studio-menu-icon" aria-hidden="true"><i /><i /></span>
          <span>{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
        <a className="studio-mobile-brand" href="/studio" onClick={closeMenu}><LogoMark color="#fef9ee" accent="#d68307" size={21} /> CA360 Studio</a>
      </div>

      <aside className="studio-sidebar" id="studio-sidebar" aria-label="Studio navigation">
        <div className="studio-sidebar-head">
          <a className="studio-brand" href="/studio" onClick={closeMenu}>
            <span className="studio-brand-mark"><LogoMark color="#fef9ee" accent="#d68307" size={24} /></span>
            <span><strong>CA360</strong><small>STUDIO / CONTROL ROOM</small></span>
          </a>
          <span className="studio-status-line"><i aria-hidden="true" /> Workspace live</span>
        </div>

        <nav className="studio-nav" aria-label="Control room sections">
          <span className="studio-nav-label">WORKSPACE</span>
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className={`studio-nav-item${isActive(pathname, item.href) ? ' is-active' : ''}`} onClick={closeMenu}>
              <span className="studio-nav-marker" aria-hidden="true" />
              <span><strong>{item.label}</strong><small>{item.note}</small></span>
              <ArrowRight size={14} />
            </a>
          ))}
          <span className="studio-nav-label studio-nav-label--later">BUILDING NEXT</span>
          {COMING_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className={`studio-nav-item studio-nav-item--later${isActive(pathname, item.href) ? ' is-active' : ''}`} onClick={closeMenu}>
              <span className="studio-nav-marker" aria-hidden="true" />
              <span><strong>{item.label}</strong><small>{item.note}</small></span>
              <span className="studio-nav-soon">SOON</span>
            </a>
          ))}
        </nav>

        <div className="studio-sidebar-foot">
          <a className="studio-public-link" href="/" target="_blank" rel="noreferrer">View public site <ArrowRight size={14} /></a>
          <div className="studio-operator">
            <span className="studio-avatar" aria-hidden="true">{(member?.display_name || 'O').slice(0, 1).toUpperCase()}</span>
            <span><strong>{member?.display_name || 'CA360 operator'}</strong><small>{role}</small></span>
            <button type="button" onClick={logout} aria-label="Sign out">↗</button>
          </div>
        </div>
      </aside>

      {menuOpen && <button className="studio-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
      <div className="studio-main">
        <header className="studio-topbar">
          <div><span className="studio-topbar-kicker">CA360 / PRIVATE WORKSPACE</span><span className="studio-topbar-date">{new Intl.DateTimeFormat('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</span></div>
          <a href="/contact" target="_blank" rel="noreferrer">Public contact <ArrowRight size={13} /></a>
        </header>
        {children}
      </div>
    </div>
  );
}
