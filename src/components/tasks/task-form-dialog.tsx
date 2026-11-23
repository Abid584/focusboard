"use client";

import { useActionState, useState } from "react";
import {
  createTask,
  updateTask,
  type TaskFormState,
} from "@/actions/task.actions";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskStatusValue,
} from "@/lib/constants";
import type { TaskItem } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30";

function toDateInput(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

function TaskForm({
  projectId,
  task,
  defaultStatus,
  onSuccess,
}: {
  projectId: string;
  task?: TaskItem;
  defaultStatus: TaskStatusValue;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: TaskFormState, formData: FormData) => {
      const result = task
        ? await updateTask(prev, formData)
        : await createTask(prev, formData);
      if (result?.success) {
        toast.success(task ? "Task updated" : "Task created");
        onSuccess();
      }
      return result;
    },
    undefined,
  );
  const v = state?.values;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      {task && <input type="hidden" name="taskId" value={task.id} />}

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={v?.title ?? task?.title}
          required
        />
        {state?.fieldErrors?.title && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.title[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={v?.description ?? task?.description ?? ""}
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className={selectClass}
            defaultValue={v?.status ?? task?.status ?? defaultStatus}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            className={selectClass}
            defaultValue={v?.priority ?? task?.priority ?? "MEDIUM"}
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date (optional)</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          defaultValue={v?.dueDate ?? toDateInput(task?.dueDate ?? null)}
        />
        {state?.fieldErrors?.dueDate && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.dueDate[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : task ? "Save changes" : "Create task"}
      </Button>
    </form>
  );
}

export function TaskFormDialog({
  projectId,
  task,
  defaultStatus = "TODO",
  trigger,
}: {
  projectId: string;
  task?: TaskItem;
  defaultStatus?: TaskStatusValue;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update the task details." : "Add a task to this project."}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          projectId={projectId}
          task={task}
          defaultStatus={defaultStatus}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
