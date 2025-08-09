class AdminManager {
    constructor(courseManager) {
        this.courseManager = courseManager;
        this.isAdminMode = false;
        this.adminPassword = 'admin123'; // Simple password for demo
        this.init();
        this.checkPersistedAdminMode();
    }

    init() {
        this.createAdminButton();
        this.createAdminModal();
        this.setupEventListeners();
    }

    createAdminButton() {
        const adminButton = document.createElement('button');
        adminButton.id = 'admin-toggle';
        adminButton.innerHTML = '🔧 Admin';
        adminButton.style.cssText = `
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
        document.body.appendChild(adminButton);
    }

    createAdminModal() {
        const modalHTML = `
            <div id="admin-modal" class="admin-modal" style="display: none;">
                <div class="admin-modal-content">
                    <div class="admin-modal-header">
                        <h2 id="modal-title">Admin Login</h2>
                        <span class="admin-close">&times;</span>
                    </div>
                    <div class="admin-modal-body">
                        <div id="admin-login" class="admin-section">
                            <input type="password" id="admin-password" placeholder="Enter admin password" />
                            <button id="admin-login-btn">Login</button>
                        </div>
                        <div id="admin-content-editor" class="admin-section" style="display: none;">
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
            .admin-modal {
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }

            .admin-modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 0;
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }

            .admin-modal-header {
                padding: 20px;
                background: linear-gradient(135deg, #2F5233, #4A7C59);
                color: white;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .admin-modal-header h2 {
                margin: 0;
            }

            .admin-close {
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }

            .admin-modal-body {
                padding: 20px;
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

            #admin-password {
                width: 200px;
                margin-right: 10px;
            }

            #admin-login-btn {
                background: #2F5233;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
            }

            .admin-gear {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(47, 82, 51, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                font-size: 16px;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 100;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
            }

            .admin-gear:hover {
                background: rgba(47, 82, 51, 1);
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }

            .admin-mode .admin-gear {
                display: flex;
            }

            .concept-card {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Admin toggle button - handle both login and logout
        document.getElementById('admin-toggle').addEventListener('click', () => {
            console.log('Admin toggle clicked, current mode:', this.isAdminMode);
            if (this.isAdminMode) {
                this.logoutAdmin();
            } else {
                this.showAdminModal();
            }
        });

        // Modal close
        document.querySelector('.admin-close').addEventListener('click', () => {
            this.hideAdminModal();
        });

        // Login
        document.getElementById('admin-login-btn').addEventListener('click', () => {
            this.handleLogin();
        });

        // Password enter key
        document.getElementById('admin-password').addEventListener('keypress', (e) => {
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
            this.hideAdminModal();
        });

        // Delete content
        document.getElementById('delete-content').addEventListener('click', () => {
            this.deleteContent();
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('admin-modal');
            if (e.target === modal) {
                this.hideAdminModal();
            }
        });
    }

    showAdminModal(contentData = null) {
        console.log('showAdminModal called with contentData:', contentData);
        document.getElementById('admin-modal').style.display = 'block';
        if (this.isAdminMode) {
            this.showContentEditor(contentData);
        } else {
            this.showLoginForm();
        }
    }

    hideAdminModal() {
        document.getElementById('admin-modal').style.display = 'none';
    }

    showLoginForm() {
        document.getElementById('modal-title').textContent = 'Admin Login';
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('admin-content-editor').style.display = 'none';
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }

    showContentEditor(contentData = null) {
        console.log('showContentEditor called with:', contentData);
        
        document.getElementById('modal-title').textContent = contentData ? 'Edit Content' : 'Add New Content';
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-content-editor').style.display = 'block';

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

    handleLogin() {
        const password = document.getElementById('admin-password').value;
        if (password === this.adminPassword) {
            this.isAdminMode = true;
            this.enableAdminMode();
            this.persistAdminMode();
            this.hideAdminModal();
        } else {
            alert('Invalid password');
        }
    }

    enableAdminMode() {
        document.body.classList.add('admin-mode');
        document.getElementById('admin-toggle').innerHTML = '🔧 Admin (ON)';
        this.addGearIcons();
    }

    disableAdminMode() {
        this.isAdminMode = false;
        document.body.classList.remove('admin-mode');
        document.getElementById('admin-toggle').innerHTML = '🔧 Admin';
        this.removeGearIcons();
        this.clearPersistedAdminMode();
    }

    addGearIcons() {
        document.querySelectorAll('.concept-card').forEach(card => {
            if (!card.querySelector('.admin-gear')) {
                const gear = document.createElement('button');
                gear.className = 'admin-gear';
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
        document.querySelectorAll('.admin-gear').forEach(gear => {
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
                this.showAdminModal(contentData);
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
                this.showAdminModal(fallbackData);
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
            
            alert('Content saved successfully!');
            this.hideAdminModal();
            
            // Wait a moment then reload to ensure Firebase sync
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content: ' + error.message);
        }
    }

    async deleteContent() {
        const contentId = document.getElementById('edit-content-id').value;
        if (contentId && contentId !== 'new') {
            if (confirm('Are you sure you want to delete this content?')) {
                try {
                    await this.courseManager.database.ref(`course/content/${contentId}`).remove();
                    alert('Content deleted successfully!');
                    this.hideAdminModal();
                    window.location.reload();
                } catch (error) {
                    console.error('Error deleting content:', error);
                    alert('Error deleting content: ' + error.message);
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
        if (!this.isAdminMode) return;
        
        console.log('Tile clicked in admin mode');
        this.editContent(card);
    }

    // Session persistence methods
    checkPersistedAdminMode() {
        const adminModeSession = sessionStorage.getItem('adminMode');
        if (adminModeSession === 'true') {
            console.log('Restoring admin mode from session');
            this.isAdminMode = true;
            this.enableAdminMode();
            // Add a small delay to ensure DOM is ready for gear icons
            setTimeout(() => {
                this.addGearIcons();
            }, 500);
        }
    }

    persistAdminMode() {
        sessionStorage.setItem('adminMode', 'true');
        console.log('Admin mode persisted to session');
    }

    clearPersistedAdminMode() {
        sessionStorage.removeItem('adminMode');
        console.log('Admin mode cleared from session');
    }

    logoutAdmin() {
        console.log('Logging out of admin mode');
        this.disableAdminMode();
        alert('Logged out of admin mode');
    }
}

// Make AdminManager available globally
window.AdminManager = AdminManager;