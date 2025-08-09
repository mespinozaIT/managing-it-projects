export const sampleCourseData = {
  "course": {
    "content": {
      "week1_pm_definition": {
        "id": "week1_pm_definition",
        "title": "Project Management Definition",
        "description": "Core definition plus the \"Musts\" of PM and common misconceptions. Foundation concept covering what PM is and is NOT.",
        "icon": "🎯",
        "url": "project-management-definition.html",
        "week": 1,
        "type": "concept",
        "status": "available",
        "statusText": "Available Now",
        "createdAt": Date.now(),
        "lastModified": Date.now()
      },
      "week1_project_definition": {
        "id": "week1_project_definition", 
        "title": "Project Definition",
        "description": "What makes something a project? Includes characteristics and real examples from both professional IT and personal contexts.",
        "icon": "📋",
        "url": "project-definition.html",
        "week": 1,
        "type": "concept", 
        "status": "available",
        "statusText": "Available Now",
        "createdAt": Date.now(),
        "lastModified": Date.now()
      },
      "week1_pm_role": {
        "id": "week1_pm_role",
        "title": "Project Manager Definition", 
        "description": "Role definition, essential skills, PM vs Functional Manager differences, and key people in project teams.",
        "icon": "👤",
        "url": "project-manager-role.html",
        "week": 1,
        "type": "concept",
        "status": "available",
        "statusText": "Available Now",
        "createdAt": Date.now(),
        "lastModified": Date.now()
      },
      "week1_pmo": {
        "id": "week1_pmo",
        "title": "PMO Definition",
        "description": "What is a Project Management Office and the different types of PMOs in organizations.",
        "icon": "🏢", 
        "url": "project-management-office-definition.html",
        "week": 1,
        "type": "concept",
        "status": "available",
        "statusText": "Available Now",
        "createdAt": Date.now(),
        "lastModified": Date.now()
      },
      "week1_pmi": {
        "id": "week1_pmi",
        "title": "PMI & PMBOK Guide",
        "description": "Project Management Institute overview, PMBOK Guide structure, PM Principles, and Performance Domains.",
        "icon": "📚",
        "url": "PMI.html", 
        "week": 1,
        "type": "concept",
        "status": "available",
        "statusText": "Available Now",
        "createdAt": Date.now(),
        "lastModified": Date.now()
      },
      "week1_quiz": {
        "id": "week1_quiz",
        "title": "Week 1 Quiz Challenge",
        "description": "Test your knowledge with interactive quizzes! Choose between Concepts or Scenarios - both with immediate feedback and explanations.",
        "icon": "🎮",
        "url": "week-1-quiz.html",
        "week": 1,
        "type": "quiz",
        "status": "available", 
        "statusText": "Test Yourself",
        "createdAt": Date.now(),
        "lastModified": Date.now()
      }
    }
  }
};

export async function initializeSampleData(courseManager) {
  try {
    console.log('Initializing sample data...');
    
    for (const [contentId, contentData] of Object.entries(sampleCourseData.course.content)) {
      await courseManager.updateCourseContent(contentId, contentData);
    }
    
    console.log('Sample data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return false;
  }
}