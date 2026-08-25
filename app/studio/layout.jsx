export const metadata = {
  title: {
    default: 'CA360 Studio · Control Room',
    template: '%s · CA360 Studio',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioRootLayout({ children }) {
  return children;
}
