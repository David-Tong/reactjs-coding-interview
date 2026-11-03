export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export type Filter = "all" | "active" | "completed";
