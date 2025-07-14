"use server";

import { getTodosByUser } from "@/lib/queries/data";
import { TaskTabs } from "./task-tabs";

interface TaskListProps {
  userId: string;
}

export async function TaskList({ userId }: TaskListProps) {
  const tasks = await getTodosByUser(userId);

  return <TaskTabs tasks={tasks} user={userId} />;
}
