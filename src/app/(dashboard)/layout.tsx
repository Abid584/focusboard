import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

const navLink = "text-muted-foreground transition-colors hover:text-foreground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      <header className="border-b">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/dashboard" className="font-semibold">
            FocusBoard
          </Link>

          <nav
            aria-label="Main"
            className="order-3 flex w-full gap-5 text-sm font-medium sm:order-none sm:w-auto sm:flex-1"
          >
            <Link href="/dashboard" className={navLink}>
              Dashboard
            </Link>
            <Link href="/projects" className={navLink}>
              Projects
            </Link>
            <Link href="/tasks" className={navLink}>
              Tasks
            </Link>
            <Link href="/settings" className={navLink}>
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Suspense fallback={<div className="h-8 w-20" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
