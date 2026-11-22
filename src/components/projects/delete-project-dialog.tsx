"use client";

import { useActionState } from "react";
import { deleteProject } from "@/actions/project.actions";
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

export function DeleteProjectDialog({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [state, formAction, pending] = useActionState(deleteProject, undefined);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{projectName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the project and all of its tasks. This
            can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <form action={formAction}>
          <input type="hidden" name="projectId" value={projectId} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Deleting..." : "Delete project"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
