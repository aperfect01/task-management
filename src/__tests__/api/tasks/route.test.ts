import { POST } from "@/app/api/tasks/route";
import { db } from "@/db";

jest.mock("@/db", () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        run: jest.fn(),
      })),
    })),
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          all: jest.fn(),
        })),
        all: jest.fn(),
      })),
    })),
  },
}));

describe("POST /api/tasks", () => {
  it("creates a new task with valid data", async () => {
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "Test Task", status: "todo" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toHaveProperty("id");
    expect(json.title).toBe("Test Task");
    expect(json.status).toBe("todo");
    expect(json).toHaveProperty("createdAt");
  });

  it("returns 400 for invalid data", async () => {
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({}), // Missing title
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toHaveProperty("title");
  });

  it("handles server errors", async () => {
    (db.insert as jest.Mock).mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "Failing Task" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe("Failed to create task");
  });
});
