import './globals.css';
import { SiteChrome } from '../components/layout/SiteChrome';

export const metadata = {
  title: {
    default: 'Career Arcadia 360 — Mentorship that shows up',
    template: '%s · Career Arcadia 360',
  },
  description: 'Career Arcadia 360 connects Ghanaian students with mentors, career conversations, and practical guidance for the path ahead.',
  openGraph: {
    title: 'Career Arcadia 360 — Mentorship that shows up',
    description: 'Career conversations, mentors, and a clearer path for Ghanaian students and young professionals.',
    type: 'website',
  },
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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
