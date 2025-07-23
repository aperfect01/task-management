import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status", { enum: ["todo", "in-progress", "done"] }).notNull(),
  createdAt: text("created_at").notNull(),
});
