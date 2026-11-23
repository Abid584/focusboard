import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/cache-tags";

export async function getCurrentUser(userId: string) {
  "use cache";
  cacheTag(tags.user(userId));

  return prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
}
