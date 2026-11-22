import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("Usage: npx tsx prisma/seed.ts <user-email>");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`No user found with email ${email}`);

  const project = await prisma.project.create({
    data: {
      name: "Seed project",
      description: "Demo data for testing search and pagination",
      ownerId: user.id,
    },
  });

  const statuses = ["TODO", "IN_PROGRESS", "DONE"] as const;
  const priorities = ["LOW", "MEDIUM", "HIGH"] as const;

  await prisma.task.createMany({
    data: Array.from({ length: 25 }, (_, i) => ({
      title: `Sample task ${i + 1}`,
      description: i % 3 === 0 ? "Has a description for search tests" : null,
      status: statuses[i % 3],
      priority: priorities[i % 3],
      dueDate: new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000),
      position: i,
      projectId: project.id,
    })),
  });

  console.log(`Created project and 25 tasks for ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
