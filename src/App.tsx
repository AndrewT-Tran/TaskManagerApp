import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import ThemeSelector from './components/ThemeSelector';

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

    const newTask: Task = {
      id: tasks.length + 1,
      name: taskName,
      completed: false,
      timestamp: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskName('');
  };

  // Handle toggling the completion status of a task
  const handleToggleComplete = (id: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle removing a task
  const handleRemoveTask = (id: number): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
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
      <div className="container mx-auto max-w-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <ThemeSelector />
        </div>

        {/* Task input field */}
        <div className="form-control w-full">
          <input
            type="text"
            placeholder={editingTaskId ? 'Edit Task' : 'New Task'}
            className="input input-bordered w-full"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            data-testid="task-input"
          />
        </div>

        {/* Add or Save task button */}
        <button
          className="btn btn-primary w-full mt-4"
          onClick={editingTaskId ? handleSaveEdit : handleAddTask}
          data-testid="add-task-button"
        >
          {editingTaskId ? 'Save Edit' : 'Add Task'}
        </button>

        {/* Navigation Links */}
        <div className="flex justify-center gap-2 mt-6">
          <Link to="/" className="btn btn-outline" data-testid="all-tasks-link">
            All Tasks
          </Link>
          <Link to="/active" className="btn btn-outline" data-testid="active-tasks-link">
            Active Tasks
          </Link>
          <Link to="/completed" className="btn btn-outline" data-testid="completed-tasks-link">
            Completed Tasks
          </Link>
        </div>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <TaskList
                tasks={tasks}
                handleToggleComplete={handleToggleComplete}
                handleRemoveTask={handleRemoveTask}
                handleEditTask={handleEditTask}
              />
            }
          />
          <Route
            path="/active"
            element={
              <TaskList
                tasks={tasks.filter((task) => !task.completed)}
                handleToggleComplete={handleToggleComplete}
                handleRemoveTask={handleRemoveTask}
                handleEditTask={handleEditTask}
              />
            }
          />
          <Route
            path="/completed"
            element={
              <TaskList
                tasks={tasks.filter((task) => task.completed)}
                handleToggleComplete={handleToggleComplete}
                handleRemoveTask={handleRemoveTask}
                handleEditTask={handleEditTask}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;