'use client';

import { useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GoogleAuthProvider, signInWithPopup, updateProfile, onAuthStateChanged, User, sendEmailVerification, signOut } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Chrome, Leaf, Loader2 } from 'lucide-react';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';


const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type FormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // This listener handles profile updates for newly created users.
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      // We only want to act if a user has just been created via email/password
      // and their profile needs to be updated. A null displayName is a good indicator.
      if (user && user.displayName === null && !user.photoURL) {
        const { name } = getValues();
        if (name) { // Ensure there's a name to set
          try {
            await updateProfile(user, { displayName: name });

            await sendEmailVerification(user);

            await signOut(auth); // Sign the user out immediately.

            toast({
              title: 'Verification Email Sent',
              description: "Please check your inbox to verify your email address before logging in.",
              duration: 5000,
            });
            
            router.push('/login');

          } catch (error: any) {
             toast({
              variant: 'destructive',
              title: 'Sign-up Failed',
              description: error.message || 'Could not complete the sign-up process.',
            });
          }
        }
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [auth, toast, getValues, router]);


  const onSubmit = (data: FormData) => {
    startTransition(() => {
      // This just initiates the creation. The onAuthStateChanged listener handles the post-creation logic.
      initiateEmailSignUp(auth, data.email, data.password);
      toast({
        title: 'Creating account...',
        description: 'Please wait while we set things up for you.',
      });
    });
  };

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        
        toast({
          title: 'Sign-up Successful',
          description: "You've been successfully signed up with Google.",
        });
      } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/operation-not-allowed') {
           toast({
            variant: 'destructive',
            title: 'Google Sign-In Not Enabled',
            description: "Please enable Google Sign-In in your Firebase project's authentication settings.",
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: error.message || 'An unexpected error occurred.',
          });
        }
      }
    });
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container relative flex h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542282246-137563567812?q=80&w=2070&auto=format&fit=crop)',
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Leaf className="mr-2 h-6 w-6" />
          KrishiMitra
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This tool has been a game-changer for our farm. The predictions are incredibly accurate and have saved us from potential disasters.&rdquo;
            </p>
            <footer className="text-sm">A Happy Farmer</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <div className={cn('grid gap-6')}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                 <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    disabled={isPending}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="px-1 text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isPending}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="px-1 text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={isPending}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="px-1 text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={handleGoogleSignIn}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Chrome className="mr-2 h-4 w-4" />
              )}{' '}
              Google
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign In
            </Link>
          </p>
           <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
