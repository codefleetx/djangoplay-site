/**
 * Dynamically applies configuration from the injected JSON file.
 */
window.SiteConfig = null;

async function fetchSiteConfig() {
    try {
        const response = await fetch('/assets/json/site_config.json');
        if (!response.ok) return;
        window.SiteConfig = await response.json();
        
        // Apply to everything currently in the DOM
        window.resolveSiteConfig();
    } catch (e) {
        console.warn("Site config fetch failed, using defaults.");
    }
}

// Make this globally accessible so portfolio.js can call it after rendering
window.resolveSiteConfig = function() {
    const config = window.SiteConfig;
    if (!config) return;

    // 1. Docs Link
    if (config.DOCS_URL) {
        document.querySelectorAll('.docs-link').forEach(link => {
            link.href = config.DOCS_URL;
        });
    }

    // 2. Issues Link
    if (config.ISSUES_URL) {
        document.querySelectorAll('.issues-link').forEach(link => {
            link.href = config.ISSUES_URL;
        });
    }

    // 3. Platform Links (Open Platform)
    if (config.PLATFORM_URL) {
        document.querySelectorAll('.platform-link').forEach(link => {
            const path = link.getAttribute('data-path');
            const baseUrl = config.PLATFORM_URL.endsWith('/') 
                ? config.PLATFORM_URL 
                : config.PLATFORM_URL + '/';
            link.href = `${baseUrl}${path}`;
        });
    }

    
    // 4 Website Link
    if (config.WEBSITE_URL) {
        document.querySelectorAll('.website-link').forEach(link => {
            link.href = config.WEBSITE_URL;
        });
    }

    // 5. Site Name
    if (config.SITE_NAME) {
        document.querySelectorAll('.site-name-text').forEach(el => {
            el.textContent = config.SITE_NAME;
        });
    }
};

// Start the fetch immediately
fetchSiteConfig();