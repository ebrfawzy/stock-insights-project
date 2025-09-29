# Railway Deployment Guide

This guide explains how to deploy your Stock Insights project to Railway.app.

## 🚀 Quick Deployment

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "Deploy from GitHub repo"
   - Select this repository

2. **Set Environment Variables**
   Copy the variables from `.env.railway` to your Railway project:
   ```bash
   DEBUG=False
   SECRET_KEY=your-super-secret-key-here-change-this-in-production
   ALLOWED_HOSTS=.railway.app,localhost,127.0.0.1
   FRONTEND_URL=https://your-frontend-app.railway.app
   RAILWAY_ENVIRONMENT=production
   ```

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "Add Service"
   - Select "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

## 📁 Project Structure for Railway

```
├── backend/                 # Django backend
│   ├── requirements.txt    # Python dependencies (includes gunicorn, psycopg2)
│   └── stock_api/
│       └── settings.py     # Railway-optimized settings
├── frontend/               # Angular frontend
│   └── src/environments/
│       ├── environment.ts      # Development config
│       └── environment.prod.ts # Production config
├── railway.json           # Railway deployment configuration
├── Dockerfile            # Multi-stage build for Railway
└── .env.railway         # Environment variables template
```

## ⚙️ Configuration Details

### Django Settings (`backend/stock_api/settings.py`)
- ✅ **Debug Mode**: Automatically disabled in production
- ✅ **Database**: Uses Railway's PostgreSQL via `DATABASE_URL`
- ✅ **Static Files**: Configured with WhiteNoise for Railway
- ✅ **CORS**: Properly configured for Railway domains
- ✅ **Allowed Hosts**: Includes `.railway.app` domain

### Railway Configuration (`railway.json`)
- **Build**: Installs frontend and backend dependencies
- **Deploy**: Runs migrations, collects static files, starts gunicorn
- **Health Check**: Uses Django admin endpoint
- **Workers**: 3 gunicorn workers with 120s timeout

### Production Dependencies (`backend/requirements.txt`)
- `gunicorn`: WSGI server for production
- `dj-database-url`: PostgreSQL connection parsing
- `psycopg2-binary`: PostgreSQL adapter
- `whitenoise`: Static file serving

## 🔧 Environment Variables

Set these in your Railway project dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `DEBUG` | Django debug mode | `False` |
| `SECRET_KEY` | Django secret key | `your-secret-key` |
| `ALLOWED_HOSTS` | Allowed domains | `.railway.app,yourdomain.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.railway.app` |
| `RAILWAY_ENVIRONMENT` | Environment indicator | `production` |

## 🌐 URLs and Endpoints

After deployment, your app will be available at:
- **Backend API**: `https://your-backend-app.railway.app`
- **Frontend**: `https://your-frontend-app.railway.app` (if deployed separately)
- **Admin Panel**: `https://your-backend-app.railway.app/admin/`

## 📦 Deployment Process

Railway automatically:
1. Installs frontend dependencies (`npm ci`)
2. Builds the frontend (`npm run build --configuration=production`)
3. Installs Python dependencies
4. Runs database migrations
5. Collects static files
6. Starts the application with gunicorn

## 🔍 Troubleshooting

### Common Issues:

1. **Static Files Not Loading**
   - Ensure `STATIC_ROOT` is set correctly
   - WhiteNoise middleware is properly configured

2. **Database Connection Issues**
   - Verify PostgreSQL service is added
   - Check `DATABASE_URL` environment variable

3. **CORS Errors**
   - Update `FRONTEND_URL` environment variable
   - Check CORS settings in Django

4. **Build Failures**
   - Check build logs in Railway dashboard
   - Verify all dependencies are in requirements.txt
   - Ensure Angular CLI is in devDependencies (not production dependencies)
   - Make sure `npm ci` installs all dependencies (not `npm ci --only=production`)

### Logs and Monitoring:
- View logs in Railway dashboard
- Use Railway CLI: `railway logs`
- Monitor health check endpoint: `/admin/`

## 🚀 Custom Domain (Optional)

To use a custom domain:
1. Add domain in Railway dashboard
2. Update `ALLOWED_HOSTS` environment variable
3. Configure DNS records as shown in Railway

## 📝 Notes

- The `docker-compose.yml` file is for local development only
- Railway uses `railway.json` and `Dockerfile` for deployment
- Database migrations run automatically on each deployment
- Static files are served by WhiteNoise in production
