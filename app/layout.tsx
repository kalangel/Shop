import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Cursor from '@/components/ui/Cursor';

const displayFont = localFont({
  src: [
    { path: '../public/fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
});

const sansFont = localFont({
  src: [{ path: '../public/fonts/SpaceGrotesk.woff2', style: 'normal' }],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MONO® — Future Essentials',
  description:
    'Minimal clothing designed for everyday. An immersive study of fabric, weight and form.',
};

export const viewport: Viewport = {
  themeColor: '#0c0c0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="grain cursor-none-fine">
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
