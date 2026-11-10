export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  completed?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    // NestJS validation errors arrive as { statusCode, message, error }
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(", ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      // body was not JSON, keep the default message
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const tasksApi = {
  list: () => apiFetch<Task[]>("/tasks"),
  create: (input: TaskInput) =>
    apiFetch<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: number, input: Partial<TaskInput>) =>
    apiFetch<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: number) =>
    apiFetch<Task>(`/tasks/${id}`, {
      method: "DELETE",
    }),
};
