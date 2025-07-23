### Task Management App

---
#### Tech Stack Justification

For this project, I went with Next.js with the App Router because it lets me build both the front end and the API in one place, which really speeds things up. I'm using TypeScript from top to bottom to catch errors early and make the code easier to maintain as it grows. For the database, SQLite was the perfect choice, it's super simple and fast to set up for this test project. 

---

#### Setup Instructions

**Prerequisites:**

- Node.js (version 18 or higher)
- npm (or yarn/pnpm)

**Installation & Setup:**

1.  Clone the repository.
2.  Navigate to the project directory.
3.  Run `npm install` to install all project dependencies.
4.  Copy the `sample.env` file to `.env` and configure any necessary environment variables.
5.  Run `npx drizzle-kit push` to apply the database schema.
6.  Finally, run `npm run dev` to start the development server.
7.  The application will be accessible at `http://localhost:3000`.

---
#### Testing

The API has a set of tests located in the `src/__tests__` folder. To run them, make sure you have the dependencies installed and then execute the following command:

`npm run test`

---

#### API Documentation

All API endpoints are prefixed with `/api`. Data is expected in JSON format.

**Endpoint: `POST /api/tasks`**

  - **Description:** Creates a new task.
  - **Request Body:**
    ```json
    {
      "title": "Task title",
      "status": "todo"
    }
    ```
  - **Response (Success - 201 Created):**
    ```json
    {
      "id": 1,
      "title": "Task title",
      "status": "todo",
      "createdAt": "2025-07-23T19:15:42Z"
    }
    ```
  - **Response (Error - 400 Bad Request):**
    ```json
    {
        "error": {
            "title": [
                "Invalid input: expected string, received undefined"
            ],
            "status": [
                "Invalid option: expected one of \"todo\"|\"in-progress\"|\"done\""
            ]
        }
    }
    ```

**Endpoint: `GET /api/tasks`**

  - **Description:** Retrieves all tasks.
  - **Response (Success - 200 OK):**
    ```json
    [
      {
        "id": 1,
        "title": "Task 1",
        "status": "done",
        "createdAt": "2025-07-23T19:15:42Z"
      },
      {
        "id": 2,
        "title": "Task 2",
        "status": "todo",
        "createdAt": "2025-07-23T19:16:00Z"
      }
    ]
    ```

**Endpoint: `PUT /api/tasks/[id]`**

  - **Description:** Updates an existing task by ID.
  - **Request Body:**
    ```json
    {
      "title": "Updated title",
      "status": "done"
    }
    ```
  - **Response (Success - 200 OK):**
    ```json
    {
      "id": 1,
      "title": "Updated title",
      "status": "done",
      "createdAt": "2025-07-23T19:15:42Z"
    }
    ```
  - **Response (Error - 404 Not Found):**
    ```json
    {
      "error": "Task not found"
    }
    ```

**Endpoint: `DELETE /api/tasks/[id]`**

  - **Description:** Deletes a task by ID.
  - **Response (Success - 200 OK):**
    ```json
    {
        "success": true
    }
    ```
  - **Response (Error - 404 Not Found):**
    ```json
    {
      "error": "Task not found"
    }
    ```

---

#### Technical Trade-offs

**Trade-off:** Using SQLite for database persistence instead of a more robust, scalable solution like PostgreSQL, MySQL or MongoDB.

**Reasoning:** I went with SQLite for the database because the main goal was to get a working test product. Instead of spending a bunch of time setting up a more complex database like Postgres, which would have needed something like Docker, SQLite lets me just use a simple file. It's perfect for a small project like this, it keeps things simple.

---

#### Future Roadmap

If given two more hours, I would prioritize the following features:

1.  **Enhanced Task Functionality and UX** 
    - Advanced Task Details: Extend the tasks database schema and API to include a description field. On the front end, add a more detailed task view (e.g., a modal that opens when a task card is clicked) to display and edit the description.
2.  **Scalability and Performance:** 
    - Pagination for Task List: The current GET /api/tasks endpoint retrieves all tasks. For a user with hundreds of tasks, this can become slow. I would modify the API to support pagination (e.g., GET /api/tasks?page=1&limit=20) and update the front end to fetch tasks in chunks, improving performance and responsiveness.







