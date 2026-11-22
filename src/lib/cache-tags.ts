export const tags = {
  projects: (userId: string) => `projects-${userId}`,
  tasks: (projectId: string) => `tasks-${projectId}`,
} as const;
