import { TodoApp } from "@/components/dashboard";
import type { Metadata } from "next";
import { getTodosByUser } from "@/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TaskHeader } from "@/components/tasks";
import { Suspense } from "react";
import { DashboardHeaderSkeleton } from "@/components/dashboard/skeletons";

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

  return (
    <div className="flex flex-col min-h-full">
      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <TaskHeader />
      </Suspense>

      <div className="flex-1">
        <TodoApp tasks={tasks} />
      </div>
    </div>
  );
}
