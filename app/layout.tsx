import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Shardul Jadhav — Software Engineer',
  description: 'Backend by trade. Frontend by heart.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Manrope:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Manrope:wght@300;400;500;600;700&display=swap"
        />
        {/* <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
        /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}
