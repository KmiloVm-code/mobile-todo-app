import type React from "react";
import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth";
import { TaskHeader } from "@/components/tasks";
import { getUserById, fetchUserTaskStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard - TaskFlow",
  description: "Gestiona tus tareas de manera eficiente",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aquí podrías obtener el usuario actual y sus tareas
  const userId = "32b4ad11-c821-4cb1-83e0-0d7bc9fe6e22"; // Reemplaza con la lógica real para obtener el ID del usuario
  const user = await getUserById(userId);
  const taskStats = await fetchUserTaskStats(userId);
  const totalPendingTasks =
    Number(taskStats.pending) + Number(taskStats.inProgress);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <TaskHeader user={user} pendingTasksCount={totalPendingTasks} />
        {children}
      </div>
    </AuthGuard>
  );
}
