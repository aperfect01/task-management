"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { taskService } from "@/services/tasks/taskService";
import TaskForm from "@/components/TaskForm";
import TaskColumn from "@/components/TaskColumn";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
    } catch {
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    const prev = [...tasks];
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await taskService.updateStatus(id, status);
    } catch (err) {
      setTasks(prev); // rollback
      alert(`${err instanceof Error ? err.message : "Failed to update status"}`);
    }
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const prev = [...tasks];
    setTasks(tasks.filter((t) => t.id !== deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
    try {
      await taskService.remove(deleteId);
    } catch (err) {
      alert(`${err instanceof Error ? err.message : "Failed to delete"}`);
      setTasks(prev);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Dashboard</h1>
      <TaskForm onAdd={loadTasks} />
      <div style={{ display: "flex", marginTop: 20 }}>
        <TaskColumn
          title="Todo"
          status="todo"
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={requestDelete}
        />
        <TaskColumn
          title="In Progress"
          status="in-progress"
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={requestDelete}
        />
        <TaskColumn
          title="Done"
          status="done"
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={requestDelete}
        />
      </div>
      <ConfirmDialog
        isOpen={confirmOpen}
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
