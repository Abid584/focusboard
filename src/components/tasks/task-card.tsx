"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { moveTask } from "@/actions/task.actions";
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  TASK_STATUSES,
  type TaskStatusValue,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { TaskItem } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { formatDate } from "@/lib/format";

export function TaskCard({
  task,
  projectId,
  overdue,
}: {
  task: TaskItem;
  projectId: string;
  overdue: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const index = TASK_STATUSES.indexOf(task.status);
  const previous = TASK_STATUSES[index - 1];
  const next = TASK_STATUSES[index + 1];

  function move(status: TaskStatusValue) {
    setError(null);
    startTransition(async () => {
      const result = await moveTask(task.id, status);
      if (result.error) setError(result.error);
    });
  }

  return (
    <Card className={cn("gap-3 py-4", pending && "opacity-60")}>
      <CardContent className="space-y-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium leading-snug">{task.title}</p>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              PRIORITY_STYLES[task.priority],
            )}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {task.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <p
            className={cn(
              "text-xs",
              overdue
                ? "font-medium text-destructive"
                : "text-muted-foreground",
            )}
          >
            {overdue ? "Overdue · " : "Due "}
            {formatDate(task.dueDate)}
          </p>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {previous && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                disabled={pending}
                onClick={() => move(previous)}
                aria-label={`Move to ${STATUS_LABELS[previous]}`}
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}
            {next && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                disabled={pending}
                onClick={() => move(next)}
                aria-label={`Move to ${STATUS_LABELS[next]}`}
              >
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-1">
            <TaskFormDialog
              projectId={projectId}
              task={task}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Edit task"
                >
                  <Pencil className="size-4" />
                </Button>
              }
            />
            <DeleteTaskDialog taskId={task.id} taskTitle={task.title} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
