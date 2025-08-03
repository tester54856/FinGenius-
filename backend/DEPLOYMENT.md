# 🚀 FinGenius Backend Deployment Guide

## Render Deployment

### Prerequisites
- MongoDB Atlas account
- Google AI (Gemini) API key
- Cloudinary account
- Resend account for email

### Environment Variables Required

Set these in your Render dashboard:

#### Required Variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fingenius
JWT_SECRET=your_very_long_random_secret_key
JWT_REFRESH_SECRET=your_very_long_random_refresh_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RESEND_API_KEY=your_resend_api_key
RESEND_MAILER_SENDER=your_email@domain.com
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

#### Optional Variables (with defaults):
```
NODE_ENV=production
PORT=10000
BASE_PATH=/api
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure Environment**
   - Set all required environment variables
   - Set build command: `npm install`
   - Set start command: `npm start`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Check health endpoint: `https://your-app.onrender.com/health`

### Health Check
The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Troubleshooting

1. **Build Fails**
   - Check Node.js version (requires >=18)
   - Verify all dependencies are in package.json

2. **Runtime Errors**
   - Check environment variables are set correctly
   - Verify MongoDB connection string
   - Check logs in Render dashboard

3. **CORS Issues**
   - Ensure FRONTEND_ORIGIN is set correctly
   - Check if frontend URL is accessible

### Security Features
- ✅ Helmet security headers
- ✅ Rate limiting (100 req/15min general, 5 req/15min auth)
- ✅ CORS protection
- ✅ JWT authentication
- ✅ Input validation with Zod
- ✅ Password hashing with bcrypt

### Performance Optimizations
- ✅ Database indexing
- ✅ Request size limits (10MB)
- ✅ Graceful shutdown handling
- ✅ Error handling middleware 