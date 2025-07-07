import type React from "react";
import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth";

export const metadata: Metadata = {
  title: "Dashboard - TaskFlow",
  description: "Gestiona tus tareas de manera eficiente",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {children}
      </div>
    </AuthGuard>
  );
}
