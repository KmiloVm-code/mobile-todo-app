import { TodoApp } from "@/components/dashboard";
import type { Metadata } from "next";
import { getTodosByUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mis Tareas - TaskFlow",
  description: "Gestiona y organiza todas tus tareas",
};

const userId = "32b4ad11-c821-4cb1-83e0-0d7bc9fe6e22"; // Replace with actual user ID logic

export default async function DashboardPage() {
  const tasks = await getTodosByUser(userId);

  console.log("Fetched Todos:", tasks);
  return (
    <div className="flex flex-col gap-6">
      <TodoApp tasks={tasks} />
    </div>
  );
}
