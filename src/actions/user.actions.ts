"use server";

import bcrypt from "bcryptjs";
import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { tags } from "@/lib/cache-tags";
import {
  changePasswordSchema,
  profileSchema,
  toFieldErrors,
} from "@/lib/validations";

export type SettingsFormState =
  | {
      success?: boolean;
      error?: string;
      fieldErrors?: Record<string, string[]>;
      values?: { name?: string };
    }
  | undefined;

export async function updateProfile(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const userId = await requireUserId();
  const values = { name: String(formData.get("name") ?? "") };

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
  });

  updateTag(tags.user(userId));
  return { success: true, values: { name: parsed.data.name } };
}

export async function changePassword(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const userId = await requireUserId();

  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues) };
  }
  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user) return { error: "Account not found" };

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    return {
      fieldErrors: { currentPassword: ["Current password is incorrect"] },
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });

  return { success: true };
}
