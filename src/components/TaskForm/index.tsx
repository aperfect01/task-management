"use client";

import { useState } from "react";
import { taskService } from "@/services/tasks/taskService";
import styles from "./index.module.css";

export default function TaskForm({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      await taskService.create(title);
      setTitle("");
      setError("");
      onAdd(); // Refresh tasks
    } catch {
      setError("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Add Task
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
