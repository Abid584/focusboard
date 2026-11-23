import { getProjects } from "@/data/projects";
import { requireUserId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const userId = await requireUserId();
  const projects = await getProjects(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Everything you’re working on, in one place.
          </p>
        </div>
        <ProjectFormDialog trigger={<Button>New project</Button>} />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
          <p className="font-medium">No projects yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first project to start organizing tasks.
          </p>
          <ProjectFormDialog trigger={<Button>Create project</Button>} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
