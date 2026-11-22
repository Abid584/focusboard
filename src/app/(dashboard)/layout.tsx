import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "@/components/layout/user-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="font-semibold">
              FocusBoard
            </Link>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-foreground"
            >
              Projects
            </Link>
            <Link
              href="/tasks"
              className="text-muted-foreground hover:text-foreground"
            >
              Tasks
            </Link>
          </nav>
          <Suspense fallback={<div className="h-8 w-32" />}>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
