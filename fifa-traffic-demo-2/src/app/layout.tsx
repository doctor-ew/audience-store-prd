import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atlanta FIFA Navigator',
  description: 'Navigate Atlanta for FIFA World Cup 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
