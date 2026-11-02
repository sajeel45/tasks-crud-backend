# Tasks Backend

A clean, production-grade Express & Mongoose REST API for Tasks CRUD, built following modern Node.js architectural patterns.

## Features

- **Full Tasks CRUD**: Create, read, update, delete tasks.
- **Mark as Complete**: Dedicated toggle endpoint to easily complete/uncomplete tasks.
- **Task Statistics**: Stats endpoint returning counts of total, completed, pending, and in-progress tasks, plus completion rate.
- **Search & Filters**: Search tasks by title and description, filter by status or priority.
- **Pagination & Sorting**: Support for pagination and dynamic sorting.
- **Validation**: Strict request validation using Joi schemas.
- **Error Handling**: Centralized error converter and handler with standard HTTP status codes.
- **Security**: Equipped with Helmet, Mongo-sanitize, CORS, and Gzip compression.

## API Endpoints

- `GET /api/health` - Service health status
- `GET /api/tasks` - List tasks (supports query params: `search`, `status`, `priority`, `page`, `limit`, `sortBy`)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/stats` - Get task summary statistics
- `GET /api/tasks/:taskId` - Retrieve task by ID
- `PATCH /api/tasks/:taskId` - Update task by ID
- `PATCH /api/tasks/:taskId/toggle-complete` - Toggle task completion status
- `DELETE /api/tasks/:taskId` - Delete task by ID

## Environment Variables

Create a `.env` file in the root of `tasks-backend`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URL=mongodb://127.0.0.1:27017/tasks-db
FRONTEND_URL=http://localhost:5173
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```
