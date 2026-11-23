import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/data/users";
import { requireUserId } from "@/lib/session";
import { PasswordForm } from "@/components/forms/password-form";
import { ProfileForm } from "@/components/forms/profile-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = await getCurrentUser(userId);
  if (!user) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details and password.
        </p>
      </div>
      <ProfileForm name={user.name} email={user.email} />
      <PasswordForm />
    </div>
  );
}
