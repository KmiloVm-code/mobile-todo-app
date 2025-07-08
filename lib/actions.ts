"use server";

import { TaskFormData } from "./validations";
import postgres from "postgres";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "prefer" });

export async function createdTask(task: TaskFormData): Promise<void> {
  await sql`
      INSERT INTO tasks
      (user_id, title, description, priority, category_id, start_date, end_date)
      VALUES
      (
      ${task.userId}, ${task.title}, ${task.description ?? null}, ${
    task.priority
  }, ${task.categoryId ?? null}, ${task.startDate ?? null}, ${
    task.endDate ?? null
  })
    `;
  revalidatePath("/dashboard");
}

// edit task partial patch
export async function editedTask(
  taskId: string,
  task: TaskFormData
): Promise<void> {
  await sql`
      UPDATE tasks
      SET
        title = ${task.title},
        description = ${task.description ?? null},
        priority = ${task.priority},
        category_id = ${task.categoryId ?? null},
        start_date = ${task.startDate ?? null},
        end_date = ${task.endDate ?? null}
      WHERE id = ${taskId}
  `;
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string): Promise<void> {
  await sql`
      DELETE FROM tasks
      WHERE id = ${taskId}
  `;
  revalidatePath("/dashboard");
}

export async function completeTask(
  taskId: string,
  status: "completed" | "pending"
): Promise<void> {
  await sql`
      UPDATE tasks
      SET status = ${status}
      WHERE id = ${taskId}
  `;
  revalidatePath("/dashboard");
}