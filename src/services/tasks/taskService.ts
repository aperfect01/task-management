import { Task } from "@/types";

const API_URL = "/api/tasks";

function flattenErrorObject(errorObj: Record<string, string[]>): string {
  return Object.entries(errorObj)
    .map(([field, messages]) => `${messages.join(", ")}`)
    .join(" | ");
}

async function handleResponse(res: Response) {
  const contentType = res.headers.get("Content-Type");
  const isJSON = contentType?.includes("application/json");
  const data = isJSON ? await res.json() : null;

  console.log(data?.error, "data?.error");

  if (!res.ok) {
    let errorMessage = "An unexpected error occurred";

    if (data?.error) {
      if (typeof data.error === "string") {
        errorMessage = data.error;
      } else if (typeof data.error === "object") {
        errorMessage = flattenErrorObject(data.error);
      }
    } else {
      errorMessage = res.statusText;
    }

    throw new Error(errorMessage);
  }

  return data;
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const res = await fetch(API_URL);
    return handleResponse(res);
  },

  async create(title: string): Promise<Task> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    return handleResponse(res);
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await handleResponse(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    await handleResponse(res);
  },
};
