# 🚀 FinGenius Full-Stack Deployment Guide

## 📋 **Overview**
- **Frontend**: Vercel (Free Tier)
- **Backend**: Render (Free Tier)
- **Database**: MongoDB Atlas (Free Tier)

## 🎯 **Step-by-Step Deployment**

### **Step 1: Prepare Your Repository**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### **Step 2: Deploy Backend on Render**

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure Service**
   - **Name**: `fingenius-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   BASE_PATH=/api
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fingenius
   JWT_SECRET=your_very_long_random_secret_key
   JWT_REFRESH_SECRET=your_very_long_random_refresh_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   RESEND_API_KEY=your_resend_api_key
   RESEND_MAILER_SENDER=your_email@domain.com
   FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Note your backend URL: `https://your-app.onrender.com`

### **Step 3: Deploy Frontend on Vercel**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the `client` directory

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Note your frontend URL: `https://your-app.vercel.app`

### **Step 4: Update Backend CORS**

1. **Update Backend Environment**
   - Go back to Render dashboard
   - Update `FRONTEND_ORIGIN` with your Vercel URL
   - Redeploy the backend

### **Step 5: Test Your Deployment**

1. **Health Check**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

2. **Frontend Test**
   - Visit your Vercel URL
   - Test registration/login
   - Test all features

## 🔧 **Required Services Setup**

### **MongoDB Atlas (Free)**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to Render environment variables

### **Google AI (Gemini) - Free**
1. Go to [makersuite.google.com](https://makersuite.google.com)
2. Get API key
3. Add to Render environment variables

### **Cloudinary (Free)**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get credentials
4. Add to Render environment variables

### **Resend (Free)**
1. Go to [resend.com](https://resend.com)
2. Create account
3. Get API key
4. Add to Render environment variables

## 🌐 **Final URLs**

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Base**: `https://your-backend.onrender.com/api`

## 🔍 **Troubleshooting**

### **Frontend Issues**
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend
- Check browser console for errors

### **Backend Issues**
- Check Render logs
- Verify all environment variables
- Test health endpoint

### **Database Issues**
- Check MongoDB connection string
- Verify network access
- Check database indexes

## 📊 **Free Tier Limits**

### **Vercel (Frontend)**
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ Global CDN

### **Render (Backend)**
- ⚠️ 750 hours/month (free tier)
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ 512MB RAM
- ✅ Automatic HTTPS

### **MongoDB Atlas**
- ✅ 512MB storage
- ✅ Shared clusters
- ✅ Basic monitoring

## 🚀 **Performance Tips**

1. **Enable Caching** in Vercel
2. **Use CDN** for static assets
3. **Optimize Images** with Cloudinary
4. **Monitor** Render usage
5. **Set up Alerts** for downtime

## 🔒 **Security Checklist**

- ✅ HTTPS enabled
- ✅ CORS configured
- ✅ Rate limiting active
- ✅ JWT authentication
- ✅ Input validation
- ✅ Security headers

Your FinGenius app is now deployed for free! 🎉 