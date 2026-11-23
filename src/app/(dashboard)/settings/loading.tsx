import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-xl space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-64" />
      <Skeleton className="h-80" />
    </div>
  );
}
