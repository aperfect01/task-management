import { Task, TaskStatus } from "@/types/task";
import styles from "./index.module.css";

const statusOptions: TaskStatus[] = ["todo", "in-progress", "done"];

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>{task.title}</h4>
          <p className={styles.date}>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
        </div>
        <button onClick={() => onDelete(task.id)} className={styles.deleteButton}>
          Delete
        </button>
      </div>

      <div className={styles.statusContainer}>
        <label htmlFor={`status-${task.id}`} className={styles.statusLabel}>
          Status
        </label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className={styles.statusSelect}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
