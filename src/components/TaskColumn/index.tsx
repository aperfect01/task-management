import { Task, TaskStatus } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import styles from "./index.module.css";

const statusClassMap: Record<TaskStatus, string> = {
  todo: styles.todo,
  "in-progress": styles.inProgress,
  done: styles.done,
};

export default function TaskColumn({
  title,
  status,
  tasks,
  onStatusChange,
  onDelete,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`${styles.column} ${statusClassMap[status]}`}>
      <h2 className={styles.header}>{title}</h2>
      <div className={styles.taskList}>
        {tasks
          .filter((t) => t.status === status)
          .map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
          ))}
      </div>
    </div>
  );
}
