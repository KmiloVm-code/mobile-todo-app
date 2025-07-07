import type { Metadata } from "next";
import { TodoApp } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Mis Tareas - TaskFlow",
  description: "Gestiona y organiza todas tus tareas",
};

export default function DashboardPage() {
  return <TodoApp />;
}
