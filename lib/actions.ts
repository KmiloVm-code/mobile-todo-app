"use server";

import {
  TaskFormData,
  TaskWithUserData,
  RegisterFormData,
  loginFormSchema,
} from "./validations";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcryptjs from "bcryptjs";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const sql = postgres(process.env.POSTGRES_URL);

console.log("Using Postgres URL:", process.env.POSTGRES_URL);

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input data
    const validatedFields = loginFormSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return "Invalid credentials";
    }

    await signIn("credentials", formData);
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Authentication failed";
      }
    }
    throw error;
  }
}

export async function registerUser(formData: RegisterFormData): Promise<void> {
  const parsedData = loginFormSchema.safeParse(formData);
  if (!parsedData.success) {
    throw new Error("Invalid registration data");
  }

  const { email, password } = parsedData.data;

  // Check if user already exists
  const existingUser = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;

  if (existingUser.length > 0) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Insert new user into the database
  await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${hashedPassword}, ${formData.name})
  `;

  revalidatePath("/dashboard");
}

export async function createdTask(task: TaskWithUserData): Promise<void> {
  await sql`
      INSERT INTO tasks
      (user_id, title, description, priority, start_date, end_date)
      VALUES
      (
      ${task.userId}, ${task.title}, ${task.description ?? null}, ${
    task.priority
  }, ${task.startDate ?? null}, ${task.endDate ?? null})
    `;
  revalidatePath("/dashboard");
}

// edit task partial patch
export async function editedTask(
  taskId: string,
  task: TaskWithUserData
): Promise<void> {
  await sql`
      UPDATE tasks
      SET
        title = ${task.title},
        description = ${task.description ?? null},
        priority = ${task.priority},
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
