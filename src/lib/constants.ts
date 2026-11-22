export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export type TaskStatusValue = (typeof TASK_STATUSES)[number];
export type TaskPriorityValue = (typeof TASK_PRIORITIES)[number];

export const STATUS_LABELS: Record<TaskStatusValue, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const PRIORITY_LABELS: Record<TaskPriorityValue, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const PRIORITY_STYLES: Record<TaskPriorityValue, string> = {
  LOW: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  MEDIUM:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export const TASKS_PAGE_SIZE = 10;
