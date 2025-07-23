import { z } from "zod";

export const TaskStatusEnum = z.enum(["todo", "in-progress", "done"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: TaskStatusEnum.optional(),
});

export const UpdateStatusSchema = z.object({
  status: TaskStatusEnum,
});
