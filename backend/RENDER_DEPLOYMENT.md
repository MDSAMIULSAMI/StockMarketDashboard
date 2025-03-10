# Deploying to Render

This document provides instructions for deploying the Stock Market Dashboard API to Render.

## Prerequisites

1. A Render account (https://render.com)
2. Git repository with your project

## Steps for Deployment

### 1. Create a PostgreSQL Database

1. Log in to your Render dashboard
2. Click on "New" and select "PostgreSQL"
3. Configure your database:
   - Name: `stockmarket-db` (or your preferred name)
   - Database: `stockmarket`
   - User: Render will generate this
   - Region: Choose one close to your target audience
4. Click "Create Database"
5. Make note of the "Internal Database URL" - you'll need this for the web service

### 2. Create a Web Service

1. From your Render dashboard, click on "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the web service:

   - Name: `stockmarket-api` (or your preferred name)
   - Runtime: Python
   - Build Command: `./build.sh`
   - Start Command: `gunicorn stockmarket_project.wsgi:application`
   - Region: Choose one close to your target audience

4. Add environment variables:

   - `DATABASE_URL`: Paste the internal database URL from your PostgreSQL service
   - `SECRET_KEY`: Generate a secure random key (you can use https://djecrety.ir/)
   - `DEBUG`: Set to 'False'
   - `PYTHON_VERSION`: '3.10.0' (or your preferred version)

5. Select the plan you want to use (Free or paid)

6. Click "Create Web Service"

### 3. Loading Initial Data (Optional)

If you want to load your initial dataset:

1. After your service is deployed, go to the "Shell" tab
2. Run: `python manage.py loaddata initial_data.json`

### 4. Update CORS Settings (When Deploying Frontend)

When you deploy your frontend:

1. Update the `CORS_ALLOWED_ORIGINS` in `settings.py` to include your frontend URL
2. Redeploy the backend service

### 5. Checking Deployment

Once deployed, your API will be available at:
`https://YOUR-SERVICE-NAME.onrender.com/api/`

## Troubleshooting

- **Build Failures**: Check the build logs for errors. Common issues include:

  - Missing dependencies
  - Python version incompatibility
  - Database connection issues

- **Database Migration Errors**: You may need to manually run migrations:

  1. Go to the "Shell" tab
  2. Run: `python manage.py migrate`

- **CORS Issues**: Ensure your frontend URL is added to `CORS_ALLOWED_ORIGINS`

## Updating Your Deployment

When you push changes to your repository, Render will automatically redeploy your application.

## Monitoring

Render provides logs and metrics for your service. Check the "Logs" tab to troubleshoot issues.
