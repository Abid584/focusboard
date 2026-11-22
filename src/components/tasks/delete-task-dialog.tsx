"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTask } from "@/actions/task.actions";
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

export function DeleteTaskDialog({
  taskId,
  taskTitle,
}: {
  taskId: string;
  taskTitle: string;
}) {
  const [state, formAction, pending] = useActionState(deleteTask, undefined);

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
