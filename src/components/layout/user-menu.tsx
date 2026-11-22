import { auth } from "@/lib/auth";
import { logout } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export async function UserMenu() {
  const session = await auth();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {session?.user.name}
      </span>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm">
          Log out
        </Button>
      </form>
    </div>
  );
}
