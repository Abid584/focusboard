"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { updateProfile, type SettingsFormState } from "@/actions/user.actions";
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

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction, pending] = useActionState(
    async (prev: SettingsFormState, formData: FormData) => {
      const result = await updateProfile(prev, formData);
      if (result?.success) toast.success("Profile updated");
      return result;
    },
    undefined,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update how your name appears in the app.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              defaultValue={state?.values?.name ?? name}
              required
            />
            <FieldError messages={state?.fieldErrors?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled readOnly />
            <p className="text-xs text-muted-foreground">
              Your email can’t be changed.
            </p>
          </div>
        </CardContent>
        <CardFooter className="mt-6">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
