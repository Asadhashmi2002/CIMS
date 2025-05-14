# Deploying to Vercel

This document provides instructions for deploying the Coaching Institute application to Vercel.

## Prerequisites

1. A Vercel account: [Sign up here](https://vercel.com/signup) if you don't have one
2. The Vercel CLI installed: `npm install -g vercel`

## Deployment Steps

### 1. Prepare Your Project

Ensure your project has the following files correctly set up:
- `vercel.json` at the project root
- All route handlers in the server/routes directory
- Proper environment variables

### 2. Set Up Environment Variables in Vercel Dashboard

After connecting your GitHub repository to Vercel, add the following environment variables:
- `NODE_ENV`: `production`
- `PORT`: `5000`
- `JWT_SECRET`: `your-secret-key`
- `REACT_APP_API_URL`: `/api`

### 3. Deploy Using Vercel Dashboard

1. Log in to your Vercel account
2. Click "Import Project"
3. Select "Import Git Repository" and connect to your GitHub repo
4. Configure the build settings:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/build`
5. Click "Deploy"

### 4. Troubleshooting

If you encounter 404 errors after deployment:
1. Check Vercel Function Logs to identify the specific request that's failing
2. Ensure that the route endpoints match what the client is requesting
3. Verify that the API path is correct (it should start with `/api/`)
4. Check that the server is properly handling the routes

### 5. Monitoring

After deployment, monitor your application using Vercel's dashboard:
- Check deployment logs for any errors
- Monitor function execution and performance
- Set up alerts for any failures

## Important Notes

- The application uses in-memory data storage for demonstration purposes. In a production environment, you should use a real database.
- Vercel has a serverless architecture, so any data stored in memory will be lost when the function execution completes.
- For a production deployment, consider using a database service like MongoDB Atlas. 