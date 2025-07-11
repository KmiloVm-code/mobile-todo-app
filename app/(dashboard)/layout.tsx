import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - TaskFlow",
  description: "Gestiona tus tareas de manera eficiente",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
