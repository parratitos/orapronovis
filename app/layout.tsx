import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ora Pro Novis',
  description: 'Calendario colaborativo para programar oraciones en línea.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
