'use client';

import { usePathname } from 'next/navigation';
import { StickyNav } from './StickyNav';
import { Footer } from './Footer';
import { GlobalReveal } from '../GlobalReveal';

export function SiteChrome({ children }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  return (
    <div id="root" className={'app-root' + (isStudio ? ' app-root--studio' : '')}>
      {!isStudio && <GlobalReveal />}
      {!isStudio && <StickyNav />}
      {children}
      {!isStudio && <Footer />}
    </div>
  );
}
