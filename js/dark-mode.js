// Advanced Dark Mode System
class DarkModeSystem {
    constructor() {
        this.isDarkMode = false;
        this.toggle = null;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    init() {
        // Check for saved preference or system preference
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            this.isDarkMode = savedMode === 'true';
        } else {
            this.isDarkMode = this.prefersDark.matches;
        }

        this.createToggle();
        this.addStyles();
        this.applyMode(false);
        this.setupEventListeners();
    }

    createToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'dark-mode-toggle';
        toggle.className = 'dark-mode-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = `
            <span class="toggle-icon sun">☀️</span>
            <span class="toggle-icon moon">🌙</span>
            <span class="toggle-slider"></span>
        `;
        
        // Position it in the top right
        document.body.appendChild(toggle);
        this.toggle = toggle;
    }

    addStyles() {
        if (document.getElementById('dark-mode-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
            /* Dark Mode Toggle */
            .dark-mode-toggle {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 60px;
                height: 30px;
                background: #ddd;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 2px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .dark-mode-toggle:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .toggle-icon {
                font-size: 16px;
                z-index: 2;
                transition: opacity 0.3s ease;
            }

            .toggle-slider {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 26px;
                height: 26px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .dark-mode .dark-mode-toggle {
                background: #4a5568;
            }

            .dark-mode .toggle-slider {
                transform: translateX(30px);
                background: #2d3748;
            }

            .dark-mode .sun {
                opacity: 0.3;
            }

            .moon {
                opacity: 0.3;
            }

            .dark-mode .moon {
                opacity: 1;
            }

            .sun {
                opacity: 1;
            }

            /* Dark Mode Styles */
            .dark-mode {
                background: #1a202c !important;
                color: #e2e8f0 !important;
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            .dark-mode .container {
                background: #2d3748 !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
            }

            .dark-mode .header {
                background: linear-gradient(135deg, #2d3748, #4a5568) !important;
            }

            .dark-mode .content {
                background: #2d3748 !important;
            }

            .dark-mode .concept-card {
                background: #1a202c !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .concept-card:hover {
                background: #2d3748 !important;
                border-color: #81c784 !important;
            }

            .dark-mode .concept-title {
                color: #81c784 !important;
            }

            .dark-mode .concept-description {
                color: #e2e8f0 !important;
            }

            .dark-mode .course-info-banner {
                background: linear-gradient(135deg, #2d3748, #1a202c) !important;
            }

            .dark-mode .info-label {
                color: #cbd5e0 !important;
            }

            .dark-mode .info-value {
                color: #e2e8f0 !important;
            }

            .dark-mode .footer {
                background: #1a202c !important;
                border-top-color: #4a5568 !important;
            }

            .dark-mode .footer-section h3 {
                color: #81c784 !important;
            }

            .dark-mode .footer-link {
                background: #2d3748 !important;
                color: #e2e8f0 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .footer-link:hover {
                background: #4a5568 !important;
                border-color: #81c784 !important;
            }

            /* Form Elements */
            .dark-mode input,
            .dark-mode textarea,
            .dark-mode select {
                background: #1a202c !important;
                color: #e2e8f0 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode input:focus,
            .dark-mode textarea:focus,
            .dark-mode select:focus {
                border-color: #81c784 !important;
                outline-color: #81c784 !important;
            }

            /* Buttons */
            .dark-mode button:not(.dark-mode-toggle) {
                background: #4a5568 !important;
                color: #e2e8f0 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode button:not(.dark-mode-toggle):hover {
                background: #2d3748 !important;
                border-color: #81c784 !important;
            }

            /* Status badges */
            .dark-mode .status-available {
                background: #2f855a !important;
                color: #f0fff4 !important;
            }

            .dark-mode .status-coming-soon {
                background: #d69e2e !important;
                color: #fffbeb !important;
            }

            .dark-mode .status-hidden {
                background: #e53e3e !important;
                color: #fff5f5 !important;
            }

            /* Tables */
            .dark-mode table {
                background: #2d3748 !important;
            }

            .dark-mode th {
                background: #1a202c !important;
                color: #e2e8f0 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode td {
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode tr:nth-child(even) {
                background: #1a202c !important;
            }

            /* Quiz specific styles */
            .dark-mode .quiz-option {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .quiz-option:hover {
                border-color: #81c784 !important;
                background: #1a202c !important;
            }

            .dark-mode .question-card {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
            }

            .dark-mode .option {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .option:hover {
                border-color: #81c784 !important;
                background: #1a202c !important;
            }

            /* Specific page styles */
            .dark-mode .pmi-overview,
            .dark-mode .principles-grid,
            .dark-mode .domains-grid,
            .dark-mode .certification-note {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .principle-card,
            .dark-mode .domain-card {
                background: #1a202c !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .principle-title,
            .dark-mode .domain-title {
                color: #81c784 !important;
            }

            .dark-mode .stat-item {
                background: #1a202c !important;
                border-left-color: #81c784 !important;
            }

            /* Scrollbars */
            .dark-mode ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            .dark-mode ::-webkit-scrollbar-track {
                background: #1a202c;
            }

            .dark-mode ::-webkit-scrollbar-thumb {
                background: #4a5568;
                border-radius: 4px;
            }

            .dark-mode ::-webkit-scrollbar-thumb:hover {
                background: #6b7280;
            }

            /* Images and media */
            .dark-mode img:not([src*=".svg"]) {
                filter: brightness(0.9) contrast(1.1);
            }

            /* Loading states */
            .dark-mode .skeleton {
                background: linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%);
            }

            /* Mobile adjustments */
            @media (max-width: 768px) {
                .dark-mode-toggle {
                    top: 60px;
                    right: 15px;
                    width: 50px;
                    height: 25px;
                }

                .toggle-slider {
                    width: 21px !important;
                    height: 21px !important;
                }

                .dark-mode .toggle-slider {
                    transform: translateX(25px) !important;
                }

                .toggle-icon {
                    font-size: 14px;
                }
            }

            /* Project Definition page specific styles */
            .dark-mode .example-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .example-card.personal {
                border-color: #81c784 !important;
            }

            .dark-mode .example-card.personal .example-why {
                color: #81c784 !important;
            }

            .dark-mode .example-pm-concepts {
                background: #1a202c !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .example-pm-concepts strong {
                color: #81c784 !important;
            }

            .dark-mode .example-content {
                color: #cbd5e0 !important;
            }

            .dark-mode .example-scenario {
                color: #e2e8f0 !important;
            }

            .dark-mode .example-why {
                color: #ffd54f !important;
            }

            .dark-mode .characteristic-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .characteristic-title {
                color: #81c784 !important;
            }

            .dark-mode .characteristic-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .characteristics-grid {
                background: #1a202c !important;
                border-color: #4a5568 !important;
            }

            /* Override all dark green colors for better contrast */
            .dark-mode h1,
            .dark-mode h2,
            .dark-mode h3,
            .dark-mode h4,
            .dark-mode .footer h3,
            .dark-mode .assignment-requirements p,
            .dark-mode .section-title,
            .dark-mode .concept-title,
            .dark-mode .principle-title,
            .dark-mode .domain-title {
                color: #81c784 !important;
            }

            /* Ensure all dark text colors are visible */
            .dark-mode p,
            .dark-mode li,
            .dark-mode .description,
            .dark-mode .content,
            .dark-mode .text-content {
                color: #e2e8f0 !important;
            }

            /* Fix any remaining dark gray and dark green text */
            .dark-mode [style*="color: #333"],
            .dark-mode [style*="color: #666"],
            .dark-mode [style*="color: #333333"],
            .dark-mode [style*="color: #666666"],
            .dark-mode [style*="color: #495057"],
            .dark-mode [style*="color: #2d5d3b"],
            .dark-mode [style*="color:#2d5d3b"] {
                color: #e2e8f0 !important;
            }

            /* Fix elements with dark green borders and backgrounds */
            .dark-mode [style*="border-color: #2d5d3b"],
            .dark-mode [style*="border-color:#2d5d3b"],
            .dark-mode .people,
            .dark-mode .blue-heading {
                border-color: #81c784 !important;
                color: #81c784 !important;
            }

            /* Fix any remaining #2d5d3b backgrounds */
            .dark-mode [style*="background: #2d5d3b"],
            .dark-mode [style*="background:#2d5d3b"] {
                background: #81c784 !important;
            }

            /* Override CSS variables for shared styles */
            .dark-mode {
                --text-primary: #e2e8f0 !important;
                --text-secondary: #cbd5e0 !important;
            }

            /* Comprehensive dark text color overrides */
            .dark-mode * {
                color: inherit;
            }
            
            .dark-mode *[style*="color:#333"],
            .dark-mode *[style*="color: #333"],
            .dark-mode *[style*="color:#666"],
            .dark-mode *[style*="color: #666"],
            .dark-mode *[style*="color:#333333"],
            .dark-mode *[style*="color: #333333"],
            .dark-mode *[style*="color:#666666"],
            .dark-mode *[style*="color: #666666"] {
                color: #e2e8f0 !important;
            }

            .dark-mode .story-time-header h2 {
                color: #81c784 !important;
            }

            .dark-mode .assignment-header {
                color: #81c784 !important;
            }

            /* Lesson Navigation - "📍 On This Page" */
            .dark-mode .lesson-navigation {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
            }

            .dark-mode .lesson-navigation h3 {
                color: #81c784 !important;
            }

            .dark-mode .nav-links li a {
                background: #1a202c !important;
                color: #e2e8f0 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .nav-links li a:hover {
                background: #81c784 !important;
                color: #1a202c !important;
            }

            /* Story Time and Assignment sections */
            .dark-mode .story-time-section {
                background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%) !important;
                border-color: #81c784 !important;
            }

            .dark-mode .assignment-section {
                background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%) !important;
                border-color: #81c784 !important;
            }

            .dark-mode .story-subtitle {
                color: #cbd5e0 !important;
            }

            .dark-mode .story-intro {
                color: #e2e8f0 !important;
            }

            .dark-mode .story-unlock-message {
                background: rgba(129, 199, 132, 0.1) !important;
                border-color: #81c784 !important;
            }

            .dark-mode .story-unlock-message p {
                color: #cbd5e0 !important;
            }

            /* Story project content */
            .dark-mode .story-project-summary strong {
                color: #81c784 !important;
            }

            .dark-mode .story-quick-preview {
                background: #2d3748 !important;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3) !important;
            }

            .dark-mode .story-mini-card {
                background: #1a202c !important;
                color: #e2e8f0 !important;
                border-left-color: #81c784 !important;
            }

            /* Assignment sections */
            .dark-mode .assignment-instructions,
            .dark-mode .assignment-objective,
            .dark-mode .assignment-expectations {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .assignment-instructions h3,
            .dark-mode .assignment-objective h3,
            .dark-mode .assignment-expectations h3 {
                color: #81c784 !important;
            }

            .dark-mode .assignment-instructions ul,
            .dark-mode .assignment-expectations ul,
            .dark-mode .assignment-instructions li,
            .dark-mode .assignment-expectations li {
                color: #e2e8f0 !important;
            }

            .dark-mode .assignment-requirements {
                background: #1a202c !important;
                border-left-color: #81c784 !important;
            }

            .dark-mode .assignment-requirements p {
                color: #81c784 !important;
            }

            .dark-mode .assignment-requirements ul {
                color: #e2e8f0 !important;
            }

            /* Story content and buttons */
            .dark-mode .story-introduction {
                color: #e2e8f0 !important;
            }

            .dark-mode .story-button {
                background: linear-gradient(135deg, #81c784, #66bb6a) !important;
                color: #1a202c !important;
                box-shadow: 0 8px 25px rgba(129, 199, 132, 0.3) !important;
            }

            .dark-mode .story-button:hover {
                background: linear-gradient(135deg, #66bb6a, #4caf50) !important;
                color: #1a202c !important;
                box-shadow: 0 12px 35px rgba(129, 199, 132, 0.4) !important;
            }

            .dark-mode .story-button-subtitle {
                color: #1a202c !important;
                opacity: 0.8;
            }

            /* Assignment button - make it more accessible in dark mode */
            .dark-mode .assignment-button {
                background: linear-gradient(135deg, #81c784, #66bb6a) !important;
                color: #1a202c !important;
                box-shadow: 0 8px 25px rgba(129, 199, 132, 0.3) !important;
            }

            .dark-mode .assignment-button:hover {
                background: linear-gradient(135deg, #66bb6a, #4caf50) !important;
                color: #1a202c !important;
                box-shadow: 0 12px 35px rgba(129, 199, 132, 0.4) !important;
            }

            .dark-mode .assignment-button-subtitle {
                color: #1a202c !important;
                opacity: 0.8;
            }

            /* Project Management Definition page specific styles */
            .dark-mode .definition-box {
                background: #2d3748 !important;
                border-color: #81c784 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .element-card {
                background: #2d3748 !important;
                color: #e2e8f0 !important;
                border-color: #81c784 !important;
            }

            .dark-mode .element-card h3 {
                color: #81c784 !important;
            }

            .dark-mode .element-card p {
                color: #cbd5e0 !important;
            }

            .dark-mode .musts-grid {
                background: #1a202c !important;
                border-color: #81c784 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .must-item {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .must-item h3 {
                color: #81c784 !important;
            }

            .dark-mode .must-card {
                background: #2d3748 !important;
                border-color: #81c784 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .must-card::before {
                background: #81c784 !important;
                color: #1a202c !important;
            }

            .dark-mode .not-section {
                background: #2d1b1b !important;
                border-color: #f56565 !important;
            }

            .dark-mode .not-item {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .not-item h3 {
                color: #f56565 !important;
            }

            .dark-mode .not-item p {
                color: #cbd5e0 !important;
            }

            /* Additional page-specific elements */
            .dark-mode .skills-grid {
                background: #1a202c !important;
                border-color: #81c784 !important;
            }

            .dark-mode .skill-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .skill-title {
                color: #81c784 !important;
            }

            .dark-mode .skill-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .manager-card {
                background: #2d3748 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .manager-title {
                color: #81c784 !important;
            }

            .dark-mode .manager-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .pmo-type-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .pmo-type-title {
                color: #81c784 !important;
            }

            .dark-mode .quiz-header {
                background: linear-gradient(135deg, #81c784, #66bb6a) !important;
                color: #1a202c !important;
            }

            .dark-mode .mode-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .mode-title {
                color: #81c784 !important;
            }

            .dark-mode .mode-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .timeline-item {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
            }

            .dark-mode .timeline-date {
                color: #81c784 !important;
            }

            .dark-mode .timeline-title {
                color: #e2e8f0 !important;
            }

            .dark-mode .timeline-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .misconception-card {
                background: #2d1b1b !important;
                border-color: #f56565 !important;
            }

            .dark-mode .misconception-title {
                color: #f56565 !important;
            }

            .dark-mode .misconception-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .future-weeks-section {
                background: #2d3748 !important;
            }

            .dark-mode .future-weeks-title {
                color: #81c784 !important;
            }

            .dark-mode .future-weeks-content {
                color: #e2e8f0 !important;
            }

            /* Quiz specific dark mode overrides */
            .dark-mode .quiz-option p {
                color: #e2e8f0 !important;
            }

            .dark-mode .question-counter {
                color: #cbd5e0 !important;
            }

            .dark-mode .quiz-option li {
                color: #e2e8f0 !important;
            }

            .dark-mode .scenario-text {
                background: rgba(129, 199, 132, 0.1) !important;
                color: #81c784 !important;
                border-left-color: #81c784 !important;
            }

            /* Matrix organization cards */
            .dark-mode .matrix-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .matrix-title {
                color: #81c784 !important;
            }

            .dark-mode .matrix-description {
                color: #e2e8f0 !important;
            }

            .dark-mode .matrix-visual {
                background: #1a202c !important;
            }

            /* Manager definition sections */
            .dark-mode .manager-definition {
                background: #2d3748 !important;
                color: #e2e8f0 !important;
            }

            /* PMO Functions grid */
            .dark-mode .functions-grid {
                background: #1a202c !important;
            }

            .dark-mode .function-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .function-title {
                color: #81c784 !important;
            }

            .dark-mode .function-description {
                color: #cbd5e0 !important;
            }

            /* PMI Principles grid */
            .dark-mode .principles-grid {
                background: #1a202c !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .principle-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .principle-title {
                color: #81c784 !important;
            }

            .dark-mode .principle-description {
                color: #cbd5e0 !important;
            }

            /* Certification reminder */
            .dark-mode .cert-reminder {
                background: #2d3748 !important;
                color: #e2e8f0 !important;
                border-color: #f56565 !important;
            }

            .dark-mode .cert-reminder strong {
                color: #f56565 !important;
            }

            .dark-mode .cert-reminder small {
                color: #cbd5e0 !important;
            }

            /* Quiz game info */
            .dark-mode .game-info {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
            }

            .dark-mode .game-info h3 {
                color: #81c784 !important;
            }

            .dark-mode .game-info ul,
            .dark-mode .game-info li {
                color: #e2e8f0 !important;
            }

            .dark-mode .game-info strong {
                color: #81c784 !important;
            }

            /* Course Syllabus specific dark mode overrides */
            .dark-mode .course-info-grid {
                background: #2d3748 !important;
            }

            .dark-mode .info-card {
                background: rgba(129, 199, 132, 0.1) !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .info-label {
                color: #cbd5e0 !important;
            }

            .dark-mode .info-value {
                color: #e2e8f0 !important;
            }

            .dark-mode .section h2 {
                color: #81c784 !important;
                border-bottom-color: #81c784 !important;
            }

            .dark-mode .section h3 {
                color: #81c784 !important;
            }

            .dark-mode .section p {
                color: #e2e8f0 !important;
            }

            .dark-mode .outcome-card {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .outcome-number {
                background: #81c784 !important;
                color: #1a202c !important;
            }

            .dark-mode .outcome-text {
                color: #e2e8f0 !important;
            }

            .dark-mode .grading-table {
                background: #2d3748 !important;
            }

            .dark-mode .grading-table th {
                background: #1a202c !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .grading-table td {
                color: #e2e8f0 !important;
                border-bottom-color: #4a5568 !important;
            }

            .dark-mode .grading-table tr:hover {
                background: #1a202c !important;
            }

            .dark-mode .grade-item {
                background: #2d3748 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .highlight-box {
                background: rgba(129, 199, 132, 0.1) !important;
                border-left-color: #81c784 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .highlight-box h3 {
                color: #81c784 !important;
            }

            .dark-mode .highlight-box p {
                color: #e2e8f0 !important;
            }

            .dark-mode .highlight-box a {
                color: #81c784 !important;
            }

            .dark-mode .policy-card {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .policy-card h4 {
                color: #81c784 !important;
            }

            .dark-mode .policy-card p {
                color: #e2e8f0 !important;
            }

            .dark-mode .policy-card ul {
                color: #e2e8f0 !important;
            }

            .dark-mode .policy-card li {
                color: #e2e8f0 !important;
            }

            .dark-mode .policy-card strong {
                color: #81c784 !important;
            }

            .dark-mode .contact-info {
                background: linear-gradient(135deg, #2d3748, #1a202c) !important;
            }

            .dark-mode .contact-label {
                color: #cbd5e0 !important;
            }

            .dark-mode .contact-value {
                color: #e2e8f0 !important;
            }

            /* Class Expectations specific dark mode overrides */
            .dark-mode .tabs {
                background: #1a202c !important;
                border-bottom-color: #81c784 !important;
            }

            .dark-mode .tab {
                background: #2d3748 !important;
                color: #cbd5e0 !important;
                border-color: #4a5568 !important;
            }

            .dark-mode .tab:hover {
                background: #81c784 !important;
                color: #1a202c !important;
                border-color: #81c784 !important;
            }

            .dark-mode .tab.active {
                background: #e2e8f0 !important;
                color: #1a202c !important;
                border-color: #81c784 !important;
                border-bottom-color: #e2e8f0 !important;
            }

            .dark-mode .philosophy-card {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .philosophy-card:hover {
                border-color: #81c784 !important;
            }

            .dark-mode .philosophy-title {
                color: #81c784 !important;
            }

            .dark-mode .philosophy-description {
                color: #e2e8f0 !important;
            }

            .dark-mode .rule-item {
                background: #2d3748 !important;
                border-left-color: #f56565 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .rule-title {
                color: #e2e8f0 !important;
            }

            .dark-mode .rule-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .rule-details {
                color: #e2e8f0 !important;
            }

            .dark-mode .rule-details ul {
                color: #e2e8f0 !important;
            }

            .dark-mode .rule-details strong {
                color: #81c784 !important;
            }

            .dark-mode .ai-section {
                background: #2d3748 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .ai-section.encouraged {
                border-left-color: #81c784 !important;
            }

            .dark-mode .ai-section.discouraged {
                border-left-color: #f56565 !important;
            }

            .dark-mode .ai-section h3 {
                color: #e2e8f0 !important;
            }

            .dark-mode .ai-section ul {
                color: #e2e8f0 !important;
            }

            .dark-mode .ai-section li {
                color: #cbd5e0 !important;
            }

            .dark-mode .help-flow {
                background: #2d3748 !important;
            }

            .dark-mode .help-flow h3 {
                color: #e2e8f0 !important;
            }

            .dark-mode .help-flow p {
                color: #e2e8f0 !important;
            }

            .dark-mode .help-step {
                background: rgba(129, 199, 132, 0.1) !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .step-number {
                color: #81c784 !important;
            }

            .dark-mode .quote-box {
                background: #2d3748 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .improvement-card {
                background: #2d3748 !important;
                border-left-color: #81c784 !important;
                border-color: #4a5568 !important;
                color: #e2e8f0 !important;
            }

            .dark-mode .improvement-title {
                color: #81c784 !important;
            }

            .dark-mode .improvement-card .rule-description {
                color: #cbd5e0 !important;
            }

            .dark-mode .improvement-card .rule-details {
                color: #e2e8f0 !important;
            }

            .dark-mode .improvement-card .rule-details strong {
                color: #81c784 !important;
            }

            .dark-mode .improvement-card ul {
                color: #e2e8f0 !important;
            }

            .dark-mode .improvement-card li {
                color: #e2e8f0 !important;
            }

            .dark-mode .footer-return {
                background: #2d3748 !important;
            }

            .dark-mode .footer-return h3 {
                color: #e2e8f0 !important;
            }

            /* Override inline styles for philosophy section */
            .dark-mode [style*="color: #666"] {
                color: #e2e8f0 !important;
            }

            /* Open Door Policy section with inline styles */
            .dark-mode [style*="background: #e8f5e8"] {
                background: rgba(129, 199, 132, 0.1) !important;
            }

            .dark-mode [style*="color: #2d5d3b"] {
                color: #81c784 !important;
            }

            /* Final coverage completions for 100% dark mode support */
            .dark-mode .blue-heading {
                color: #81c784 !important;
            }

            .dark-mode .red-heading {
                color: #f56565 !important;
            }

            /* Enhanced inline style coverage for #495057 */
            .dark-mode [style*="color: #495057"],
            .dark-mode [style*="color:#495057"] {
                color: #e2e8f0 !important;
            }

            /* PMI-specific link overrides */
            .dark-mode a[style*="color: #2d5d3b"] {
                color: #81c784 !important;
            }

            /* Additional specific overrides for #666 and #333 colors */
            .dark-mode .intro p,
            .dark-mode .description,
            .dark-mode .element-description,
            .dark-mode .must-description,
            .dark-mode .not-description,
            .dark-mode .misconception-description,
            .dark-mode .scenario-description,
            .dark-mode .quiz-description {
                color: #e2e8f0 !important;
            }

            /* Footer */
            .dark-mode .footer {
                background: #1a202c !important;
            }

            .dark-mode .footer h3 {
                color: #81c784 !important;
            }

            .dark-mode .footer p {
                color: #cbd5e0 !important;
            }

            /* Smooth transitions for theme changes */
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        this.toggle.addEventListener('click', () => {
            this.toggleMode();
        });

        // Listen for system theme changes
        this.prefersDark.addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                this.isDarkMode = e.matches;
                this.applyMode(true);
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleMode();
            }
        });
    }

    toggleMode() {
        this.isDarkMode = !this.isDarkMode;
        this.applyMode(true);
        this.savePreference();
    }

    applyMode(animate = false) {
        const body = document.body;
        
        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
        }

        // Update toggle state
        if (this.toggle) {
            this.toggle.setAttribute('aria-pressed', this.isDarkMode.toString());
        }

        // Animate transition if requested
        if (animate) {
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        }

        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor();
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = this.isDarkMode ? '#1a202c' : '#2F5233';
    }

    savePreference() {
        localStorage.setItem('darkMode', this.isDarkMode.toString());
    }

    // Public methods
    enable() {
        this.isDarkMode = true;
        this.applyMode(true);
        this.savePreference();
    }

    disable() {
        this.isDarkMode = false;
        this.applyMode(true);
        this.savePreference();
    }

    isEnabled() {
        return this.isDarkMode;
    }
}

// Initialize dark mode system
window.addEventListener('DOMContentLoaded', () => {
    window.darkMode = new DarkModeSystem();
});