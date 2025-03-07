import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../components/TaskList';

describe('TaskList', () => {
    const mockTasks = [
        {
            id: 1,
            name: 'Test Task 1',
            completed: false,
            timestamp: new Date('2024-03-07T12:00:00'),
        },
        {
            id: 2,
            name: 'Test Task 2',
            completed: true,
            timestamp: new Date('2024-03-07T13:00:00'),
        },
    ];

    const mockHandleToggleComplete = jest.fn();
    const mockHandleRemoveTask = jest.fn();
    const mockHandleEditTask = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all tasks', () => {
        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
            />
        );

        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('calls handleToggleComplete when checkbox is clicked', () => {
        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);

        expect(mockHandleToggleComplete).toHaveBeenCalledWith(1);
    });

    it('calls handleRemoveTask when Remove button is clicked', () => {
        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
            />
        );

        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        expect(mockHandleRemoveTask).toHaveBeenCalledWith(1);
    });

    it('calls handleEditTask when Edit button is clicked', () => {
        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
            />
        );

        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);

        expect(mockHandleEditTask).toHaveBeenCalledWith(1, 'Test Task 1');
    });

    it('applies correct styling for completed tasks', () => {
        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
            />
        );

        const completedTask = screen.getByText('Test Task 2');
        expect(completedTask).toHaveClass('line-through');
    });
}); 