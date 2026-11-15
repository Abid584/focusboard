"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";

export type FormState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      values?: { name?: string; email?: string };
    }
  | undefined;

export async function register(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData);

  // Values to refill the form with if something fails (never the password)
  const values = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
  };

  // 1. Validate
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { fieldErrors, values };
  }
  const { name, email, password } = parsed.data;

  // 2. Make sure the email is free
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists", values };
  }

  // 3. Hash the password and save the user
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  // 4. Log them in straight away
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export async function login(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Invalid email or password" };
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error; // lets the redirect after a successful login go through
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
