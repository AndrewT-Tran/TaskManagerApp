import React from 'react';
import { formatTimestamp } from '../utils/time';

type Task = {
  id: number;
  name: string;
  completed: boolean;
  timestamp?: Date;
};

interface TaskListProps {
  tasks: Task[];
  handleToggleComplete: (id: number) => void;
  handleRemoveTask: (id: number) => void;
  handleEditTask: (id: number, name: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  handleToggleComplete,
  handleRemoveTask,
  handleEditTask,
}) => (
  <ul className="mt-8 space-y-4">
    {tasks.map((task) => (
      <li key={task.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
              className="checkbox bg-primary checkbox-primary"
            />
            <span className={`text-lg ${task.completed ? 'line-through text-base-content/60' : 'text-base-content'}`}>
              {task.name}
            </span>
          </div>
          <span className="text-sm text-base-content/50 ml-10">
            {formatTimestamp(task.timestamp)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEditTask(task.id, task.name)}
            className="btn btn-warning bg-warning text-white btn-outline btn-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleRemoveTask(task.id)}
            className="btn btn-error bg-error text-white btn-outline btn-sm"
          >
            Remove
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default TaskList;