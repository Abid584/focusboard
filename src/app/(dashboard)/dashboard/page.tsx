import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards, StatsSkeleton } from "@/components/dashboard/stats-cards";

async function Welcome() {
  const session = await auth();
  return (
    <h1 className="text-2xl font-semibold tracking-tight">
      Welcome, {session?.user.name}
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
