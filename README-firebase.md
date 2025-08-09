# Firebase Setup Guide

## Overview
This course website has been configured with Firebase Realtime Database for dynamic content management. The system allows for real-time updates, progress tracking, and analytics.

## Firebase Configuration Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" 
3. Enter project name: `managing-it-projects`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Realtime Database
1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Choose security rules (start in test mode for development)
4. Select database location

### 3. Update Configuration
1. Go to Project Settings > General tab
2. Scroll down to "Your apps" section
3. Click "Web" icon to add web app
4. Register app with name: `managing-it-projects-course`
5. Copy the configuration object
6. Replace the placeholder values in `firebase-config.js` with your actual config

### 4. Initialize Sample Data (Optional)
To populate the database with sample course content:

```javascript
import { initializeSampleData } from './js/sample-data.js';
import CourseManager from './js/course-manager.js';

const courseManager = new CourseManager();
await initializeSampleData(courseManager);
```

## Database Structure

```json
{
  "course": {
    "content": {
      "contentId": {
        "id": "unique-id",
        "title": "Content Title",
        "description": "Description",
        "icon": "🎯",
        "url": "page.html",
        "week": 1,
        "type": "concept|quiz",
        "status": "available|coming-soon",
        "statusText": "Available Now",
        "createdAt": timestamp,
        "lastModified": timestamp
      }
    },
    "progress": {
      "userId": {
        "contentId": {
          "progress": 100,
          "timestamp": timestamp,
          "completed": true
        }
      }
    }
  },
  "analytics": {
    "eventId": {
      "event": "page_view|content_click",
      "data": {},
      "timestamp": timestamp,
      "userAgent": "browser-info"
    }
  }
}
```

## Security Rules
The database rules in `database.rules.json` provide:
- Public read access to course content
- Write access requires authentication for content updates
- User-specific progress tracking
- Analytics logging for authenticated users

## Features Implemented

### Dynamic Content Management
- Load course content from Firebase
- Real-time updates when content changes
- Fallback to static HTML if Firebase isn't configured

### Progress Tracking
- Track user progress through course materials
- Store completion status and timestamps
- User-specific data protection

### Analytics
- Page view tracking
- Content interaction logging
- User behavior analytics

### Real-time Updates
- Content updates propagate immediately
- Subscribe to content changes
- Automatic UI updates

## Development Workflow

1. **Local Development**: Content loads from static HTML
2. **Firebase Integration**: Dynamic content loads from database
3. **Content Management**: Update content through Firebase Console or admin interface
4. **Analytics**: Monitor user engagement and progress

## Next Steps

1. Configure Firebase project with your credentials
2. Deploy security rules: `firebase deploy --only database`
3. Initialize sample data (optional)
4. Set up authentication for content management
5. Deploy to Firebase Hosting: `firebase deploy --only hosting`

## Environment Variables
For production, consider using environment variables for Firebase config:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_DATABASE_URL`
- `FIREBASE_PROJECT_ID`