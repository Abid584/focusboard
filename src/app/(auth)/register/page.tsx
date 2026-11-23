import { RegisterForm } from "@/components/forms/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up" };

export default function RegisterPage() {
  return <RegisterForm />;
}
