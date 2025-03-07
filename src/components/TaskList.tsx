import React, { useEffect, useRef, useState } from 'react';
import { formatTimestamp } from '../utils/time';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';

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
  newTaskId: number | null;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  handleToggleComplete,
  handleRemoveTask,
  handleEditTask,
  newTaskId
}) => {
  // Create refs for task items to animate
  const taskRefs = useRef<Map<number, HTMLLIElement>>(new Map());
  const [scope, animate] = useAnimate();
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [justCompletedId, setJustCompletedId] = useState<number | null>(null);

  // Effect to animate new task
  useEffect(() => {
    if (newTaskId !== null) {
      const taskElement = taskRefs.current.get(newTaskId);
      if (taskElement) {
        // Play a special animation for the new task
        animate(
          taskElement,
          {
            backgroundColor: ['var(--primary-color)', 'var(--primary-color)', 'var(--base-200)'],
            scale: [1, 1.05, 1]
          },
          {
            duration: 1.5,
            ease: "easeInOut"
          }
        );
      }
    }
  }, [newTaskId, animate]);

  // Handle task removal with animation
  const handleRemoveWithAnimation = (id: number) => {
    setItemToRemove(id);
    // Delay the actual removal to allow animation to complete
    setTimeout(() => {
      handleRemoveTask(id);
      setItemToRemove(null);
    }, 300); // Reduced from 500ms to 300ms
  };

  // Handle task completion with animation
  const handleCompleteWithAnimation = (id: number, isCompleted: boolean) => {
    // Only trigger the bounce animation when marking as completed, not when uncompleting
    if (!isCompleted) {
      setJustCompletedId(id);

      // Animate the bounce effect
      const taskElement = taskRefs.current.get(id);
      if (taskElement) {
        // First animate up and down bounce
        animate(
          taskElement,
          {
            y: [0, -15, 0, -7, 0],
            scale: [1, 1.1, 1, 1.05, 1]
          },
          {
            duration: 0.6,
            ease: "easeOut"
          }
        );
      }

      // Clear the completed state after animation
      setTimeout(() => {
        setJustCompletedId(null);
      }, 3000); // Match with confetti duration
    }

    // Call the original toggle function
    handleToggleComplete(id);
  };

  return (
    <div className="mt-8">
      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-base-200 rounded-lg shadow-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium text-base-content/70">No tasks yet</p>
            <p className="text-sm text-base-content/50">Add a new task to get started</p>
          </div>
        </motion.div>
      ) : (
        <ul className="space-y-4" ref={scope}>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: itemToRemove === task.id ? 500 : 0, // Slide out when being removed
                  boxShadow: justCompletedId === task.id
                    ? ['0px 0px 0px rgba(0,0,0,0)', '0px 10px 25px rgba(0,0,0,0.2)', '0px 0px 0px rgba(0,0,0,0)']
                    : '0px 0px 0px rgba(0,0,0,0)',
                  backgroundColor: justCompletedId === task.id
                    ? ['var(--base-200)', 'var(--success-color)', 'var(--base-200)']
                    : 'var(--base-200)'
                }}
                exit={{
                  opacity: 0,
                  x: 500, // Slide out to the right when removed
                  height: 0,
                  marginBottom: 0,
                  transition: { duration: 0.3, ease: "easeInOut" } // Reduced from 0.5s to 0.3s
                }}
                transition={{ duration: 0.3 }}
                layout
                className="flex items-center justify-between p-4 rounded-lg overflow-hidden"
                ref={(el) => {
                  if (el) taskRefs.current.set(task.id, el);
                  else taskRefs.current.delete(task.id);
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <motion.input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCompleteWithAnimation(task.id, task.completed)}
                      className={`checkbox ${task.completed ? 'bg-success checkbox-success' : 'bg-primary checkbox-primary'}`}
                      whileTap={{ scale: 1.3 }}
                    />
                    <motion.span
                      animate={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.6 : 1
                      }}
                      transition={{ duration: 0.2 }}
                      className={`text-lg ${task.completed ? 'text-base-content/60' : 'text-base-content'}`}
                    >
                      {task.name}
                    </motion.span>
                  </div>
                  <span className="text-sm text-base-content/50 ml-10">
                    {formatTimestamp(task.timestamp)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleEditTask(task.id, task.name)}
                    className="btn btn-warning bg-warning text-white btn-outline btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleRemoveWithAnimation(task.id)}
                    className="btn btn-error bg-error text-white btn-outline btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default TaskList;