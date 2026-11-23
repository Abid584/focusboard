import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";

const nameRule = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50);

const passwordRules = z
  .string()
  .min(8, "At least 8 characters")
  .max(72, "At most 72 characters")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[^A-Za-z0-9]/, "At least one special character (e.g. ! @ # $)");

export const registerSchema = z.object({
  name: nameRule,
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: passwordRules,
});

export const profileSchema = z.object({ name: nameRule });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(60, "Name must be at most 60 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional(),
});

export function toFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date"),
});

export const taskFiltersSchema = z.object({
  q: z.string().trim().max(100).catch(""),
  status: z.enum(TASK_STATUSES).or(z.literal("")).catch(""),
  priority: z.enum(TASK_PRIORITIES).or(z.literal("")).catch(""),
  projectId: z.string().trim().max(50).catch(""),
  page: z.coerce.number().int().min(1).max(100000).catch(1),
});

export type TaskFilters = z.infer<typeof taskFiltersSchema>;
