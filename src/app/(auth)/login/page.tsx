import { LoginForm } from "@/components/forms/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return <LoginForm />;
}
