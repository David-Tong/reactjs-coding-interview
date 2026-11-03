import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

async function addTask(text: string) {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Enter a task"), text);
    await user.click(screen.getByRole("button", { name: "Add Task" }));
}

describe("Task manager", () => {
    it("shows the empty state at first", () => {
        render(<App />);
        expect(screen.getByText("No tasks to display")).toBeInTheDocument();
    });

    it("adds a task and clears the input", async () => {
        render(<App />);
        await addTask("Buy milk");

        expect(screen.getByText("Buy milk")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter a task")).toHaveValue("");
    });

    it("trims the task text", async () => {
        render(<App />);
        await addTask("   Buy milk   ");

        expect(screen.getByRole("listitem")).toHaveTextContent(/^Buy milk$/);
    });

    it("shows an error for blank input and does not add a task", async () => {
        render(<App />);
        await addTask("   ");

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Task cannot be empty",
        );
        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });

    it("clears the error when the user types again", async () => {
        const user = userEvent.setup();
        render(<App />);
        await addTask("   ");
        await user.type(screen.getByPlaceholderText("Enter a task"), "a");

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("toggles a task's completed state", async () => {
        const user = userEvent.setup();
        render(<App />);
        await addTask("Buy milk");

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();
        await user.click(checkbox);
        expect(checkbox).toBeChecked();
        await user.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    it("filters by active and completed", async () => {
        const user = userEvent.setup();
        render(<App />);
        await addTask("Buy milk");
        await addTask("Walk dog");
        await user.click(screen.getAllByRole("checkbox")[0]);

        await user.click(screen.getByRole("button", { name: "Active" }));
        expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
        expect(screen.getByText("Walk dog")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Completed" }));
        expect(screen.getByText("Buy milk")).toBeInTheDocument();
        expect(screen.queryByText("Walk dog")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "All" }));
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("does not change task state when switching filters", async () => {
        const user = userEvent.setup();
        render(<App />);
        await addTask("Buy milk");
        await addTask("Walk dog");
        await user.click(screen.getAllByRole("checkbox")[0]);

        await user.click(screen.getByRole("button", { name: "Active" }));
        await user.click(screen.getByRole("button", { name: "All" }));

        const [first, second] = screen.getAllByRole("checkbox");
        expect(first).toBeChecked();
        expect(second).not.toBeChecked();
    });

    it("shows the empty state when a filter has no matches", async () => {
        const user = userEvent.setup();
        render(<App />);
        await addTask("Buy milk");

        await user.click(screen.getByRole("button", { name: "Completed" }));
        expect(screen.getByText("No tasks to display")).toBeInTheDocument();
    });

    it("toggles the correct task while a filter is active", async () => {
        const user = userEvent.setup();
        render(<App />);
        await addTask("Buy milk");
        await addTask("Walk dog");
        await user.click(screen.getAllByRole("checkbox")[0]);

        await user.click(screen.getByRole("button", { name: "Active" }));
        await user.click(screen.getByRole("checkbox"));

        await user.click(screen.getByRole("button", { name: "All" }));
        expect(screen.getAllByRole("checkbox")).toHaveLength(2);
        screen.getAllByRole("checkbox").forEach((c) => expect(c).toBeChecked());
    });
});
