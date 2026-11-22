import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/cache-tags";

export async function getProjects(userId: string) {
  "use cache";
  cacheTag(tags.projects(userId));

  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      _count: { select: { tasks: true } },
    },
  });
}

export async function getProject(userId: string, projectId: string) {
  "use cache";
  cacheTag(tags.projects(userId));

  return prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true, name: true, description: true },
  });
}
