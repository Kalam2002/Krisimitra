"use client";

import { useUser } from "@/firebase/auth/use-user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const publicPaths = ["/login", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading) {
      const isPublicPath = publicPaths.includes(pathname);

      if (!user && !isPublicPath) {
        router.push("/login");
      } else if (user && isPublicPath) {
        router.push("/");
      }
    }
  }, [isUserLoading, user, pathname, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
