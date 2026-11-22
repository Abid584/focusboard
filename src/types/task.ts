import type { TaskPriorityValue, TaskStatusValue } from "@/lib/constants";

export type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusValue;
  priority: TaskPriorityValue;
  dueDate: Date | null;
};
