# Task Manager - Client

This is the frontend for the Task Manager application, built with React and Vite.

## Overview

The client application provides a user interface for interacting with the Task Manager API. It allows users to log in, manage their tasks, and if they are an administrator, manage other users.

## Features

-   **Authentication:** Secure login for users.
-   **User Dashboard:**
    -   View all personal tasks.
    -   Add new tasks.
    -   Edit existing tasks.
    -   Delete tasks.
-   **Admin Dashboard:**
    -   View all users in the system.
    -   Add new users (both 'user' and 'admin' roles).
-   **Role-based Access Control:** The application displays different dashboards based on the user's role (either 'user' or 'admin').

## Technologies Used

-   **React:** A JavaScript library for building user interfaces.
-   **Vite:** A fast build tool and development server for modern web projects.
-   **React Router:** For handling routing within the application.
-   **Axios:** For making HTTP requests to the backend API.

## Setup and Installation

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Folder Structure

```
client/
├── src/
│   ├── assets/         # Static assets like images and SVGs
│   ├── pages/          # React components for different pages
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── UserDashboard.jsx
│   ├── App.jsx         # Main application component with routing
│   ├── main.jsx        # Entry point of the React application
│   └── index.css       # Global styles
├── .gitignore
├── index.html          # Main HTML file
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## API Interaction

The frontend communicates with a backend server, which is expected to be running at `http://localhost:5000`. The API endpoints it uses are:
-   `POST /api/auth/login`
-   `GET /api/users`
-   `POST /api/users`
-   `DELETE /api/users/:id`
-   `GET /api/tasks`
-   `POST /api/tasks`
-   `PUT /api/tasks/:id`
-   `DELETE /api/tasks/:id`