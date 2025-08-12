// Progressive Loading and Skeleton Screen System
class ProgressiveLoader {
    constructor() {
        this.loadingStates = new Map();
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.createGlobalLoadingOverlay();
        this.setupIntersectionObserver();
        this.addSkeletonStyles();
        this.implementProgressiveLoading();
        this.setupImageLazyLoading();
    }

    createGlobalLoadingOverlay() {
        // Enhanced loading overlay
        const existingOverlay = document.getElementById('loading-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay enhanced';
        overlay.innerHTML = `
            <div class="loading-container">
                <div class="loading-logo">
                    <div class="logo-icon">📚</div>
                    <div class="logo-text">Managing IT Projects</div>
                </div>
                <div class="loading-spinner-container">
                    <div class="loading-spinner enhanced"></div>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="loading-text" id="loading-text">Loading course content...</div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="loading-progress-fill"></div>
                    </div>
                    <div class="progress-percentage" id="loading-percentage">0%</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Simulate loading progress
        this.simulateLoadingProgress();
    }

    simulateLoadingProgress() {
        const progressFill = document.getElementById('loading-progress-fill');
        const percentageText = document.getElementById('loading-percentage');
        const loadingText = document.getElementById('loading-text');
        
        if (!progressFill || !percentageText || !loadingText) return;

        const stages = [
            { progress: 20, text: 'Loading core scripts...' },
            { progress: 40, text: 'Initializing components...' },
            { progress: 60, text: 'Setting up user interface...' },
            { progress: 80, text: 'Loading course data...' },
            { progress: 100, text: 'Ready!' }
        ];

        let currentStage = 0;
        const updateProgress = () => {
            if (currentStage < stages.length) {
                const stage = stages[currentStage];
                progressFill.style.width = stage.progress + '%';
                percentageText.textContent = stage.progress + '%';
                loadingText.textContent = stage.text;
                currentStage++;
                
                setTimeout(updateProgress, 300 + Math.random() * 400);
            } else {
                setTimeout(() => {
                    this.hideGlobalLoading();
                }, 500);
            }
        };

        setTimeout(updateProgress, 500);
    }

    hideGlobalLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
    }

    addSkeletonStyles() {
        if (document.getElementById('skeleton-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'skeleton-styles';
        style.textContent = `
            /* Enhanced Loading Overlay */
            .loading-overlay.enhanced {
                background: linear-gradient(135deg, #2F5233, #4A7C59);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .loading-container {
                text-align: center;
                color: white;
                max-width: 400px;
                padding: 40px;
            }

            .loading-logo {
                margin-bottom: 40px;
            }

            .logo-icon {
                font-size: 64px;
                margin-bottom: 16px;
                animation: bounce 2s infinite;
            }

            .logo-text {
                font-size: 24px;
                font-weight: bold;
                opacity: 0.9;
            }

            .loading-spinner-container {
                position: relative;
                margin: 40px auto;
                width: 80px;
                height: 80px;
            }

            .loading-spinner.enhanced {
                width: 80px;
                height: 80px;
                border: 3px solid rgba(255, 255, 255, 0.2);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-dots {
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 8px;
            }

            .loading-dots span {
                width: 8px;
                height: 8px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                animation: pulse 1.4s ease-in-out infinite both;
            }

            .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
            .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
            .loading-dots span:nth-child(3) { animation-delay: 0s; }

            .loading-text {
                font-size: 16px;
                margin-bottom: 30px;
                opacity: 0.8;
                min-height: 20px;
            }

            .loading-progress {
                width: 100%;
                max-width: 300px;
                margin: 0 auto;
            }

            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progress-fill {
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 2px;
                transition: width 0.3s ease;
                width: 0%;
            }

            .progress-percentage {
                font-size: 14px;
                opacity: 0.7;
            }

            .loading-overlay.fade-out {
                opacity: 0;
                transition: opacity 0.5s ease;
            }

            /* Skeleton Screen Styles */
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200px 100%;
                animation: shimmer 1.2s ease-in-out infinite;
                border-radius: 4px;
            }

            .skeleton-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .skeleton-header {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
            }

            .skeleton-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 16px;
            }

            .skeleton-title {
                height: 20px;
                width: 60%;
                margin-bottom: 8px;
            }

            .skeleton-subtitle {
                height: 14px;
                width: 40%;
            }

            .skeleton-text {
                height: 14px;
                margin-bottom: 8px;
                border-radius: 4px;
            }

            .skeleton-text:last-child {
                width: 80%;
                margin-bottom: 0;
            }

            .skeleton-button {
                height: 32px;
                width: 100px;
                border-radius: 6px;
                margin-top: 16px;
            }

            .skeleton-image {
                width: 100%;
                height: 200px;
                border-radius: 8px;
                margin-bottom: 16px;
            }

            /* Grid Skeleton */
            .skeleton-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }

            .skeleton-card-small {
                height: 120px;
                border-radius: 8px;
            }

            /* Content-specific skeletons */
            .concept-card-skeleton {
                min-height: 200px;
                border: 2px solid #f0f0f0;
                border-radius: 12px;
                padding: 20px;
                display: flex;
                flex-direction: column;
            }

            .concept-icon-skeleton {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-bottom: 16px;
            }

            .concept-title-skeleton {
                height: 18px;
                width: 80%;
                margin-bottom: 12px;
            }

            .concept-description-skeleton {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .concept-status-skeleton {
                height: 16px;
                width: 100px;
                margin-top: 16px;
                align-self: flex-start;
            }

            /* Loading states for interactive elements */
            .loading-state {
                position: relative;
                pointer-events: none;
            }

            .loading-state::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: inherit;
            }

            .loading-state::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                border: 2px solid #f0f0f0;
                border-top: 2px solid #2F5233;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 1;
            }

            /* Dark mode skeleton styles */
            .dark-mode .skeleton {
                background: linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%);
                background-size: 200px 100%;
            }

            .dark-mode .skeleton-card {
                background: #2d3748;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }

            .dark-mode .concept-card-skeleton {
                border-color: #4a5568;
                background: #2d3748;
            }

            /* Animations */
            @keyframes shimmer {
                0% {
                    background-position: -200px 0;
                }
                100% {
                    background-position: calc(200px + 100%) 0;
                }
            }

            @keyframes pulse {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }

            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% {
                    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
                    transform: translate3d(0,0,0);
                }
                40%, 43% {
                    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
                    transform: translate3d(0, -20px, 0);
                }
                70% {
                    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
                    transform: translate3d(0, -10px, 0);
                }
                90% {
                    transform: translate3d(0,-2px,0);
                }
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .skeleton-grid {
                    grid-template-columns: 1fr;
                }

                .loading-container {
                    padding: 20px;
                }

                .logo-icon {
                    font-size: 48px;
                }

                .logo-text {
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupIntersectionObserver() {
        // Set up intersection observer for lazy loading
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadElement(entry.target);
                        this.intersectionObserver.unobserve(entry.target);
                    }
                });
            },
            { 
                rootMargin: '50px',
                threshold: 0.1
            }
        );
    }

    implementProgressiveLoading() {
        // Replace content with skeletons initially
        this.showSkeletonForConceptCards();
        
        // Simulate loading delay
        setTimeout(() => {
            this.loadConceptCards();
        }, 1500);
    }

    showSkeletonForConceptCards() {
        const conceptsGrid = document.querySelector('.concepts-grid');
        if (!conceptsGrid) return;

        // Hide actual content
        const actualCards = conceptsGrid.querySelectorAll('.concept-card');
        actualCards.forEach(card => {
            card.style.display = 'none';
        });

        // Add skeleton cards
        const skeletonCount = actualCards.length || 6;
        for (let i = 0; i < skeletonCount; i++) {
            const skeleton = this.createConceptCardSkeleton();
            conceptsGrid.appendChild(skeleton);
        }
    }

    createConceptCardSkeleton() {
        const skeleton = document.createElement('div');
        skeleton.className = 'concept-card-skeleton animate-fadeInUp';
        skeleton.style.animationDelay = `${Math.random() * 0.3}s`;
        skeleton.innerHTML = `
            <div class="skeleton concept-icon-skeleton"></div>
            <div class="skeleton concept-title-skeleton"></div>
            <div class="concept-description-skeleton">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
            <div class="skeleton concept-status-skeleton"></div>
        `;
        return skeleton;
    }

    loadConceptCards() {
        const conceptsGrid = document.querySelector('.concepts-grid');
        if (!conceptsGrid) return;

        // Remove skeletons
        const skeletons = conceptsGrid.querySelectorAll('.concept-card-skeleton');
        skeletons.forEach(skeleton => {
            skeleton.classList.add('animate-fadeOut');
            setTimeout(() => skeleton.remove(), 300);
        });

        // Show actual cards with animation
        setTimeout(() => {
            const actualCards = conceptsGrid.querySelectorAll('.concept-card');
            actualCards.forEach((card, index) => {
                card.style.display = '';
                card.classList.add('animate-fadeInUp');
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }, 300);
    }

    setupImageLazyLoading() {
        // Enhanced image lazy loading
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        images.forEach(img => {
            if (!img.src || img.src === img.dataset.placeholder) {
                this.setupLazyImage(img);
            }
        });
    }

    setupLazyImage(img) {
        // Add placeholder
        const placeholder = img.dataset.placeholder || this.createImagePlaceholder(img);
        img.src = placeholder;
        img.classList.add('lazy-image');

        // Observer for lazy loading
        this.intersectionObserver.observe(img);
    }

    createImagePlaceholder(img) {
        const width = img.getAttribute('width') || 200;
        const height = img.getAttribute('height') || 150;
        
        // Create SVG placeholder
        const svg = `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#999" font-family="Arial, sans-serif" font-size="14">Loading...</text>
            </svg>
        `)}`;
        
        return svg;
    }

    loadElement(element) {
        if (element.tagName === 'IMG') {
            this.loadImage(element);
        } else {
            this.loadContent(element);
        }
    }

    loadImage(img) {
        const actualSrc = img.dataset.src || img.src;
        
        if (actualSrc && actualSrc !== img.src) {
            // Show loading state
            img.classList.add('loading-state');
            
            // Create new image to preload
            const newImg = new Image();
            newImg.onload = () => {
                img.src = actualSrc;
                img.classList.remove('loading-state', 'lazy-image');
                img.classList.add('animate-fadeIn');
            };
            newImg.onerror = () => {
                img.classList.remove('loading-state');
                img.classList.add('image-error');
            };
            
            newImg.src = actualSrc;
        }
    }

    loadContent(element) {
        // Generic content loading
        element.classList.add('animate-fadeInUp');
    }

    // Public methods for manual loading control
    showSkeleton(container, type = 'card') {
        const skeletonHtml = this.getSkeletonHTML(type);
        container.innerHTML = skeletonHtml;
    }

    hideSkeleton(container, content) {
        const skeletons = container.querySelectorAll('.skeleton-card, .concept-card-skeleton');
        skeletons.forEach(skeleton => {
            skeleton.classList.add('animate-fadeOut');
        });
        
        setTimeout(() => {
            container.innerHTML = content;
            container.querySelectorAll('*').forEach((el, index) => {
                el.classList.add('animate-fadeInUp');
                el.style.animationDelay = `${index * 0.05}s`;
            });
        }, 300);
    }

    getSkeletonHTML(type) {
        switch (type) {
            case 'card':
                return `
                    <div class="skeleton-card">
                        <div class="skeleton-header">
                            <div class="skeleton skeleton-avatar"></div>
                            <div style="flex: 1;">
                                <div class="skeleton skeleton-title"></div>
                                <div class="skeleton skeleton-subtitle"></div>
                            </div>
                        </div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-button"></div>
                    </div>
                `;
            case 'grid':
                return `
                    <div class="skeleton-grid">
                        ${Array.from({ length: 6 }, () => '<div class="skeleton skeleton-card-small"></div>').join('')}
                    </div>
                `;
            default:
                return '<div class="skeleton" style="height: 100px;"></div>';
        }
    }

    // Method to show loading state on any element
    showLoading(element, message = 'Loading...') {
        const loadingId = `loading_${Date.now()}`;
        this.loadingStates.set(loadingId, element);
        
        element.classList.add('loading-state');
        element.setAttribute('data-loading-id', loadingId);
        
        return loadingId;
    }

    hideLoading(loadingId) {
        const element = this.loadingStates.get(loadingId);
        if (element) {
            element.classList.remove('loading-state');
            element.removeAttribute('data-loading-id');
            this.loadingStates.delete(loadingId);
        }
    }
}

// Initialize progressive loader
window.addEventListener('DOMContentLoaded', () => {
    window.progressiveLoader = new ProgressiveLoader();
});