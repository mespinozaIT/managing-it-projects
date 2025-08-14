const firebaseConfig = {
  apiKey: "AIzaSyDwczlBbLOxiNG009S3BDaP1o_Vxmfq65U",
  authDomain: "managing-it-projects-course.firebaseapp.com",
  databaseURL: "https://managing-it-projects-course-default-rtdb.firebaseio.com/",
  projectId: "managing-it-projects-course",
  storageBucket: "managing-it-projects-course.firebasestorage.app",
  messagingSenderId: "86753677237",
  appId: "1:86753677237:web:cfbea0180c35548c5413fc",
  measurementId: "G-B2VKJQP3VT"
};

// Initialize Firebase using CDN globals
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Initialize analytics only if available
let analytics = null;
try {
    if (firebase.analytics) {
        analytics = firebase.analytics();
    }
} catch (error) {
    console.log('Analytics not available, continuing without it');
}

window.firebaseApp = app;
window.firebaseDatabase = database;
window.firebaseAnalytics = analytics;