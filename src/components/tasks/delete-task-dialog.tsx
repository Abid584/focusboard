"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTask, TaskFormState } from "@/actions/task.actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteTaskDialog({
  taskId,
  taskTitle,
}: {
  taskId: string;
  taskTitle: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: TaskFormState, formData: FormData) => {
      const result = await deleteTask(prev, formData);
      if (result?.success) toast.success("Task deleted");
      return result;
    },
    undefined,
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Delete task"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{taskTitle}”?</AlertDialogTitle>
          <AlertDialogDescription>This can’t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <form action={formAction}>
          <input type="hidden" name="taskId" value={taskId} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Deleting..." : "Delete task"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
