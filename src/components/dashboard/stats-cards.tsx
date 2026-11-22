import { getDashboardStats } from "@/data/stats";
import { requireUserId } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export async function StatsCards() {
  const userId = await requireUserId();

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const stats = await getDashboardStats(userId, startOfToday.toISOString());
  const completion =
    stats.total === 0
      ? 0
      : Math.round((stats.byStatus.DONE / stats.total) * 100);

  const cards = [
    { label: "Projects", value: stats.projects, alert: false },
    { label: "Total tasks", value: stats.total, alert: false },
    { label: "In progress", value: stats.byStatus.IN_PROGRESS, alert: false },
    { label: "Overdue", value: stats.overdue, alert: stats.overdue > 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="gap-2 py-4">
            <CardHeader className="px-4 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <p
                className={cn(
                  "text-3xl font-semibold",
                  card.alert && "text-destructive",
                )}
              >
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-3 py-4">
        <CardContent className="space-y-2 px-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Completion</span>
            <span className="text-muted-foreground">
              {stats.byStatus.DONE} of {stats.total} tasks done ({completion}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-20" />
    </div>
  );
}
