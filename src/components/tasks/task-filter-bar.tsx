import Link from "next/link";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/constants";
import type { TaskFilters } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

export function TaskFilterBar({
  filters,
  projects,
}: {
  filters: TaskFilters;
  projects: { id: string; name: string }[];
}) {
  return (
    <form
      action="/tasks"
      method="get"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"
    >
      <Input
        name="q"
        placeholder="Search tasks..."
        defaultValue={filters.q}
        aria-label="Search tasks"
      />
      <NativeSelect
        name="status"
        defaultValue={filters.status}
        aria-label="Status"
      >
        <option value="">All statuses</option>
        {TASK_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        name="priority"
        defaultValue={filters.priority}
        aria-label="Priority"
      >
        <option value="">All priorities</option>
        {TASK_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        name="project"
        defaultValue={filters.projectId}
        aria-label="Project"
      >
        <option value="">All projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </NativeSelect>
      <div className="flex gap-2">
        <Button type="submit">Apply</Button>
        <Button asChild variant="ghost">
          <Link href="/tasks">Reset</Link>
        </Button>
      </div>
    </form>
  );
}
