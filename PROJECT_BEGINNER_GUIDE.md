# Project Management App – Beginner Guide

This document explains every important folder and file in the project in a simple beginner-friendly way.

---

## 1) Root folder

### package.json

- Main backend project configuration.
- Contains scripts like:
  - `npm start` → runs the backend server
  - `npm run dev` → runs backend in development mode with nodemon
- Lists backend dependencies such as Express, Mongoose, JWT, bcrypt, multer, cors, dotenv, and nodemailer.

### PRD.md

- Product Requirements Document.
- Describes the features the app is supposed to have.
- Helpful for checking whether the app matches the planned requirements.

### .env

- Stores environment variables such as:
  - MongoDB connection URL
  - JWT secrets
  - server URL
  - mail settings
- Very important for backend configuration.

### .gitignore

- Tells Git which files and folders to ignore.
- Commonly ignores node_modules, environment files, and generated files.

### public/

- Used for static files that can be served directly by the server.
- In this project, it is mainly used for uploaded images or public assets.

### frontend/

- Contains the React frontend application.
- This is the part users interact with in the browser.

### node_modules/

- Installed third-party packages.
- You normally do not edit this folder manually.

### auth-check.js

- A simple script used to test authentication flows manually.
- Helps verify login, current user, refresh token, and logout.

### cookies.txt, headers.txt, login.txt, loginbody.txt

- Helper files used during API testing.
- Useful for learning how requests and cookies are sent to the backend.

---

## 2) src/ folder (backend)

This is the main backend code. It handles the API, database logic, authentication, and business rules.

### src/app.js

- Creates the Express app.
- Adds middleware like:
  - JSON parser
  - URL encoded form parsing
  - cookie parser
  - CORS
  - static file serving
- Registers all route files.
- Contains the global error handler.

### src/index.js

- Starts the server.
- Connects to MongoDB.
- Starts listening on the configured port.

### src/routes/

This folder contains URL endpoints.

#### src/routes/auth.routes.js

- Handles user authentication endpoints.
- Routes include:
  - register
  - login
  - logout
  - current-user
  - refresh-token
  - forgot/reset password

#### src/routes/project.routes.js

- Handles project endpoints.
- Routes include:
  - get all projects
  - create project
  - get one project
  - update project
  - delete project
  - manage project members

#### src/routes/task.routes.js

- Handles task and subtask endpoints.
- Routes include:
  - get tasks for a project
  - create task
  - update task
  - delete task
  - create subtasks
  - update/delete subtasks

#### src/routes/note.routes.js

- Handles project note endpoints.
- Routes include:
  - list notes
  - create note
  - get note
  - update note
  - delete note

#### src/routes/healthcheck.routes.js

- Simple endpoint for checking if the backend is running.

### src/controllers/

This folder contains the main logic for each feature.

#### src/controllers/auth.controllers.js

- Handles user registration, login, logout, current user fetching, and token refresh.
- Also includes password reset and email verification logic.

#### src/controllers/project.controller.js

- Handles project CRUD operations.
- Handles project members:
  - add member
  - get members
  - update member role
  - remove member

#### src/controllers/task.controllers.js

- Handles task operations.
- Also handles subtasks.
- Includes creating, updating, deleting, and fetching tasks.

#### src/controllers/note.controllers.js

- Handles creating, getting, updating, and deleting notes.

#### src/controllers/healthchecker.controllers.js

- Returns health status information.

### src/models/

This folder defines the MongoDB schemas.

#### src/models/user.models.js

- User schema.
- Stores:
  - username
  - email
  - password
  - fullName
  - avatar
  - refresh token
  - email verification data
- Also contains helper methods for:
  - password checking
  - generating access tokens
  - generating refresh tokens

#### src/models/project.models.js

- Project schema.
- Stores project name, description, and createdBy.

#### src/models/projectmember.models.js

- Stores which user belongs to which project.
- Also stores the role for that project membership.

#### src/models/task.models.js

- Task schema.
- Stores title, description, project, assigned user, status, priority, attachments.

#### src/models/subtask.models.js

- Subtask schema.
- Stores subtask title, parent task, completion status, and createdBy.

#### src/models/note.models.js

- Note schema.
- Stores content, project, and createdBy.

### src/middlewares/

This folder contains reusable logic executed before controllers.

#### src/middlewares/auth.middleware.js

- verifyJwt
  - checks if access token exists and is valid
- validateProjectPermission
  - checks whether the logged-in user belongs to the project
  - checks role permissions for the requested action

#### src/middlewares/multer.middleware.js

- Handles file uploads.
- Used for task attachments.

#### src/middlewares/validator.middleware.js

- Runs validation rules.
- Ensures request data is valid before controller runs.

### src/validators/

This folder contains input validation rules.

#### src/validators/index.js

- Validates forms like:
  - signup
  - login
  - project creation
  - adding project members
  - task creation/update
  - subtask creation/update
  - note creation

### src/utils/

Shared helper files.

#### src/utils/api-error.js

- Custom error class for API errors.
- Helps send clean error messages.

#### src/utils/api-response.js

- Custom success response wrapper.
- Used to send predictable JSON responses.

#### src/utils/async-handlers.js

- Wraps async functions so errors are passed to the global error handler.

#### src/utils/constants.js

- Shared constants such as:
  - user roles
  - task statuses
  - task priorities

#### src/utils/mail.js

- Sends emails for user verification and password reset.

---

## 3) frontend/ folder (React app)

This folder contains the browser app users see.

### frontend/package.json

- Frontend package configuration.
- Contains scripts like:
  - `npm run dev` → start Vite dev server
  - `npm run build` → build the frontend for production
- Lists frontend dependencies such as React, React DOM, React Router, and Axios.

### frontend/src/

Main frontend source code.

#### frontend/src/main.jsx

- Starts the React app.
- Wraps the app in BrowserRouter.
- Mounts the root app component.

#### frontend/src/App.jsx

- Main app component.
- Configures axios base URL and cookie sending.
- Handles route definitions.
- Checks current logged-in user on page load.
- Handles protected route logic.

#### frontend/src/components/Layout.jsx

- Shared layout component.
- Shows sidebar navigation.
- Provides logout button.
- Used by pages inside the app shell.

### frontend/src/pages/

Each file represents one page.

#### frontend/src/pages/LoginPage.jsx

- User login form.
- Sends login request to backend.
- Stores user in app state after success.

#### frontend/src/pages/SignupPage.jsx

- User registration form.
- Sends signup request to backend.

#### frontend/src/pages/DashboardPage.jsx

- Displays summary info.
- Can show project counts and task counts.

#### frontend/src/pages/ProjectsPage.jsx

- Shows list of projects.
- Allows creating a new project.
- Also supports editing and deleting projects.

#### frontend/src/pages/ProjectDetailsPage.jsx

- Shows details of one project.
- Displays:
  - members
  - tasks
  - notes
- Allows adding members and creating tasks/notes.

#### frontend/src/pages/TasksPage.jsx

- Shows tasks for the selected project.
- Lets user switch between projects.

#### frontend/src/pages/ProfilePage.jsx

- Displays current user information.

### frontend/src/styles.css

- All frontend styling.
- Contains layout, buttons, cards, forms, and responsive styles.

### frontend/vite.config.js

- Vite configuration for the frontend.
- Helps run the app locally and build it for production.

---

## 4) public/ folder

This folder contains publicly served files.

- It is used for static files that the browser can access directly.
- In this project, uploaded images or asset files may be stored here.

Why this matters:

- Some backend logic generates file URLs that point into this folder.
- The server serves files from public, so frontend can load them.

---

## 5) How the full app works together

### Flow 1: Signup

1. User fills signup form in frontend.
2. Frontend sends POST request to backend `/api/v1/auth/register`.
3. Backend validates the request.
4. Backend creates user in MongoDB.
5. Response is sent back to frontend.

### Flow 2: Login

1. User enters email and password.
2. Frontend sends login request.
3. Backend checks email/password.
4. Backend generates access and refresh tokens.
5. Tokens are stored in cookies.
6. Frontend stores the current user in React state.

### Flow 3: Create project

1. User fills project form.
2. Frontend sends POST request to `/api/v1/projects`.
3. Backend saves project to MongoDB.
4. Backend also creates a project member record for the creator.
5. Frontend reloads project list.

### Flow 4: Add member

1. Project owner/admin enters member email.
2. Frontend sends POST to `/api/v1/projects/:projectId/members`.
3. Backend checks that requester has permission.
4. Backend finds the target user and adds them to the project.
5. Frontend updates the members list.

### Flow 5: Create task

1. User enters task details in project page.
2. Frontend sends POST to `/api/v1/tasks/:projectId`.
3. Backend validates task body.
4. Backend saves task to MongoDB.
5. Frontend refreshes the task list.

### Flow 6: Create note

1. User writes note content.
2. Frontend sends POST to `/api/v1/notes/:projectId`.
3. Backend saves note.
4. Frontend refreshes notes section.

---

## 6) Main beginner concepts you should remember

### Backend

- Routes define URLs
- Controllers handle business logic
- Models define database structure
- Middleware handles auth, validation, permissions
- Utils store reusable helpers

### Frontend

- Pages render UI
- State stores application data
- Axios sends HTTP requests
- React re-renders after data changes

### Authentication

- Access token is used for protected requests
- Refresh token renews access token
- Cookies are used so browser sends auth automatically

### Authorization

- Some actions are only allowed for admins
- Some actions are allowed for project admins
- Members can usually view but not edit sensitive things

---

## 7) Best learning order for this project

If you are a beginner, read files in this order:

1. [src/app.js](src/app.js)
2. [src/routes/auth.routes.js](src/routes/auth.routes.js)
3. [src/controllers/auth.controllers.js](src/controllers/auth.controllers.js)
4. [src/middlewares/auth.middleware.js](src/middlewares/auth.middleware.js)
5. [src/models/user.models.js](src/models/user.models.js)
6. [src/routes/project.routes.js](src/routes/project.routes.js)
7. [src/controllers/project.controller.js](src/controllers/project.controller.js)
8. [src/routes/task.routes.js](src/routes/task.routes.js)
9. [src/controllers/task.controllers.js](src/controllers/task.controllers.js)
10. [frontend/src/App.jsx](frontend/src/App.jsx)
11. [frontend/src/pages/ProjectsPage.jsx](frontend/src/pages/ProjectsPage.jsx)
12. [frontend/src/pages/ProjectDetailsPage.jsx](frontend/src/pages/ProjectDetailsPage.jsx)

---

## 8) Quick summary

This app is a full-stack project management system where:

- backend manages data and permissions
- frontend shows screens and triggers API calls
- MongoDB stores all application data
- JWT cookies secure the login session
- route/controller/model structure keeps the code organized

---

## 9) Optional next step

If you want, I can also create:

- a shorter 1-page cheat sheet
- a route-by-route API list
- or a diagram showing how frontend, backend, and MongoDB connect
