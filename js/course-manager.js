class CourseManager {
    constructor() {
        this.listeners = {};
        this.database = window.firebaseDatabase;
    }

    async getCourseContent(week = null, type = null) {
        try {
            const snapshot = await this.database.ref('course/content').once('value');
            
            if (snapshot.exists()) {
                let content = Object.values(snapshot.val());
                
                if (week) {
                    content = content.filter(item => item.week === week);
                }
                
                if (type) {
                    content = content.filter(item => item.type === type);
                }
                
                // Sort by sortOrder, then by title as fallback
                content.sort((a, b) => {
                    const sortA = a.sortOrder || 999;
                    const sortB = b.sortOrder || 999;
                    
                    if (sortA === sortB) {
                        return (a.title || '').localeCompare(b.title || '');
                    }
                    
                    return sortA - sortB;
                });
                
                return content;
            }
            return [];
        } catch (error) {
            console.error('Error fetching course content:', error);
            return [];
        }
    }

    async updateCourseContent(contentId, data) {
        try {
            await this.database.ref(`course/content/${contentId}`).set({
                ...data,
                lastModified: Date.now()
            });
            return true;
        } catch (error) {
            console.error('Error updating course content:', error);
            return false;
        }
    }

    async addCourseContent(data) {
        try {
            const newContentRef = this.database.ref('course/content').push();
            await newContentRef.set({
                ...data,
                id: newContentRef.key,
                createdAt: Date.now(),
                lastModified: Date.now()
            });
            return newContentRef.key;
        } catch (error) {
            console.error('Error adding course content:', error);
            return null;
        }
    }

    subscribeToContent(callback, week = null) {
        const listenerId = Date.now().toString();
        
        const contentRef = this.database.ref('course/content');
        const listener = contentRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                let content = Object.values(snapshot.val());
                
                if (week) {
                    content = content.filter(item => item.week === week);
                }
                
                callback(content);
            } else {
                callback([]);
            }
        });

        this.listeners[listenerId] = { ref: contentRef, listener };
        return listenerId;
    }

    unsubscribeFromContent(listenerId) {
        if (this.listeners[listenerId]) {
            const { ref, listener } = this.listeners[listenerId];
            ref.off('value', listener);
            delete this.listeners[listenerId];
        }
    }

    async trackUserProgress(userId, contentId, progress) {
        try {
            await this.database.ref(`course/progress/${userId}/${contentId}`).set({
                progress: progress,
                timestamp: Date.now(),
                completed: progress >= 100
            });
            return true;
        } catch (error) {
            console.error('Error tracking user progress:', error);
            return false;
        }
    }

    async getUserProgress(userId, contentId = null) {
        try {
            const progressPath = contentId 
                ? `course/progress/${userId}/${contentId}`
                : `course/progress/${userId}`;
            
            const snapshot = await this.database.ref(progressPath).once('value');
            
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return contentId ? null : {};
        } catch (error) {
            console.error('Error fetching user progress:', error);
            return contentId ? null : {};
        }
    }

    async logAnalytics(event, data = {}) {
        try {
            if (!this.database) {
                console.warn('Firebase not initialized, skipping analytics');
                return false;
            }
            
            const newEventRef = this.database.ref('analytics').push();
            await newEventRef.set({
                event: event,
                data: data,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            });
            return true;
        } catch (error) {
            console.warn('Analytics logging failed (this is normal in development):', error.message);
            return false;
        }
    }
}

// Make CourseManager available globally
window.CourseManager = CourseManager;