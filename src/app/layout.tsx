import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserNav } from '@/components/user-nav';

export const metadata: Metadata = {
  title: 'KrishiMitra',
  description: 'AI-powered agricultural predictions',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background')}>
        <FirebaseClientProvider>
          <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
            <div className="container flex h-16 items-center">
              <Link href="/" className="mr-6 flex items-center">
                <Leaf className="h-6 w-6 text-white" />
                <span className="ml-2 text-xl font-bold">KrishiMitra</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/" className="transition-colors hover:text-white/80 text-white/90">Home</Link>
                <Link href="/predict" className="transition-colors hover:text-white/80 text-white/90">Predict</Link>
                <Link href="/about" className="transition-colors hover:text-white/80 text-white/90">About Us</Link>
                <Link href="/contact" className="transition-colors hover:text-white/80 text-white/90">Contact</Link>
              </nav>
              <div className="flex flex-1 items-center justify-end">
                <UserNav />
              </div>
            </div>
          </header>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
