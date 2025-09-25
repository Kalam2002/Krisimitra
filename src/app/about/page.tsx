import Image from 'next/image';
import { Target, Users, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  {
    name: 'Piyush Das',
    avatar: 'https://i.ibb.co/b5h5Dpj3/piyush.jpg',
    initials: 'PD',
  },
  {
    name: 'Anusha Sekhar',
    avatar: 'https://i.ibb.co/chg5KDBP/Screenshot-2025-09-26-001614.png',
    initials: 'AS',
  },
  {
    name: 'Abdul Kalam',
    avatar: 'https://i.ibb.co/xQCFwVz/Screenshot-2025-09-16-0108442.png',
    initials: 'AK',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  About KrishiMitra
                </h1>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  Empowering farmers with cutting-edge AI technology to protect crops and enhance agricultural productivity
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="mission" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Mission</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  To revolutionize agriculture by making advanced crop disease detection technology accessible to every farmer, ensuring food security and sustainable farming practices.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-12 sm:grid-cols-3 md:gap-16 lg:max-w-none lg:grid-cols-3 pt-16">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/50">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Leveraging cutting-edge AI technology to provide accurate and timely crop disease detection.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/50">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Making advanced agricultural technology available to farmers of all scales.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/50">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  Promoting sustainable farming practices for a better future.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Team</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
              {teamMembers.map((member) => (
                <Card key={member.name} className="h-full">
                  <CardContent className="flex flex-col items-center gap-4 text-center p-6 pt-12">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <h3 className="text-lg font-bold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
