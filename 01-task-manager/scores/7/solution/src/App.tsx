import { useState } from "react";
import type { Task, Filter } from "./types";

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<Filter>("all");
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

    const addTask = () => {
        const text = input.trim();
        if (text === "") {
            setError("Task cannot be empty");
            return;
        }
        const uuid = crypto.randomUUID();
        setTasks((prev) => [
            ...prev,
            { id: uuid, text: text, completed: false },
        ]);
        setInput("");
        setError("");
    };

    const toggleTaskCompletion = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task,
            ),
        );
    };

    const visibleTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "active") return !task.completed;
        return true;
    });

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // Add task logic here
                    addTask();
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setError("");
                    }}
                    placeholder="Enter a task"
                />
                <button type="submit">Add Task</button>
                {error && <p role="alert">{error}</p>}
            </form>
            <div>
                <button type="button" onClick={() => setFilter("all")}>
                    All
                </button>
                <button type="button" onClick={() => setFilter("active")}>
                    Active
                </button>
                <button type="button" onClick={() => setFilter("completed")}>
                    Completed
                </button>
            </div>
            {visibleTasks.length === 0 ? (
                <p>No tasks to display</p>
            ) : (
                <ul>
                    {visibleTasks.map((task) => (
                        <li key={task.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() =>
                                        toggleTaskCompletion(task.id)
                                    }
                                />
                                {task.text}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
