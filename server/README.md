# Task Manager - Server

This is the backend for the Task Manager application, built with Node.js, Express, and MongoDB.

## Overview

This server provides a RESTful API for managing users and tasks. It includes authentication, role-based access control, and standard CRUD operations for tasks.

## Features

-   **Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
-   **User Management:** Admins can create new users and view all existing users.
-   **Task Management:** Authenticated users can perform CRUD operations (Create, Read, Update, Delete) on their own tasks.
-   **Role-Based Access Control:** The API restricts certain actions (like managing users) to admin roles only.
-   **Password Hashing:** User passwords are securely hashed using `bcryptjs` before being stored.

## Technologies Used

-   **Node.js:** A JavaScript runtime environment.
-   **Express:** A web application framework for Node.js.
-   **MongoDB:** A NoSQL database for storing user and task data.
-   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
-   **JSON Web Token (JWT):** For creating access tokens for authentication.
-   **bcryptjs:** For hashing passwords.
-   **dotenv:** For managing environment variables.

## Setup and Installation

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the `server` directory and add the following environment variables.

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    PORT=5000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (default is 5000).

## Database Seeding

To populate the database with initial admin and user accounts, you can run the seed script. Make sure your server is not running when you do this.

```bash
node seed.js
```

This will create two users with the password `123456`:
-   `admin@demo.com` (role: admin)
-   `user@demo.com` (role: user)

## API Endpoints

### Auth Routes

-   **`POST /api/auth/register`**
    -   **Description:** Registers a new user.
    -   **Body:** `{ "name": "Test User", "email": "test@example.com", "password": "password123" }`
    -   **Response:** `{ "message": "User registered" }`

-   **`POST /api/auth/login`**
    -   **Description:** Logs in a user and returns a JWT token.
    -   **Body:** `{ "email": "test@example.com", "password": "password123" }`
    -   **Response:** `{ "token": "...", "role": "user", "name": "Test User" }`

### User Routes (Admin Only)

*Authentication required: Bearer Token*
*Authorization required: `admin` role*

-   **`GET /api/users`**
    -   **Description:** Retrieves a list of all users.
    -   **Response:** `[{ "_id": "...", "name": "...", "email": "...", "role": "..." }]`

-   **`POST /api/users`**
    -   **Description:** Creates a new user.
    -   **Body:** `{ "name": "New User", "email": "new@example.com", "password": "password123", "role": "user" }`
    -   **Response:** `{ "message": "User created successfully" }`

### Task Routes

*Authentication required: Bearer Token*

-   **`GET /api/tasks`**
    -   **Description:** Retrieves all tasks for the authenticated user.
    -   **Response:** `[{ "_id": "...", "title": "...", "description": "...", "userId": "..." }]`

-   **`POST /api/tasks`**
    -   **Description:** Creates a new task for the authenticated user.
    -   **Body:** `{ "title": "My New Task", "description": "Task details" }`
    -   **Response:** `{ "_id": "...", "title": "My New Task", ... }`

-   **`PUT /api/tasks/:id`**
    -   **Description:** Updates a specific task for the authenticated user.
    -   **Body:** `{ "title": "Updated Title", "description": "Updated details" }`
    -   **Response:** `{ "_id": "...", "title": "Updated Title", ... }`

-   **`DELETE /api/tasks/:id`**
    -   **Description:** Deletes a specific task for the authenticated user.
    -   **Response:** `{ "message": "Task deleted" }`
