"use server";

import { db } from "@/db/client";
import { auth } from "@/auth";
import { tasks } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function addTask(title: string, userId: string) {
  if (!title || title.length < 1) return;

  await db.insert(tasks).values({ title, userId });
  revalidatePath("/");
}

export async function deleteTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const taskIdRaw = formData.get("taskId");
  const taskId = Number(taskIdRaw);

  if (isNaN(taskId)) throw new Error("Invalid task ID");

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

  revalidatePath("/");
}
