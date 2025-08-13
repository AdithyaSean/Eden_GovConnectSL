
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import DevDebugPanel from "@/components/dev-debug-panel";

export const metadata: Metadata = {
  title: 'GovConnect SL',
  description: 'GovConnect SL: Your one-stop platform for government services in Sri Lanka.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
          {children}
          <Toaster />
          <DevDebugPanel />
      </body>
    </html>
  );
}
