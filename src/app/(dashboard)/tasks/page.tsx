import { getProjects } from "@/data/projects";
import { searchTasks } from "@/data/tasks";
import { first } from "@/lib/utils";
import { requireUserId } from "@/lib/session";
import { taskFiltersSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { TaskFilterBar } from "@/components/tasks/task-filter-bar";
import { TaskListItem } from "@/components/tasks/task-list-item";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Pagination, buildHref } from "@/components/tasks/pagination";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const userId = await requireUserId();
  const sp = await searchParams;

  const filters = taskFiltersSchema.parse({
    q: first(sp.q),
    status: first(sp.status),
    priority: first(sp.priority),
    projectId: first(sp.project),
    page: first(sp.page),
  });

  const [result, projects] = await Promise.all([
    searchTasks(userId, filters),
    getProjects(userId),
  ]);
  if (filters.page > result.page) {
    redirect(
      buildHref(
        {
          q: filters.q,
          status: filters.status,
          priority: filters.priority,
          project: filters.projectId,
        },
        result.page,
      ),
    );
  }

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const hasFilters = Boolean(
    filters.q || filters.status || filters.priority || filters.projectId,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Every task across all your projects.
        </p>
      </div>

      <TaskFilterBar filters={filters} projects={projects} />

      {result.tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
          <p className="font-medium">
            {hasFilters ? "No tasks match your filters" : "No tasks yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? "Try a different search or clear the filters."
              : "Open a project and add your first task."}
          </p>
          <Button asChild variant="outline">
            <Link href={hasFilters ? "/tasks" : "/projects"}>
              {hasFilters ? "Reset filters" : "Go to projects"}
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {result.tasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                overdue={
                  task.status !== "DONE" &&
                  task.dueDate !== null &&
                  task.dueDate < startOfToday
                }
              />
            ))}
          </ul>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            params={{
              q: filters.q,
              status: filters.status,
              priority: filters.priority,
              project: filters.projectId,
            }}
          />
        </>
      )}
    </div>
  );
}
