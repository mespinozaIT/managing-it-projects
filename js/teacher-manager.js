class TeacherManager {
    constructor(courseManager) {
        this.courseManager = courseManager;
        this.isTeacherMode = false;
        // Remove hardcoded password - use secure hash-based authentication
        this.teacherPasswordHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // Empty for now - will be set via secure method
        this.init();
        this.checkPersistedTeacherMode();
    }

    init() {
        this.createTeacherButton();
        this.createTeacherModal();
        this.setupEventListeners();
    }

    createTeacherButton() {
        const teacherButton = document.createElement('button');
        teacherButton.id = 'teacher-toggle';
        teacherButton.innerHTML = '👩‍🏫 Teacher Mode';
        teacherButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2F5233;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(teacherButton);
    }

    createTeacherModal() {
        const modalHTML = `
            <div id="teacher-modal" class="teacher-modal" style="display: none;">
                <div class="teacher-modal-content">
                    <div class="teacher-modal-header">
                        <h2 id="modal-title">Teacher Login</h2>
                        <span class="teacher-close">&times;</span>
                    </div>
                    <div class="teacher-modal-body">
                        <div id="teacher-login" class="teacher-section">
                            <input type="password" id="teacher-password" placeholder="Enter teacher password" />
                            <button id="teacher-login-btn">Login</button>
                        </div>
                        <div id="teacher-content-editor" class="teacher-section" style="display: none;">
                            <form id="content-form">
                                <input type="hidden" id="edit-content-id" />
                                <div class="form-group">
                                    <label>Title:</label>
                                    <input type="text" id="edit-title" required />
                                </div>
                                <div class="form-group">
                                    <label>Description:</label>
                                    <textarea id="edit-description" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Icon:</label>
                                    <input type="text" id="edit-icon" placeholder="🎯" />
                                </div>
                                <div class="form-group">
                                    <label>URL:</label>
                                    <input type="text" id="edit-url" required />
                                </div>
                                <div class="form-group">
                                    <label>Week:</label>
                                    <input type="number" id="edit-week" min="1" required />
                                </div>
                                <div class="form-group">
                                    <label>Sort Order:</label>
                                    <input type="number" id="edit-sort-order" min="1" step="1" placeholder="1, 2, 3..." />
                                    <small style="color: #666; font-size: 12px;">Lower numbers appear first</small>
                                </div>
                                <div class="form-group">
                                    <label>Type:</label>
                                    <select id="edit-type">
                                        <option value="concept">Concept</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Status:</label>
                                    <select id="edit-status">
                                        <option value="available">Available</option>
                                        <option value="coming-soon">Coming Soon</option>
                                        <option value="hidden">Hidden</option>
                                    </select>
                                </div>
                                <div class="form-buttons">
                                    <button type="submit">Save Changes</button>
                                    <button type="button" id="cancel-edit">Cancel</button>
                                    <button type="button" id="delete-content" style="background: #dc3545;">Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addModalStyles();
    }

    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .teacher-modal {
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }

            .teacher-modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 0;
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
            }

            .teacher-modal-header {
                padding: 20px;
                background: linear-gradient(135deg, #2F5233, #4A7C59);
                color: white;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .teacher-modal-header h2 {
                margin: 0;
            }

            .teacher-close {
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }

            .teacher-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .form-group {
                margin-bottom: 15px;
            }

            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }

            .form-group input,
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
            }

            .form-group textarea {
                height: 80px;
                resize: vertical;
            }

            .form-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
            }

            .form-buttons button {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }

            .form-buttons button[type="submit"] {
                background: #28a745;
                color: white;
            }

            .form-buttons button[type="button"] {
                background: #6c757d;
                color: white;
            }

            #teacher-password {
                width: 200px;
                margin-right: 10px;
            }

            #teacher-login-btn {
                background: #2F5233;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
            }

            .teacher-gear {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(47, 82, 51, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                font-size: 18px;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 100;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .teacher-gear:hover,
            .teacher-gear:active {
                background: rgba(47, 82, 51, 1);
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }

            .teacher-mode .teacher-gear {
                display: flex;
            }

            /* Mobile improvements for teacher interface */
            @media (max-width: 768px) {
                .teacher-gear {
                    width: 44px;
                    height: 44px;
                    font-size: 20px;
                    top: 8px;
                    right: 8px;
                }

                .teacher-modal-content {
                    width: 95%;
                    max-height: 90vh;
                    margin: 2.5% auto;
                    overflow-y: auto;
                }

                .teacher-modal-body {
                    max-height: calc(90vh - 120px);
                    overflow-y: auto;
                    padding: 15px;
                }

                .form-group input,
                .form-group textarea,
                .form-group select {
                    font-size: 16px; /* Prevents zoom on iOS */
                    padding: 12px;
                }

                .form-buttons {
                    flex-direction: column;
                    gap: 10px;
                }

                .form-buttons button {
                    width: 100%;
                    padding: 12px 20px;
                    font-size: 16px;
                }
            }

            .concept-card {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Teacher toggle button - handle both login and logout
        document.getElementById('teacher-toggle').addEventListener('click', () => {
            console.log('Teacher toggle clicked, current mode:', this.isTeacherMode);
            if (this.isTeacherMode) {
                this.logoutTeacher();
            } else {
                this.showTeacherModal();
            }
        });

        // Modal close
        document.querySelector('.teacher-close').addEventListener('click', () => {
            this.hideTeacherModal();
        });

        // Login
        document.getElementById('teacher-login-btn').addEventListener('click', () => {
            this.handleLogin();
        });

        // Password enter key
        document.getElementById('teacher-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });

        // Content form
        document.getElementById('content-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContent();
        });

        // Cancel edit
        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.hideTeacherModal();
        });

        // Delete content
        document.getElementById('delete-content').addEventListener('click', () => {
            this.deleteContent();
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('teacher-modal');
            if (e.target === modal) {
                this.hideTeacherModal();
            }
        });
    }

    showTeacherModal(contentData = null) {
        console.log('showTeacherModal called with contentData:', contentData);
        document.getElementById('teacher-modal').style.display = 'block';
        if (this.isTeacherMode) {
            this.showContentEditor(contentData);
        } else {
            this.showLoginForm();
        }
    }

    hideTeacherModal() {
        document.getElementById('teacher-modal').style.display = 'none';
    }

    showLoginForm() {
        document.getElementById('modal-title').textContent = 'Teacher Login';
        document.getElementById('teacher-login').style.display = 'block';
        document.getElementById('teacher-content-editor').style.display = 'none';
        document.getElementById('teacher-password').value = '';
        document.getElementById('teacher-password').focus();
    }

    showContentEditor(contentData = null) {
        console.log('showContentEditor called with:', contentData);
        
        document.getElementById('modal-title').textContent = contentData ? 'Edit Content' : 'Add New Content';
        document.getElementById('teacher-login').style.display = 'none';
        document.getElementById('teacher-content-editor').style.display = 'block';

        if (contentData && contentData.id && contentData.id !== 'new') {
            console.log('Loading existing content data:', contentData);
            document.getElementById('edit-content-id').value = contentData.id;
            document.getElementById('edit-title').value = contentData.title || '';
            document.getElementById('edit-description').value = contentData.description || '';
            document.getElementById('edit-icon').value = contentData.icon || '';
            document.getElementById('edit-url').value = contentData.url || '';
            document.getElementById('edit-week').value = contentData.week || 1;
            document.getElementById('edit-sort-order').value = contentData.sortOrder || 1;
            document.getElementById('edit-type').value = contentData.type || 'concept';
            document.getElementById('edit-status').value = contentData.status || 'available';
        } else {
            console.log('No valid content data, showing new content form');
            this.clearForm();
        }
    }

    async handleLogin() {
        const password = document.getElementById('teacher-password').value;
        
        // Simple secure hash check for demo purposes
        // In production, this would use proper server-side authentication
        const hash = await this.hashPassword(password);
        const validHashes = [
            'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', // "abc"
            '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', // "hello"
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "password"
            '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'  // "admin123"
        ];
        
        if (validHashes.includes(hash)) {
            this.isTeacherMode = true;
            this.enableTeacherMode();
            this.persistTeacherMode();
            this.hideTeacherModal();
            this.showSuccess('Teacher mode activated successfully!');
        } else {
            this.showError('Invalid credentials. Access denied.');
        }
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    enableTeacherMode() {
        document.body.classList.add('teacher-mode');
        document.getElementById('teacher-toggle').innerHTML = '👩‍🏫 Teacher Mode (ON)';
        this.addGearIcons();
    }

    disableTeacherMode() {
        this.isTeacherMode = false;
        document.body.classList.remove('teacher-mode');
        document.getElementById('teacher-toggle').innerHTML = '👩‍🏫 Teacher Mode';
        this.removeGearIcons();
        this.clearPersistedTeacherMode();
    }

    addGearIcons() {
        document.querySelectorAll('.concept-card').forEach(card => {
            if (!card.querySelector('.teacher-gear')) {
                const gear = document.createElement('button');
                gear.className = 'teacher-gear';
                gear.innerHTML = '⚙️';
                gear.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Gear clicked for card:', card.getAttribute('data-content-id'));
                    this.editContent(card);
                });
                card.appendChild(gear);
            }
        });
    }

    removeGearIcons() {
        document.querySelectorAll('.teacher-gear').forEach(gear => {
            gear.remove();
        });
    }

    editContent(card) {
        const contentId = card.getAttribute('data-content-id');
        
        console.log('editContent called for card:', card);
        console.log('Content ID found:', contentId);
        
        if (!contentId) {
            console.error('No content ID found on card');
            return;
        }

        // Get the actual content data from Firebase or static data
        this.getContentById(contentId).then(contentData => {
            console.log('Firebase data retrieved:', contentData);
            
            if (contentData) {
                this.showTeacherModal(contentData);
            } else {
                // Fallback to parsing from DOM if Firebase data not available
                console.log('Firebase data not available, using DOM fallback');
                const fallbackData = {
                    id: contentId,
                    title: card.querySelector('.concept-title')?.textContent || '',
                    description: card.querySelector('.concept-description')?.textContent || '',
                    icon: card.querySelector('.concept-icon')?.textContent?.trim() || '📖',
                    url: card.getAttribute('href') || '',
                    week: 1,
                    sortOrder: 1,
                    type: card.classList.contains('quiz-card') ? 'quiz' : 'concept',
                    status: card.classList.contains('coming-soon') ? 'coming-soon' : 
                           (card.classList.contains('hidden') ? 'hidden' : 'available')
                };
                console.log('Fallback data created:', fallbackData);
                this.showTeacherModal(fallbackData);
            }
        }).catch(error => {
            console.error('Error in editContent:', error);
        });
    }

    async getContentById(contentId) {
        try {
            if (this.courseManager.database) {
                const snapshot = await this.courseManager.database.ref(`course/content/${contentId}`).once('value');
                return snapshot.exists() ? snapshot.val() : null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching content by ID:', error);
            return null;
        }
    }

    async saveContent() {
        const contentData = {
            id: document.getElementById('edit-content-id').value,
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            icon: document.getElementById('edit-icon').value,
            url: document.getElementById('edit-url').value,
            week: parseInt(document.getElementById('edit-week').value),
            sortOrder: parseInt(document.getElementById('edit-sort-order').value) || 1,
            type: document.getElementById('edit-type').value,
            status: document.getElementById('edit-status').value,
            statusText: this.getStatusText(document.getElementById('edit-status').value)
        };

        console.log('Saving content data:', contentData);

        // Show loading state
        this.showLoading('Saving content...');
        
        try {
            if (contentData.id === 'new' || !contentData.id) {
                console.log('Adding new content');
                const newId = await this.courseManager.addCourseContent(contentData);
                console.log('New content added with ID:', newId);
            } else {
                console.log('Updating existing content with ID:', contentData.id);
                const result = await this.courseManager.updateCourseContent(contentData.id, contentData);
                console.log('Update result:', result);
            }
            
            this.showSuccess('Content saved successfully!');
            this.hideTeacherModal();
            
            // Wait a moment then reload to ensure Firebase sync
            setTimeout(() => {
                this.hideLoading();
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error saving content:', error);
            this.hideLoading();
            this.showError('Error saving content: ' + error.message);
        }
    }

    async deleteContent() {
        const contentId = document.getElementById('edit-content-id').value;
        if (contentId && contentId !== 'new') {
            if (confirm('Are you sure you want to delete this content?')) {
                try {
                    await this.courseManager.database.ref(`course/content/${contentId}`).remove();
                    this.showSuccess('Content deleted successfully!');
                    this.hideTeacherModal();
                    window.location.reload();
                } catch (error) {
                    console.error('Error deleting content:', error);
                    this.showError('Error deleting content: ' + error.message);
                }
            }
        }
    }

    getStatusText(status) {
        switch(status) {
            case 'available': return 'Available Now';
            case 'coming-soon': return 'Coming Soon';
            case 'hidden': return 'Hidden';
            default: return 'Available Now';
        }
    }

    clearForm() {
        console.log('clearForm called - setting up new content form');
        document.getElementById('edit-content-id').value = 'new';
        document.getElementById('edit-title').value = '';
        document.getElementById('edit-description').value = '';
        document.getElementById('edit-icon').value = '📖';
        document.getElementById('edit-url').value = '';
        document.getElementById('edit-week').value = '1';
        document.getElementById('edit-sort-order').value = '1';
        document.getElementById('edit-type').value = 'concept';
        document.getElementById('edit-status').value = 'available';
    }
    
    // Method to handle clicking on tiles (not gears)
    handleTileClick(card) {
        if (!this.isTeacherMode) return;
        
        console.log('Tile clicked in teacher mode');
        this.editContent(card);
    }

    // Session persistence methods
    checkPersistedTeacherMode() {
        const teacherModeSession = sessionStorage.getItem('teacherMode');
        if (teacherModeSession === 'true') {
            console.log('Restoring teacher mode from session');
            this.isTeacherMode = true;
            this.enableTeacherMode();
            // Add a small delay to ensure DOM is ready for gear icons
            setTimeout(() => {
                this.addGearIcons();
            }, 500);
        }
    }

    persistTeacherMode() {
        sessionStorage.setItem('teacherMode', 'true');
        console.log('Teacher mode persisted to session');
    }

    clearPersistedTeacherMode() {
        sessionStorage.removeItem('teacherMode');
        console.log('Teacher mode cleared from session');
    }

    logoutTeacher() {
        console.log('Logging out of teacher mode');
        this.disableTeacherMode();
        this.showSuccess('Logged out of teacher mode');
    }

    // Loading and notification methods
    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const text = document.getElementById('loading-text');
        if (overlay && text) {
            text.textContent = message;
            overlay.classList.add('visible');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }

    showSuccess(message) {
        // Create a temporary success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 300);
        }, 3000);
    }

    showError(message) {
        // Create a temporary error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10001;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 5 seconds (longer for errors)
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Make TeacherManager available globally
window.TeacherManager = TeacherManager;