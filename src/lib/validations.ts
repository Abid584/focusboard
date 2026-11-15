import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(72, "At most 72 characters")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "At least one special character (e.g. ! @ # $)"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
