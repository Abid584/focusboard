"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { changePassword, type SettingsFormState } from "@/actions/user.actions";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (prev: SettingsFormState, formData: FormData) => {
      const result = await changePassword(prev, formData);
      if (result?.success) toast.success("Password changed");
      return result;
    },
    undefined,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Use at least 8 characters with uppercase, lowercase and a special
          character.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
            <FieldError messages={state?.fieldErrors?.currentPassword} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
            />
            <FieldError messages={state?.fieldErrors?.newPassword} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
            <FieldError messages={state?.fieldErrors?.confirmPassword} />
          </div>
        </CardContent>
        <CardFooter className="mt-6">
          <Button type="submit" disabled={pending}>
            {pending ? "Updating..." : "Change password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
