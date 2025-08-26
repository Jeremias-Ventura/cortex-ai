# Deployment Guide - Cortex AI to Vercel

## Overview
This project has been restructured to deploy as a single application on Vercel using serverless functions for the backend API.

## What Changed
- ✅ **Backend**: Converted Express routes to Vercel API routes (`/api/chat/*`)
- ✅ **Frontend**: Updated all API calls to use relative paths (`/api/chat/*`)
- ✅ **Dependencies**: Added server dependencies to client package.json
- ✅ **Configuration**: Added vercel.json for proper routing

## Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env.local` file in the client directory with:
```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Chat Password (for demo access)
REACT_APP_CHAT_PASSWORD=your_chat_password_here
```

### 2. GitHub Repository
- Ensure all changes are committed and pushed to GitHub
- Repository should be public or you should have Vercel Pro for private repos

## Deployment Steps

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the `client` folder as the root directory

### Step 2: Configure Build Settings
Vercel should auto-detect these settings:
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install --legacy-peer-deps`

### Step 3: Set Environment Variables
In Vercel dashboard, go to Settings → Environment Variables and add:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `REACT_APP_CHAT_PASSWORD`

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at `https://your-project.vercel.app`

## API Endpoints
After deployment, your API will be available at:
- `/api/chat` - Regular chat
- `/api/chat/stream` - Streaming chat (GET/POST)
- `/api/chat/start` - Start new session
- `/api/chat/save` - Save message
- `/api/chat/sessions` - Get sessions
- `/api/chat/complete` - Vision chat
- `/api/chat/[session_id]` - Get session messages
- `/api/chat/test-supabase` - Test Supabase connection

## Testing
1. Visit your deployed URL
2. Enter the password from `REACT_APP_CHAT_PASSWORD`
3. Test chat functionality
4. Test image uploads (if applicable)

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install --legacy-peer-deps`
- Check that environment variables are set in Vercel

### API Errors
- Verify environment variables are correct
- Check Vercel function logs for errors
- Ensure Supabase and OpenAI API keys are valid

### CORS Issues
- API routes are served from the same domain, so CORS shouldn't be an issue

## Notes
- This is a demo deployment (4 days)
- Password protection is client-side (sufficient for demo)
- All API calls now use relative paths
- Serverless functions have 60-second timeout
