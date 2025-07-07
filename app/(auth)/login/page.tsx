import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar Sesión - TaskFlow",
  description: "Inicia sesión en tu cuenta de TaskFlow",
};

export default function LoginPage() {
  return <LoginForm />;
}
