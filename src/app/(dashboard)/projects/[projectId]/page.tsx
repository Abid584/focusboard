import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/data/projects";
import { getTasks } from "@/data/tasks";
import { requireUserId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const userId = await requireUserId();

  const [project, tasks] = await Promise.all([
    getProject(userId, projectId),
    getTasks(userId, projectId),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <p className="text-muted-foreground">
            {project.description ?? "No description"}
          </p>
        </div>
        <div className="flex gap-2">
          <TaskFormDialog
            projectId={project.id}
            trigger={<Button>New task</Button>}
          />
          <ProjectFormDialog
            project={project}
            trigger={<Button variant="outline">Edit</Button>}
          />
          <DeleteProjectDialog
            projectId={project.id}
            projectName={project.name}
          />
        </div>
      </div>

      <TaskBoard projectId={project.id} tasks={tasks} />
    </div>
  );
}
