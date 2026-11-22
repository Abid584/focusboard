import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <h1 className="text-2xl font-semibold">Project not found</h1>
      <p className="text-muted-foreground">
        It may have been deleted, or you don’t have access to it.
      </p>
      <Button asChild>
        <Link href="/projects">Back to projects</Link>
      </Button>
    </div>
  );
}
