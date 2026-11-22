import Link from "next/link";
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  type TaskPriorityValue,
  type TaskStatusValue,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type TaskListItemProps = {
  task: {
    id: string;
    title: string;
    status: TaskStatusValue;
    priority: TaskPriorityValue;
    dueDate: Date | null;
    project: { id: string; name: string };
  };
  overdue: boolean;
};

export function TaskListItem({ task, overdue }: TaskListItemProps) {
  return (
    <li className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <p className="truncate font-medium">{task.title}</p>
        <p className="text-sm text-muted-foreground">
          in{" "}
          <Link
            href={`/projects/${task.project.id}`}
            className="underline-offset-4 hover:underline"
          >
            {task.project.name}
          </Link>
          {task.dueDate && (
            <>
              {" · "}
              <span className={cn(overdue && "font-medium text-destructive")}>
                {overdue ? "Overdue · " : "Due "}
                {formatDate(task.dueDate)}
              </span>
            </>
          )}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {STATUS_LABELS[task.status]}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            PRIORITY_STYLES[task.priority],
          )}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
    </li>
  );
}
