import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../components/TaskList';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
    const actual = jest.requireActual('framer-motion');
    return {
        ...actual,
        motion: {
            div: (props) => <div {...props}>{props.children}</div>,
            li: (props) => <li {...props}>{props.children}</li>,
            button: (props) => <button {...props}>{props.children}</button>,
            span: (props) => <span {...props}>{props.children}</span>,
            input: (props) => <input {...props}>{props.children}</input>,
        },
        AnimatePresence: (props) => <>{props.children}</>,
        useAnimate: () => [null, jest.fn()]
    };
});

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
                newTaskId={null}
            />
        );

        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('calls handleToggleComplete when checkbox is clicked', () => {
        jest.useFakeTimers();

        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
                newTaskId={null}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);

        expect(mockHandleToggleComplete).toHaveBeenCalledWith(1);

        jest.useRealTimers();
    });

    it('calls handleRemoveTask when Remove button is clicked', () => {
        jest.useFakeTimers();

        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
                newTaskId={null}
            />
        );

        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);

        // Fast-forward timers to trigger the delayed removal
        jest.runAllTimers();

        expect(mockHandleRemoveTask).toHaveBeenCalledWith(1);

        jest.useRealTimers();
    });

    it('calls handleEditTask when Edit button is clicked', () => {
        render(
            <TaskList
                tasks={mockTasks}
                handleToggleComplete={mockHandleToggleComplete}
                handleRemoveTask={mockHandleRemoveTask}
                handleEditTask={mockHandleEditTask}
                newTaskId={null}
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
                newTaskId={null}
            />
        );

        const completedTask = screen.getByText('Test Task 2');
        expect(completedTask).toHaveClass('text-base-content/60');
    });
}); 