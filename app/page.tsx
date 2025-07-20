import { auth } from "@/auth";
import Image from "next/image";
import { addTask } from "./actions";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { tasks } from "@/db/schema";
import { deleteTask } from "./actions";
import { SignOut } from "@/components/ui/signout-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) redirect("/login");
  if (!session.user?.id) {
    throw new Error("User ID is undefined");
  }

  const userId = session.user.id;
  const allTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId));

  return (
    <main className="max-w-md mx-auto p-6">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <p>{session.user.name}</p>
          <Image
            src={session.user.image ?? "/placeholder.png"}
            alt={session.user.name ?? "User avatar"}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <SignOut />
      </header>
      <form
        action={async (formData) => {
          "use server";
          const session = await auth();
          const userId = session?.user?.id;
          if (!userId) throw new Error("Unauthorized: Missing user ID");

          const title = formData.get("title") as string;

          await addTask(title, userId);
        }}
        className="mb-6 space-y-2"
      >
        <input
          name="title"
          placeholder="What needs to be done?"
          className="w-full border px-4 py-2 rounded"
          required
          minLength={2}
          maxLength={100}
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>

      <ul className="space-y-2">
        {allTasks.map((task) => (
          <li key={task.id} className="border p-2 rounded">
            {task.title}
            <form action={deleteTask}>
              <input type="hidden" name="taskId" value={task.id} />
              <button type="submit" className="text-red-500">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
