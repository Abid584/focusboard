"use client";

import { useActionState, useState } from "react";
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/actions/project.actions";
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

type ProjectData = { id: string; name: string; description: string | null };

function ProjectForm({
  project,
  onSuccess,
}: {
  project?: ProjectData;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: ProjectFormState, formData: FormData) => {
      const result = project
        ? await updateProject(prev, formData)
        : await createProject(prev, formData);
      if (result?.success) onSuccess();
      return result;
    },
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {project && <input type="hidden" name="projectId" value={project.id} />}

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={state?.values?.name ?? project?.name}
          required
        />
        {state?.fieldErrors?.name && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={
            state?.values?.description ?? project?.description ?? ""
          }
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : project ? "Save changes" : "Create project"}
      </Button>
    </form>
  );
}

export function ProjectFormDialog({
  project,
  trigger,
}: {
  project?: ProjectData;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Update the name or description."
              : "Give your project a name to get started."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
