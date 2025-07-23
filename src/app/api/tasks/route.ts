import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { CreateTaskSchema, TaskStatusEnum } from "@/lib/validation";
import type { Task, TaskStatus } from "@/types";
import { formatZodErrors } from "@/lib/formatZodErrors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (status && !TaskStatusEnum.options.includes(status as TaskStatus)) {
      return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
    }

    const query = status
      ? db
          .select()
          .from(tasks)
          .where(eq(tasks.status, status as Task["status"]))
      : db.select().from(tasks);

    const result: Task[] = await query.all();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = CreateTaskSchema.safeParse(json);

    if (!parsed.success) {
      const error = formatZodErrors(parsed.error);
      return NextResponse.json({ error }, { status: 400 });
    }

    const { title, status = "todo" } = parsed.data;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status,
      createdAt: new Date().toISOString(),
    };

    await db.insert(tasks).values(newTask).run();
    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("Error creating task:", err);

    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
