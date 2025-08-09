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
const analytics = firebase.analytics();

window.firebaseApp = app;
window.firebaseDatabase = database;
window.firebaseAnalytics = analytics;