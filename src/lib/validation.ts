import { z } from "zod";

const allowedStatuses = ["todo", "in-progress", "done"] as const;

export const TaskStatusEnum = z.string().refine((val) => allowedStatuses.includes(val as any), {
  message: "Status must be one of: todo, in-progress, or done",
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: TaskStatusEnum.optional(),
});

export const UpdateStatusSchema = z.object({
  status: TaskStatusEnum,
});