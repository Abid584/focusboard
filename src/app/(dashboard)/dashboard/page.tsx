import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { logout } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

async function Welcome() {
  const session = await auth();
  return (
    <h1 className="text-2xl font-semibold">Welcome, {session?.user.name}</h1>
  );
}

export default function DashboardPage() {
  return (
    <main className="space-y-6 p-8">
      <Suspense fallback={<p>Loading...</p>}>
        <Welcome />
      </Suspense>
      <form action={logout}>
        <Button type="submit" variant="outline">
          Log out
        </Button>
      </form>
    </main>
  );
}
