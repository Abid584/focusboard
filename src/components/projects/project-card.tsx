import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    _count: { tasks: number };
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const count = project._count.tasks;
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="truncate">{project.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {project.description ?? "No description"}
          </CardDescription>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          {count} {count === 1 ? "task" : "tasks"}
        </CardFooter>
      </Card>
    </Link>
  );
}
