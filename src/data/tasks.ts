import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/cache-tags";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import type { TaskFilters } from "@/lib/validations";

export async function getTasks(userId: string, projectId: string) {
  "use cache";
  cacheTag(tags.tasks(projectId));

  return prisma.task.findMany({
    where: { projectId, project: { ownerId: userId } },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
    },
  });
}

export async function searchTasks(userId: string, filters: TaskFilters) {
  "use cache";
  cacheTag(tags.projects(userId));

  const where = {
    project: {
      ownerId: userId,
      ...(filters.projectId ? { id: filters.projectId } : {}),
    },
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" as const } },
            {
              description: {
                contains: filters.q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
  };

  const total = await prisma.task.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / TASKS_PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: (page - 1) * TASKS_PAGE_SIZE,
    take: TASKS_PAGE_SIZE,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      project: { select: { id: true, name: true } },
    },
  });

  return { tasks, total, totalPages, page };
}
