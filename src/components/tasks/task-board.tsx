import { Plus } from "lucide-react";
import { STATUS_LABELS, TASK_STATUSES } from "@/lib/constants";
import type { TaskItem } from "@/types/task";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";

export function TaskBoard({
  projectId,
  tasks,
}: {
  projectId: string;
  tasks: TaskItem[];
}) {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);

        return (
          <section
            key={status}
            className="space-y-3 rounded-lg bg-muted/40 p-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                {STATUS_LABELS[status]}{" "}
                <span className="ml-1 font-normal text-muted-foreground">
                  {columnTasks.length}
                </span>
              </h2>
              <TaskFormDialog
                projectId={projectId}
                defaultStatus={status}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label={`Add task to ${STATUS_LABELS[status]}`}
                  >
                    <Plus className="size-4" />
                  </Button>
                }
              />
            </div>

            {columnTasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No tasks
              </p>
            ) : (
              columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  overdue={
                    status !== "DONE" &&
                    task.dueDate !== null &&
                    task.dueDate < startOfToday
                  }
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
