import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Menu } from 'lucide-react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AuthGuard } from '@/components/auth-guard';

export const metadata: Metadata = {
  title: 'KrishiMitra',
  description: 'AI-powered agricultural predictions',
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/predict', label: 'Predict' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

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
          <AuthGuard>
            <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
              <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center">
                  <Leaf className="h-6 w-6 text-white" />
                  <span className="ml-2 text-xl font-bold">KrishiMitra</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="transition-colors hover:text-white/80 text-white/90">{link.label}</Link>
                  ))}
                </nav>
                <div className="flex flex-1 items-center justify-end gap-4">
                  <div className="hidden md:block">
                    <UserNav />
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6 text-white" />
                        <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle className="sr-only">KrishiMitra Menu</SheetTitle>
                      </SheetHeader>
                      <nav className="grid gap-6 text-lg font-medium mt-10">
                        {navLinks.map(link => (
                          <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">{link.label}</Link>
                        ))}
                      </nav>
                      <div className="absolute bottom-6 left-6">
                         <UserNav />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </header>
            {children}
            <Toaster />
          </AuthGuard>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
