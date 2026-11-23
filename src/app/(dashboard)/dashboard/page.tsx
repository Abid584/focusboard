import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/data/users";
import { requireUserId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards, StatsSkeleton } from "@/components/dashboard/stats-cards";

export const metadata: Metadata = { title: "Dashboard" };

async function Welcome() {
  const userId = await requireUserId();
  const user = await getCurrentUser(userId);
  return (
    <h1 className="text-2xl font-semibold tracking-tight">
      Welcome, {user?.name}
    </h1>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Suspense fallback={<Skeleton className="h-8 w-64" />}>
          <Welcome />
        </Suspense>
        <Button asChild variant="outline">
          <Link href="/tasks">View all tasks</Link>
        </Button>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
    </div>
  );
}
