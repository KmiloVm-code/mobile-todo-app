import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso - TaskFlow",
  description: "Inicia sesión o regístrate en TaskFlow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
