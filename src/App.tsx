import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import TaskList from './components/TaskList';
import ThemeSelector from './components/ThemeSelector';
import NavLink from './components/NavLink';

// Import Poppins font
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// Define Task type with 'completed' field
type Task = {
  id: number;
  name: string;
  completed: boolean;
  timestamp?: Date;
};

const App: React.FC = () => {
  const [taskName, setTaskName] = useState<string>(''); // Name of the task being added
  const [tasks, setTasks] = useState<Task[]>([]); // Array of tasks
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null); // Track the task being edited
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // Control confetti display
  const [newTaskId, setNewTaskId] = useState<number | null>(null); // Track newly added task for animation
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null); // Alert state

  // Calculate task counts for badges
  const taskCounts = useMemo(() => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;
    const activeCount = totalCount - completedCount;

    return {
      total: totalCount,
      active: activeCount,
      completed: completedCount
    };
  }, [tasks]);

  // Load tasks from localStorage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      // Parse tasks and convert timestamp strings back to Date objects
      const parsedTasks = JSON.parse(savedTasks).map((task: Task) => ({
        ...task,
        timestamp: task.timestamp ? new Date(task.timestamp) : undefined
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Handle adding a new task
  const handleAddTask = (): void => {
    if (taskName.trim() === '') return;

    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

    const newTask: Task = {
      id: newId,
      name: taskName,
      completed: false,
      timestamp: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskName('');

    // Set the new task ID to trigger animation
    setNewTaskId(newId);

    // Show success alert
    setAlert({ type: 'success', message: 'Task added successfully!' });

    // Clear the new task ID and alert after animation duration
    setTimeout(() => {
      setNewTaskId(null);
      setAlert(null);
    }, 2000);
  };

  // Handle toggling the completion status of a task
  const handleToggleComplete = (id: number): void => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === id) {
          // If task is being marked as completed (not uncompleted), show confetti
          if (!task.completed) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000); // Hide confetti after 3 seconds
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return updatedTasks;
    });
  };

  // Handle removing a task
  const handleRemoveTask = (id: number): void => {
    const taskToRemove = tasks.find(task => task.id === id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    // Show error alert
    setAlert({ type: 'error', message: `Task "${taskToRemove?.name}" deleted` });

    // Clear alert after 2 seconds
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  // Start editing a task
  const handleEditTask = (id: number, name: string): void => {
    setEditingTaskId(id);
    setTaskName(name);
  };

  // Save edited task
  const handleSaveEdit = (): void => {
    if (editingTaskId !== null && taskName.trim() !== '') {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, name: taskName } : task
        )
      );
      setEditingTaskId(null);
      setTaskName('');
    }
  };

  return (
    <Router>
      <div className="container mx-auto max-w-lg p-4 font-['Poppins']">
        {/* Alert */}
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`alert ${alert.type === 'success' ? 'alert-success alert-soft' : 'alert-error'} mb-4`}
          >
            <span>{alert.message}</span>
          </motion.div>
        )}

        {/* Confetti effect when task is completed */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Task Manager
          </motion.h1>
          <ThemeSelector />
        </div>

        {/* Task input field */}
        <div className="form-control w-full">
          <motion.input
            type="text"
            placeholder={editingTaskId ? 'Edit Task' : 'New Task'}
            className="input input-bordered w-full"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            data-testid="task-input"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        </div>

        {/* Add or Save task button */}
        <motion.button
          className="btn btn-primary w-full mt-4"
          onClick={editingTaskId ? handleSaveEdit : handleAddTask}
          data-testid="add-task-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {editingTaskId ? 'Save Edit' : 'Add Task'}
        </motion.button>

        {/* Navigation Links */}
        <div className="flex justify-center gap-2 mt-6">
          <NavLink
            to="/"
            count={taskCounts.total}
            badgeColor="badge-neutral"
            activeColor="bg-primary"
            dataTestId="all-tasks-link"
          >
            All Tasks
          </NavLink>
          <NavLink
            to="/active"
            count={taskCounts.active}
            badgeColor="badge-error"
            activeColor="bg-error"
            dataTestId="active-tasks-link"
          >
            Active Tasks
          </NavLink>
          <NavLink
            to="/completed"
            count={taskCounts.completed}
            badgeColor="badge-success"
            activeColor="bg-success"
            dataTestId="completed-tasks-link"
          >
            Completed Tasks
          </NavLink>
        </div>

        {/* Routes */}
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  key="all"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskList
                    tasks={tasks}
                    handleToggleComplete={handleToggleComplete}
                    handleRemoveTask={handleRemoveTask}
                    handleEditTask={handleEditTask}
                    newTaskId={newTaskId}
                  />
                </motion.div>
              }
            />
            <Route
              path="/active"
              element={
                <motion.div
                  key="active"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskList
                    tasks={tasks.filter((task) => !task.completed)}
                    handleToggleComplete={handleToggleComplete}
                    handleRemoveTask={handleRemoveTask}
                    handleEditTask={handleEditTask}
                    newTaskId={newTaskId}
                  />
                </motion.div>
              }
            />
            <Route
              path="/completed"
              element={
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskList
                    tasks={tasks.filter((task) => task.completed)}
                    handleToggleComplete={handleToggleComplete}
                    handleRemoveTask={handleRemoveTask}
                    handleEditTask={handleEditTask}
                    newTaskId={newTaskId}
                  />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;