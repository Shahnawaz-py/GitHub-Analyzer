import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'GitHub Analyzer Pro | Developer Profiling & Repository Intelligence',
  description:
    'Comprehensive GitHub profile intelligence, repository health scoring, language analytics, and developer showdown powered by Next.js & Express.',
  keywords: [
    'GitHub Analyzer',
    'Developer Portfolio',
    'GitHub Metrics',
    'Repository Health',
    'DevScore',
    'Developer Intelligence',
  ],
  authors: [{ name: 'GitHub Analyzer Team' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
