// Performance Optimization System
class PerformanceOptimizer {
    constructor() {
        this.imageCache = new Map();
        this.scriptCache = new Map();
        this.styleCache = new Map();
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.optimizeImages();
        this.implementLazyLoading();
        this.preloadCriticalResources();
        this.setupResourceHints();
        this.monitorPerformance();
    }

    measurePageLoad() {
        // Measure various performance metrics
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectPerformanceMetrics();
            }, 100);
        });

        // Measure First Contentful Paint
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'paint') {
                        this.performanceMetrics[entry.name] = entry.startTime;
                    }
                }
            }).observe({ entryTypes: ['paint'] });

            // Measure Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics['largest-contentful-paint'] = lastEntry.startTime;
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    collectPerformanceMetrics() {
        if (performance.timing) {
            const timing = performance.timing;
            this.performanceMetrics = {
                ...this.performanceMetrics,
                'dns-lookup': timing.domainLookupEnd - timing.domainLookupStart,
                'tcp-connection': timing.connectEnd - timing.connectStart,
                'server-response': timing.responseEnd - timing.requestStart,
                'dom-parsing': timing.domContentLoadedEventStart - timing.responseEnd,
                'resource-loading': timing.loadEventStart - timing.domContentLoadedEventStart,
                'total-load-time': timing.loadEventEnd - timing.navigationStart,
                'dom-ready': timing.domContentLoadedEventEnd - timing.navigationStart
            };
        }

        // Modern Performance API
        if (performance.getEntriesByType) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.performanceMetrics['modern-load-time'] = navigation.loadEventEnd;
                this.performanceMetrics['dom-interactive'] = navigation.domInteractive;
                this.performanceMetrics['dom-complete'] = navigation.domComplete;
            }
        }

        this.logPerformanceMetrics();
        this.optimizeBasedOnMetrics();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.loading = 'lazy';
            }

            // Implement responsive images with srcset
            this.makeImageResponsive(img);

            // Convert to WebP if supported
            this.convertToWebP(img);

            // Add image error handling
            this.addImageErrorHandling(img);
        });
    }

    makeImageResponsive(img) {
        if (img.dataset.responsive !== 'false' && !img.srcset) {
            const src = img.src;
            if (src && !src.startsWith('data:')) {
                // Create different sizes for responsive images
                const sizes = [320, 640, 1024, 1280];
                const srcset = sizes.map(size => {
                    const responsiveSrc = this.createResponsiveImageSrc(src, size);
                    return `${responsiveSrc} ${size}w`;
                }).join(', ');

                img.srcset = srcset;
                img.sizes = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1280px';
            }
        }
    }

    createResponsiveImageSrc(originalSrc, width) {
        // This would typically connect to an image optimization service
        // For now, return original src (in production, you'd use a service like Cloudinary)
        return originalSrc;
    }

    convertToWebP(img) {
        // Check if browser supports WebP
        if (this.supportsWebP()) {
            const src = img.src;
            if (src && !src.includes('.webp') && !src.startsWith('data:')) {
                // In a real implementation, you'd convert images to WebP
                // For now, we'll just add the logic structure
                this.loadWebPVersion(img, src);
            }
        }
    }

    supportsWebP() {
        if (this.webpSupport !== undefined) {
            return this.webpSupport;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
        return this.webpSupport;
    }

    loadWebPVersion(img, originalSrc) {
        // In production, this would check for .webp version of the image
        const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Test if WebP version exists
        const testImg = new Image();
        testImg.onload = () => {
            img.src = webpSrc;
        };
        testImg.onerror = () => {
            // WebP version doesn't exist, keep original
        };
        testImg.src = webpSrc;
    }

    addImageErrorHandling(img) {
        img.addEventListener('error', () => {
            // Add error placeholder
            if (!img.dataset.errorHandled) {
                img.dataset.errorHandled = 'true';
                img.alt = 'Image failed to load';
                img.style.background = '#f0f0f0';
                img.style.border = '1px solid #ddd';
                img.style.minHeight = '100px';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
            }
        });
    }

    implementLazyLoading() {
        // Enhanced lazy loading for all resources
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLazyElement(entry.target);
                        lazyObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '100px'
            });

            lazyElements.forEach(el => lazyObserver.observe(el));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyElements.forEach(el => this.loadLazyElement(el));
        }
    }

    loadLazyElement(element) {
        if (element.dataset.lazySrc) {
            element.src = element.dataset.lazySrc;
            element.removeAttribute('data-lazy-src');
        }
        
        if (element.dataset.lazyBackground) {
            element.style.backgroundImage = `url(${element.dataset.lazyBackground})`;
            element.removeAttribute('data-lazy-background');
        }

        if (element.dataset.lazyHtml) {
            element.innerHTML = element.dataset.lazyHtml;
            element.removeAttribute('data-lazy-html');
        }

        element.removeAttribute('data-lazy');
        element.classList.add('lazy-loaded');
    }

    preloadCriticalResources() {
        // Preload critical CSS and JS files
        const criticalResources = [
            { href: 'css/shared-styles.css', as: 'style' },
            { href: 'css/animations.css', as: 'style' },
            { href: 'js/course-manager.js', as: 'script' },
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }

    setupResourceHints() {
        // Add DNS prefetch for external resources
        const externalDomains = [
            'www.gstatic.com', // Firebase CDN
            'fonts.googleapis.com',
            'fonts.gstatic.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // Preconnect to critical external resources
        const preconnectDomains = [
            'https://www.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        // Monitor performance continuously
        setInterval(() => {
            this.checkMemoryUsage();
            this.monitorFPS();
        }, 30000); // Check every 30 seconds

        // Monitor page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNonEssentialTasks();
            } else {
                this.resumeNonEssentialTasks();
            }
        });
    }

    checkMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const memoryUsage = {
                used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
                total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
                limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
            };

            // If memory usage is high, trigger cleanup
            if (memoryUsage.used / memoryUsage.limit > 0.8) {
                this.performMemoryCleanup();
            }

            this.performanceMetrics.memory = memoryUsage;
        }
    }

    performMemoryCleanup() {
        // Clear caches if memory is high
        if (this.imageCache.size > 50) {
            const oldEntries = Array.from(this.imageCache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp)
                .slice(0, 25);
            
            oldEntries.forEach(([key]) => {
                this.imageCache.delete(key);
            });
        }


        // Force garbage collection if available (Chrome DevTools)
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
    }

    monitorFPS() {
        if (!this.fpsMonitor) {
            this.fpsMonitor = new FPSMonitor();
        }
        
        const fps = this.fpsMonitor.getFPS();
        if (fps < 30) {
            // Performance is poor, reduce visual effects
            this.reduceVisualEffects();
        }
        
        this.performanceMetrics.fps = fps;
    }

    reduceVisualEffects() {
        // Disable or reduce animations if performance is poor
        document.body.classList.add('reduced-motion');
        
        // Disable heavy animations
        const heavyAnimations = document.querySelectorAll('.animate-pulse, .animate-bounce');
        heavyAnimations.forEach(el => {
            el.style.animation = 'none';
        });
    }

    pauseNonEssentialTasks() {
        // Pause non-essential tasks when page is hidden
        this.paused = true;
        
        // Pause animations
        document.body.classList.add('paused');
        
        // Reduce update frequency
        clearInterval(this.performanceInterval);
    }

    resumeNonEssentialTasks() {
        // Resume tasks when page is visible
        this.paused = false;
        
        // Resume animations
        document.body.classList.remove('paused');
        
        // Resume monitoring
        this.performanceInterval = setInterval(() => {
            this.checkMemoryUsage();
            this.monitorFPS();
        }, 30000);
    }

    optimizeBasedOnMetrics() {
        const metrics = this.performanceMetrics;
        
        // If load time is slow, implement additional optimizations
        if (metrics['total-load-time'] > 3000) {
            this.implementSlowConnectionOptimizations();
        }

        // If DOM parsing is slow, defer non-critical scripts
        if (metrics['dom-parsing'] > 1000) {
            this.deferNonCriticalScripts();
        }
    }

    implementSlowConnectionOptimizations() {
        // Reduce image quality for slow connections
        document.body.classList.add('slow-connection');
        
        // Disable auto-play videos
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            video.removeAttribute('autoplay');
        });

        // Reduce animation durations
        const style = document.createElement('style');
        style.textContent = `
            .slow-connection * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }

    deferNonCriticalScripts() {
        // Mark non-critical scripts for deferred loading
        const nonCriticalScripts = document.querySelectorAll('script[src]:not([data-critical])');
        nonCriticalScripts.forEach(script => {
            if (!script.defer && !script.async) {
                script.defer = true;
            }
        });
    }

    logPerformanceMetrics() {
        console.group('🚀 Performance Metrics');
        console.table(this.performanceMetrics);
        console.groupEnd();

        // Store metrics for analytics
        if (window.progressSystem) {
            window.progressSystem.logAnalyticsEvent('performance_metrics', this.performanceMetrics);
        }
    }

    // Public API methods
    getPerformanceScore() {
        const metrics = this.performanceMetrics;
        let score = 100;
        
        // Penalize slow loading
        if (metrics['total-load-time'] > 2000) score -= 20;
        if (metrics['total-load-time'] > 4000) score -= 30;
        
        // Penalize slow FCP
        if (metrics['first-contentful-paint'] > 1500) score -= 15;
        if (metrics['first-contentful-paint'] > 3000) score -= 25;
        
        // Penalize high memory usage
        if (metrics.memory && metrics.memory.used / metrics.memory.limit > 0.7) score -= 10;
        
        // Penalize low FPS
        if (metrics.fps && metrics.fps < 30) score -= 15;
        if (metrics.fps && metrics.fps < 15) score -= 25;
        
        return Math.max(0, Math.min(100, score));
    }

    getOptimizationSuggestions() {
        const suggestions = [];
        const metrics = this.performanceMetrics;
        
        if (metrics['total-load-time'] > 3000) {
            suggestions.push('Consider optimizing images and enabling compression');
        }
        
        if (!this.supportsWebP()) {
            suggestions.push('Browser does not support WebP images');
        }
        
        if (metrics.memory && metrics.memory.used > 50) {
            suggestions.push('High memory usage detected - consider clearing caches');
        }
        
        if (metrics.fps && metrics.fps < 60) {
            suggestions.push('Low frame rate detected - consider reducing animations');
        }
        
        return suggestions;
    }

    generatePerformanceReport() {
        return {
            score: this.getPerformanceScore(),
            metrics: this.performanceMetrics,
            suggestions: this.getOptimizationSuggestions(),
            timestamp: Date.now()
        };
    }
}

// FPS Monitor utility class
class FPSMonitor {
    constructor() {
        this.frames = 0;
        this.startTime = performance.now();
        this.fps = 0;
        this.start();
    }

    start() {
        const measure = () => {
            this.frames++;
            const currentTime = performance.now();
            const elapsed = currentTime - this.startTime;
            
            if (elapsed >= 1000) {
                this.fps = Math.round((this.frames * 1000) / elapsed);
                this.frames = 0;
                this.startTime = currentTime;
            }
            
            requestAnimationFrame(measure);
        };
        requestAnimationFrame(measure);
    }

    getFPS() {
        return this.fps;
    }
}

// Initialize performance optimizer
window.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});