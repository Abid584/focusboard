export const tags = {
  projects: (userId: string) => `projects-${userId}`,
  tasks: (projectId: string) => `tasks-${projectId}`,
  user: (userId: string) => `user-${userId}`,
} as const;
