## Vercel Deployment Process for Task Manager Backend and Frontend (Monorepo)

This document outlines the steps to deploy your Node.js/Express backend and React frontend, which are located in the same Git repository, to Vercel. This setup allows for seamless continuous deployment of both parts of your application.

### 1. Prepare your Project

I have created a `vercel.json` file in the **root** of your project (`/home/murad/AppDev/ArafLogix/PortfolioProject/task_manager_mh/`). This single file configures Vercel to correctly build and route both your Node.js backend and your React frontend.

**Important:** Ensure this `vercel.json` file is in the root of your repository, not inside the `server` or `client` directories.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node",
      "config": { "includeFiles": ["server/**"] }
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

**Explanation of `vercel.json`:**
*   `builds`: Defines how each part of your application is built.
    *   The first `build` entry specifies that `server/index.js` should be treated as a Node.js serverless function (`@vercel/node`). `"config": { "includeFiles": ["server/**"] }` ensures all necessary files within the `server` directory are included in the build.
    *   The second `build` entry specifies that `client/package.json` should be built as a static site (`@vercel/static-build`). `"config": { "distDir": "dist" }` tells Vercel that your React application (built with Vite) outputs its production files into a `dist` directory within the `client` folder.
*   `routes`: Defines how incoming requests are routed.
    *   `"src": "/api/(.*)", "dest": "server/index.js"`: Any request starting with `/api/` will be directed to your backend serverless function.
    *   `"src": "/(.*)", "dest": "client/$1"`: All other requests will be served by your frontend static application.

### 2. Create a Git Repository and Push Your Code

If you haven't already, initialize a Git repository in your project root (`/home/murad/AppDev/ArafLogix/PortfolioProject/task_manager_mh/`), commit your code (including the new `vercel.json` in the root), and push it to a remote GitHub repository.

```bash
git init
git add .
git commit -m "Initial commit for Task Manager (monorepo setup)"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI (Manual Deployment)

1.  **Install Vercel CLI (if you haven't already):**
    ```bash
npm install -g vercel
    ```
2.  **Navigate to your project root directory:**
    ```bash
cd /home/murad/AppDev/ArafLogix/PortfolioProject/task_manager_mh
    ```
3.  **Run the Vercel deploy command:**
    ```bash
vercel
    ```
    Follow the prompts. When asked about the project directory, ensure you select or specify the **root** directory (it should be the default if you are in the root).

#### Option B: Deploy via Vercel Dashboard (Recommended for Auto-Deployment)

This is the recommended method as it allows for automatic deployments on every push to your GitHub repository.

1.  **Go to Vercel:** Open your web browser and go to [vercel.com](https://vercel.com/).
2.  **Log In/Sign Up:** Log in to your Vercel account or sign up if you don't have one.
3.  **Add New Project:** Click on "Add New..." -> "Project".
4.  **Import Git Repository:** Select "Continue with GitHub" (or your preferred Git provider). You might need to grant Vercel access to your GitHub repositories.
5.  **Choose Your Repository:** Select the GitHub repository where you pushed your Task Manager code.
6.  **Configure Project:**
    *   **Root Directory:** This is crucial. **Leave the Root Directory field empty or set it to `/` (the default).** Vercel will automatically detect the `vercel.json` file in your repository's root and configure both your frontend and backend builds based on its content.
    *   **Build and Output Settings:** Vercel will automatically detect that your `client` directory is a React project (Vite) and your `server` directory is a Node.js project. The `vercel.json` handles the specific build commands and output directories.
    *   **Environment Variables:** Add your environment variables under the "Environment Variables" section. These are essential for your backend to connect to MongoDB and for JWT secret.
        *   `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://user:password@cluster.mongodb.net/mydatabase?retryWrites=true&w=majority`)
        *   `JWT_SECRET`: A strong, secret key for JWT (e.g., `your_super_secret_jwt_key`)
        *   `PORT`: You can omit this, as Vercel will assign a port. If you include it, it won't be used by Vercel's serverless function environment.
7.  **Deploy:** Click the "Deploy" button. Vercel will now build and deploy both your frontend and backend.

### 4. Auto-Deployment with GitHub

Once you've connected your GitHub repository to Vercel via the dashboard (Option B above), Vercel automatically sets up continuous deployment. This means:

*   **Every push to your connected Git branch (e.g., `main`) will trigger a new deployment.**
*   Vercel will build your project and deploy it to a unique preview URL.
*   When you merge changes into your production branch (usually `main`), Vercel will automatically update your production deployment.

This streamlines your development workflow, as you don't need to manually deploy after every change.

### 5. After Deployment

*   Vercel will provide you with a unique URL for your deployed application (e.g., `https://your-project-name.vercel.app`).
*   Your frontend will be served from the root of this URL, and your API endpoints will be accessible under `/api/` (e.g., `https://your-project-name.vercel.app/api/auth/login`).
*   Ensure your frontend is configured to make API calls to `/api/` (relative path) or the full Vercel URL if you are testing locally against the deployed backend.

Let me know if you have any questions during the process!