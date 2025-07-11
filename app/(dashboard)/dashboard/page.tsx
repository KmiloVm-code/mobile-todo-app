import { TodoApp } from "@/components/dashboard";
import type { Metadata } from "next";
import { fetchUserTaskStats, getTodosByUser, getUserById } from "@/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TaskHeader } from "@/components/tasks";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mis Tareas - TaskFlow",
  description: "Gestiona y organiza todas tus tareas",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const tasks = await getTodosByUser(userId);
  const taskStats = await fetchUserTaskStats(userId);
  const totalPendingTasks =
    Number(taskStats.pending) + Number(taskStats.inProgress);

  const user = await getUserById(userId);

  return (
    <div className="flex flex-col min-h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <TaskHeader user={user} pendingTasksCount={totalPendingTasks} />
      </Suspense>

      <div className="flex-1">
        <Suspense fallback={<div>Loading tasks...</div>}>
          <TodoApp tasks={tasks} />
        </Suspense>
      </div>
    </div>
  );
}
