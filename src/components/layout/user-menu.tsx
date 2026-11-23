import { getCurrentUser } from "@/data/users";
import { logout } from "@/actions/auth.actions";
import { requireUserId } from "@/lib/session";
import { Button } from "@/components/ui/button";

export async function UserMenu() {
  const userId = await requireUserId();
  const user = await getCurrentUser(userId);

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {user?.name}
      </span>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm">
          Log out
        </Button>
      </form>
    </div>
  );
}
