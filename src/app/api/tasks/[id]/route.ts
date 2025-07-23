import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { UpdateStatusSchema } from "@/lib/validation";
import type { Task, TaskStatus } from "@/types";
import z from "zod";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const parsed = UpdateStatusSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
    }

    const task: Task | undefined = await db.select().from(tasks).where(eq(tasks.id, params.id)).get();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await db.update(tasks).set({ status: parsed.data.status }).where(eq(tasks.id, params.id)).run();

    const updated = (await db.select().from(tasks).where(eq(tasks.id, params.id)).get()) as Task;
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating task:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const task = (await db.select().from(tasks).where(eq(tasks.id, params.id)).get()) as Task | undefined;

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await db.delete(tasks).where(eq(tasks.id, params.id)).run();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
