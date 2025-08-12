// Advanced Search System
class SearchSystem {
    constructor() {
        this.searchIndex = [];
        this.searchInput = null;
        this.searchResults = null;
        this.isSearchVisible = false;
        this.debounceTimer = null;
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.createSearchInterface();
        this.addStyles();
        this.setupEventListeners();
    }

    buildSearchIndex() {
        // Define all searchable content
        this.searchIndex = [
            {
                id: 'pm_definition',
                title: 'Project Management Definition',
                description: 'Core definition plus the "Musts" of PM and common misconceptions. Foundation concept covering what PM is and is NOT.',
                url: 'project-management-definition.html',
                keywords: ['project management', 'definition', 'PM', 'misconceptions', 'foundation'],
                type: 'concept',
                week: 1
            },
            {
                id: 'project_definition',
                title: 'Project Definition',
                description: 'What makes something a project? Includes characteristics and real examples from both professional IT and personal contexts.',
                url: 'project-definition.html',
                keywords: ['project', 'definition', 'characteristics', 'examples', 'IT'],
                type: 'concept',
                week: 1
            },
            {
                id: 'pm_role',
                title: 'Project Manager Definition',
                description: 'Role definition, essential skills, PM vs Functional Manager differences, and key people in project teams.',
                url: 'project-manager-role.html',
                keywords: ['project manager', 'role', 'skills', 'functional manager', 'team'],
                type: 'concept',
                week: 1
            },
            {
                id: 'pmo',
                title: 'PMO Definition',
                description: 'What is a Project Management Office and the different types of PMOs in organizations.',
                url: 'project-management-office-definition.html',
                keywords: ['PMO', 'project management office', 'organization', 'types'],
                type: 'concept',
                week: 1
            },
            {
                id: 'pmi',
                title: 'PMI & PMBOK Guide',
                description: 'Project Management Institute Standards & Framework including 12 PM Principles and 8 Project Performance Domains.',
                url: 'PMI.html',
                keywords: ['PMI', 'PMBOK', 'principles', 'domains', 'standards', 'framework'],
                type: 'concept',
                week: 1
            },
            {
                id: 'quiz',
                title: 'Week 1 Quiz Challenge',
                description: 'Test your knowledge with concepts and scenarios quiz covering foundation PM knowledge.',
                url: 'week-1-quiz.html',
                keywords: ['quiz', 'test', 'assessment', 'concepts', 'scenarios'],
                type: 'quiz',
                week: 1
            },
            {
                id: 'outline',
                title: 'Week 1 Outline',
                description: 'Class structure analysis and activity breakdown for Week 1 foundation concepts.',
                url: 'week-1-outline.html',
                keywords: ['outline', 'structure', 'activities', 'breakdown'],
                type: 'outline',
                week: 1
            },
            {
                id: 'syllabus',
                title: 'Course Syllabus',
                description: 'Complete course overview, grading breakdown, schedule, and learning outcomes.',
                url: 'course-syllabus.html',
                keywords: ['syllabus', 'grading', 'schedule', 'outcomes', 'overview'],
                type: 'info',
                week: 0
            },
            {
                id: 'expectations',
                title: 'Class Expectations',
                description: 'Teaching philosophy, ground rules, AI policy, and course evolution information.',
                url: 'class-expectations.html',
                keywords: ['expectations', 'philosophy', 'rules', 'AI', 'policy'],
                type: 'info',
                week: 0
            },
            {
                id: 'experience',
                title: 'Professional Experience',
                description: 'Instructor background including Trader Joes projects and leadership experience.',
                url: 'professional-experience.html',
                keywords: ['experience', 'background', 'trader joes', 'leadership'],
                type: 'info',
                week: 0
            },
            {
                id: 'journey',
                title: 'Professional Journey',
                description: 'Career timeline and educational background in project management and technology.',
                url: 'journey.html',
                keywords: ['journey', 'career', 'timeline', 'education', 'technology'],
                type: 'info',
                week: 0
            }
        ];
    }

    createSearchInterface() {
        // Create search overlay
        const searchOverlay = document.createElement('div');
        searchOverlay.id = 'search-overlay';
        searchOverlay.className = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <input type="text" 
                               id="search-input" 
                               placeholder="Search concepts, topics, or content..." 
                               autocomplete="off"
                               aria-label="Search course content">
                        <button id="search-close" aria-label="Close search">&times;</button>
                    </div>
                </div>
                <div class="search-body">
                    <div id="search-results" class="search-results"></div>
                    <div id="search-suggestions" class="search-suggestions">
                        <div class="suggestions-section">
                            <h4>Quick Access</h4>
                            <div class="suggestion-pills">
                                <button class="suggestion-pill" data-query="quiz">Quiz</button>
                                <button class="suggestion-pill" data-query="definition">Definitions</button>
                                <button class="suggestion-pill" data-query="PMI">PMI</button>
                                <button class="suggestion-pill" data-query="project manager">PM Role</button>
                            </div>
                        </div>
                        <div class="suggestions-section">
                            <h4>Browse by Type</h4>
                            <div class="suggestion-pills">
                                <button class="suggestion-pill" data-filter="concept">Concepts</button>
                                <button class="suggestion-pill" data-filter="quiz">Quizzes</button>
                                <button class="suggestion-pill" data-filter="info">Course Info</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(searchOverlay);

        // Create search trigger button
        const searchTrigger = document.createElement('button');
        searchTrigger.id = 'search-trigger';
        searchTrigger.className = 'search-trigger';
        searchTrigger.innerHTML = `
            <span class="search-icon">🔍</span>
            <span class="search-text">Search</span>
            <span class="search-shortcut">Ctrl+K</span>
        `;
        searchTrigger.setAttribute('aria-label', 'Open search');
        document.body.appendChild(searchTrigger);

        // Store references
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchOverlay = searchOverlay;
    }

    addStyles() {
        if (document.getElementById('search-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'search-styles';
        style.textContent = `
            .search-trigger {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid #ddd;
                border-radius: 25px;
                padding: 10px 20px;
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .search-trigger:hover {
                background: white;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                transform: translateX(-50%) translateY(-2px);
            }

            .search-shortcut {
                background: #f1f3f4;
                color: #666;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                font-family: monospace;
            }

            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(4px);
            }

            .search-overlay.show {
                opacity: 1;
            }

            .search-container {
                max-width: 600px;
                margin: 80px auto 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }

            .search-overlay.show .search-container {
                transform: translateY(0);
            }

            .search-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
            }

            .search-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            #search-input {
                width: 100%;
                padding: 15px 50px 15px 20px;
                border: 2px solid #2F5233;
                border-radius: 8px;
                font-size: 16px;
                outline: none;
                transition: border-color 0.2s ease;
            }

            #search-input:focus {
                border-color: #4A7C59;
            }

            #search-close {
                position: absolute;
                right: 10px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            #search-close:hover {
                background: #f5f5f5;
                color: #333;
            }

            .search-body {
                max-height: 60vh;
                overflow-y: auto;
            }

            .search-results {
                padding: 0 20px;
            }

            .search-result {
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .search-result:hover {
                background: #f8f9fa;
                margin: 0 -20px;
                padding: 15px 20px;
            }

            .search-result:last-child {
                border-bottom: none;
            }

            .result-title {
                font-size: 16px;
                font-weight: 600;
                color: #2F5233;
                margin-bottom: 5px;
            }

            .result-description {
                color: #666;
                font-size: 14px;
                line-height: 1.4;
                margin-bottom: 8px;
            }

            .result-meta {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 12px;
                color: #999;
            }

            .result-type {
                background: #e3f2fd;
                color: #1565c0;
                padding: 2px 8px;
                border-radius: 12px;
                text-transform: capitalize;
            }

            .result-week {
                background: #f3e5f5;
                color: #7b1fa2;
                padding: 2px 8px;
                border-radius: 12px;
            }

            .search-suggestions {
                padding: 20px;
                background: #fafafa;
            }

            .suggestions-section {
                margin-bottom: 20px;
            }

            .suggestions-section:last-child {
                margin-bottom: 0;
            }

            .suggestions-section h4 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 14px;
            }

            .suggestion-pills {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .suggestion-pill {
                background: white;
                border: 1px solid #ddd;
                border-radius: 20px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .suggestion-pill:hover {
                background: #2F5233;
                color: white;
                border-color: #2F5233;
            }

            .no-results {
                text-align: center;
                padding: 40px 20px;
                color: #666;
            }

            .no-results-icon {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }

            .highlight {
                background: #fff3cd;
                padding: 2px 4px;
                border-radius: 3px;
                font-weight: 600;
            }

            @media (max-width: 768px) {
                .search-container {
                    margin: 20px;
                    max-width: none;
                }

                .search-trigger {
                    position: relative;
                    top: auto;
                    left: auto;
                    transform: none;
                    margin: 20px;
                    width: fit-content;
                }

                .search-trigger .search-text {
                    display: none;
                }

                .suggestion-pills {
                    justify-content: center;
                }
            }

            /* Dark mode support */
            .dark-mode .search-trigger {
                background: rgba(45, 55, 72, 0.95);
                color: #e2e8f0;
                border-color: #4a5568;
            }

            .dark-mode .search-container {
                background: #2d3748;
                color: #e2e8f0;
            }

            .dark-mode #search-input {
                background: #1a202c;
                color: #e2e8f0;
                border-color: #4a5568;
            }

            .dark-mode .search-suggestions {
                background: #1a202c;
            }

            .dark-mode .result-title {
                color: #81c784;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Search trigger
        document.getElementById('search-trigger').addEventListener('click', () => {
            this.showSearch();
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Close search
        document.getElementById('search-close').addEventListener('click', () => {
            this.hideSearch();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showSearch();
            }
            
            // Escape to close search
            if (e.key === 'Escape' && this.isSearchVisible) {
                this.hideSearch();
            }
        });

        // Suggestion pills
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-pill')) {
                const query = e.target.dataset.query;
                const filter = e.target.dataset.filter;
                
                if (query) {
                    this.searchInput.value = query;
                    this.handleSearch(query);
                } else if (filter) {
                    this.filterResults(filter);
                }
            }
        });

        // Click outside to close
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.hideSearch();
            }
        });
    }

    showSearch() {
        this.isSearchVisible = true;
        this.searchOverlay.style.display = 'block';
        setTimeout(() => {
            this.searchOverlay.classList.add('show');
            this.searchInput.focus();
        }, 10);
        
        // Show initial suggestions
        this.showSuggestions();
    }

    hideSearch() {
        this.isSearchVisible = false;
        this.searchOverlay.classList.remove('show');
        setTimeout(() => {
            this.searchOverlay.style.display = 'none';
            this.searchInput.value = '';
            this.showSuggestions();
        }, 300);
    }

    handleSearch(query) {
        // Clear previous debounce
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Debounce search
        this.debounceTimer = setTimeout(() => {
            if (query.trim() === '') {
                this.showSuggestions();
                return;
            }

            const results = this.performSearch(query);
            this.displayResults(results, query);
        }, 150);
    }

    performSearch(query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        const results = [];

        this.searchIndex.forEach(item => {
            let score = 0;
            const searchableText = `${item.title} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();

            // Check for exact matches in title (highest score)
            if (item.title.toLowerCase().includes(query.toLowerCase())) {
                score += 10;
            }

            // Check for matches in keywords
            item.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(query.toLowerCase())) {
                    score += 5;
                }
            });

            // Check for individual term matches
            searchTerms.forEach(term => {
                const termCount = (searchableText.match(new RegExp(term, 'g')) || []).length;
                score += termCount * 2;
            });

            // Check for fuzzy matches
            searchTerms.forEach(term => {
                if (this.fuzzyMatch(searchableText, term)) {
                    score += 1;
                }
            });

            if (score > 0) {
                results.push({ ...item, score });
            }
        });

        // Sort by score (descending)
        return results.sort((a, b) => b.score - a.score);
    }

    fuzzyMatch(text, term) {
        // Simple fuzzy matching - checks if term letters appear in order
        let textIndex = 0;
        for (let i = 0; i < term.length; i++) {
            textIndex = text.indexOf(term[i], textIndex);
            if (textIndex === -1) return false;
            textIndex++;
        }
        return true;
    }

    displayResults(results, query) {
        document.getElementById('search-suggestions').style.display = 'none';

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>Try different keywords or check the suggestions below</p>
                </div>
            `;
            document.getElementById('search-suggestions').style.display = 'block';
            return;
        }

        const resultsHtml = results.map(result => `
            <div class="search-result" data-url="${result.url}">
                <div class="result-title">${this.highlightMatch(result.title, query)}</div>
                <div class="result-description">${this.highlightMatch(result.description, query)}</div>
                <div class="result-meta">
                    <span class="result-type">${result.type}</span>
                    ${result.week > 0 ? `<span class="result-week">Week ${result.week}</span>` : ''}
                </div>
            </div>
        `).join('');

        this.searchResults.innerHTML = resultsHtml;

        // Add click handlers
        this.searchResults.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', () => {
                window.location.href = result.dataset.url;
            });
        });
    }

    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    filterResults(type) {
        const filtered = this.searchIndex.filter(item => item.type === type);
        this.displayResults(filtered, '');
        this.searchInput.value = `type:${type}`;
    }

    showSuggestions() {
        this.searchResults.innerHTML = '';
        document.getElementById('search-suggestions').style.display = 'block';
    }
}

// Initialize search system
window.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new SearchSystem();
});