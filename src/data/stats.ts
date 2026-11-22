import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/cache-tags";

export async function getDashboardStats(userId: string, todayIso: string) {
  "use cache";
  cacheTag(tags.projects(userId));

  const owned = { project: { ownerId: userId } };

  const [grouped, overdue, projects] = await Promise.all([
    prisma.task.groupBy({
      by: ["status"],
      where: owned,
      _count: { _all: true },
    }),
    prisma.task.count({
      where: {
        ...owned,
        status: { not: "DONE" },
        dueDate: { lt: new Date(todayIso) },
      },
    }),
    prisma.project.count({ where: { ownerId: userId } }),
  ]);

  const byStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  for (const row of grouped) byStatus[row.status] += row._count._all;
  const total = byStatus.TODO + byStatus.IN_PROGRESS + byStatus.DONE;

  return { total, byStatus, overdue, projects };
}
