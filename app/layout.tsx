import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Business Plan & Targets Toolkit | Business Coaching Accelerator',
  description: 'A free, simple tool to sketch out your business plan and set monthly targets — from Business Coaching Accelerator.',
};

export const viewport: Viewport = {
  themeColor: '#4a2d7f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
