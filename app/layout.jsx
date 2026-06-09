import './globals.css';
import { StickyNav } from '../components/layout/StickyNav';
import { Footer } from '../components/layout/Footer';
import { GlobalReveal } from '../components/GlobalReveal';

export const metadata = {
  title: 'Career Arcadia 360',
  description: 'Mentorship that shows up',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root" className="app-root">
          <GlobalReveal />
          <StickyNav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
