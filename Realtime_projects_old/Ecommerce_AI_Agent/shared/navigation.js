/**
 * Navigation and Content Loading System
 * Handles sequential loading of subphase content
 * Updated for Ecommerce_AI_Agent project
 */

class PhaseNavigation {
  constructor() {
    this.currentPhase = null;
    this.currentTab = 'overview';
    this.subphases = [];
    this.contentCache = {};

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    // Get current phase from page data JSON
    const pageData = document.getElementById('page-data');
    if (pageData) {
      try {
        const data = JSON.parse(pageData.textContent);
        this.currentPhase = data.phase;
      } catch (e) {
        // Fallback: try to get phase from data attribute or URL
        const phaseMatch = window.location.pathname.match(/\/([^\/]+)_?phase/);
        if (phaseMatch) {
          let phaseName = phaseMatch[1].replace('_', '-').replace('Testing', 'testing').replace('Deployment', 'deployment');
          // Map folder names to phase IDs
          const phaseMap = {
            'BRD': 'brd',
            'UI_UX': 'uiux',
            'UI-UX': 'uiux',
            'Architectural_Design': 'architectural',
            'Development': 'development',
            'Testing': 'testing',
            'Deployment': 'deployment'
          };
          this.currentPhase = phaseMap[phaseName] || phaseName.toLowerCase();
        }
      }

      // Normalize phase name
      if (this.currentPhase === 'code-development') {
        this.currentPhase = 'development';
      }

      this.loadSubphases();
      this.setupEventListeners();
      this.updatePhaseNavigationBar();
      this.loadInitialContent();
      this.rewriteFooterAssets();
    }
  }

  loadSubphases() {
    // Define subphases for each phase - Updated for AI Agent project
    const phaseSubphases = {
      'brd': [
        { id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '📋' },
        { id: 'functional-requirements', file: 'Functional_Requirements.html', label: 'Functional Requirements', icon: '⚙️' },
        { id: 'non-functional-requirements', file: 'Non_Functional_Requirements.html', label: 'Non-Functional Requirements', icon: '🎯' },
        { id: 'user-stories', file: 'User_Stories.html', label: 'User Stories', icon: '👥' },
        { id: 'conclusion', file: 'Conclusion.html', label: 'Conclusion', icon: '✅' }
      ],
      'uiux': [
        { id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '🎨' },
        { id: 'design-system', file: 'Design_System.html', label: 'Design System', icon: '🎨' },
        { id: 'chat-interface-design', file: 'Chat_Interface_Design.html', label: 'Chat Interface Design', icon: '💬' },
        { id: 'user-experience-flow', file: 'User_Experience_Flow.html', label: 'User Experience Flow', icon: '🔄' },
        { id: 'navigation-flow', file: 'Navigation_Flow.html', label: 'Navigation Flow', icon: '🗺️' },
        { id: 'conclusion', file: 'Conclusion.html', label: 'Conclusion', icon: '✅' }
      ],
      'architectural': [
        { id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '🏗️' },
        { id: 'system-architecture', file: 'System_Architecture.html', label: 'System Architecture', icon: '⚙️' },
        { id: 'database-design', file: 'Database_Design.html', label: 'Database Design', icon: '🗄️' },
        { id: 'api-design', file: 'API_Design.html', label: 'API Design', icon: '🔌' },
        { id: 'ai-integration-architecture', file: 'AI_Integration_Architecture.html', label: 'AI Integration Architecture', icon: '🤖' },
        { id: 'security-architecture', file: 'Security_Architecture.html', label: 'Security Architecture', icon: '🔒' },
        { id: 'conclusion', file: 'Conclusion.html', label: 'Conclusion', icon: '✅' }
      ],
      'development': [
        { id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '💻' },
        { id: 'backend-development', file: 'Backend_Development.html', label: 'Backend Development', icon: '⚙️' },
        { id: 'tool-modules-development', file: 'Tool_Modules_Development.html', label: 'Tool Modules Development', icon: '🔧' },
        { id: 'frontend-development', file: 'Frontend_Development.html', label: 'Frontend Development', icon: '🎨' },
        { id: 'database-implementation', file: 'Database_Implementation.html', label: 'Database Implementation', icon: '🗄️' },
        { id: 'ai-integration-development', file: 'AI_Integration_Development.html', label: 'AI Integration Development', icon: '🤖' },
        { id: 'testing', file: 'Testing_QA.html', label: 'Testing & QA', icon: '🧪' },
        { id: 'conclusion', file: 'Conclusion.html', label: 'Conclusion', icon: '✅' }
      ],
      'testing': [
        { id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '🧪' },
        { id: 'test-planning', file: 'Test_Planning.html', label: 'Test Planning', icon: '📋' },
        { id: 'unit-testing', file: 'Unit_Testing.html', label: 'Unit Testing', icon: '🔬' },
        { id: 'integration-testing', file: 'Integration_Testing.html', label: 'Integration Testing', icon: '🔗' },
        { id: 'chat-interface-testing', file: 'Chat_Interface_Testing.html', label: 'Chat Interface Testing', icon: '💬' },
        { id: 'performance-testing', file: 'Performance_Testing.html', label: 'Performance Testing', icon: '⚡' },
        { id: 'conclusion', file: 'Conclusion.html', label: 'Conclusion', icon: '✅' }
      ],
      'deployment': [
        { id: 'overview', file: 'Overview_Content.html', label: 'Overview', icon: '🚀' },
        { id: 'deployment-planning', file: 'Deployment_Planning.html', label: 'Deployment Planning', icon: '📋' },
        { id: 'environment-setup', file: 'Environment_Setup.html', label: 'Environment Setup', icon: '🏗️' },
        { id: 'database-migration-deployment', file: 'Database_Migration_Deployment.html', label: 'Database Migration Deployment', icon: '🗄️' },
        { id: 'final-steps', file: 'Final_Steps.html', label: 'Final Steps', icon: '🎉' }
      ]
    };

    this.subphases = phaseSubphases[this.currentPhase] || [];
    this.renderSidebar();
  }

  renderSidebar() {
    const sidebarNav = document.getElementById('sidebar-nav');
    if (!sidebarNav) return;

    sidebarNav.innerHTML = '';

    this.subphases.forEach((subphase, index) => {
      const navItem = document.createElement('li');
      navItem.className = 'sidebar-nav-item';

      const isActive = this.currentTab === subphase.id;

      navItem.innerHTML = `
        <button 
          class="sidebar-nav-btn ${isActive ? 'active' : ''}"
          data-tab="${subphase.id}"
        >
          <span class="sidebar-nav-icon">${subphase.icon}</span>
          <div class="sidebar-nav-content">
            <div class="sidebar-nav-label">${subphase.label}</div>
            <div class="sidebar-nav-desc">${this.getSubphaseDescription(subphase.id)}</div>
          </div>
        </button>
      `;

      sidebarNav.appendChild(navItem);
    });

    // Ensure all buttons are enabled and not disabled
    const allSidebarButtons = sidebarNav.querySelectorAll('.sidebar-nav-btn');
    allSidebarButtons.forEach(btn => {
      btn.classList.remove('disabled');
      btn.removeAttribute('disabled');
    });
  }

  getSubphaseDescription(id) {
    const descriptions = {
      'overview': 'Phase overview and objectives',
      'functional-requirements': 'Core functionality specifications',
      'non-functional-requirements': 'Performance and quality requirements',
      'user-stories': 'User scenarios and use cases',
      'conclusion': 'Summary and next steps',
      'design-system': 'Color palette, typography, and components',
      'chat-interface-design': 'Chat UI components and styling',
      'user-experience-flow': 'Conversation flows and interactions',
      'navigation-flow': 'User journey maps and navigation patterns',
      'system-architecture': 'Overall system structure and components',
      'database-design': 'Data models and relationships',
      'api-design': 'RESTful APIs and endpoints',
      'ai-integration-architecture': 'OpenAI integration and tool calling',
      'security-architecture': 'Security measures and protocols',
      'backend-development': 'API route implementation',
      'tool-modules-development': 'Catalog, cart, inventory, recommendations modules',
      'frontend-development': 'React chat component and UI',
      'database-implementation': 'Prisma schema and migrations',
      'ai-integration-development': 'OpenAI SDK setup and configuration',
      'testing': 'Unit testing and quality assurance',
      'test-planning': 'Test strategy and test case development',
      'unit-testing': 'Individual component and function testing',
      'integration-testing': 'System integration and API testing',
      'chat-interface-testing': 'UI/UX and user interaction testing',
      'performance-testing': 'Response time and token usage optimization',
      'deployment-planning': 'Deployment possibilities and setup strategies',
      'environment-setup': 'OpenAI API key and environment configuration',
      'database-migration-deployment': 'Production database setup',
      'final-steps': 'Project completion and go-live checklist'
    };
    return descriptions[id] || '';
  }

  setupEventListeners() {
    // Sidebar navigation clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-nav-btn')) {
        const btn = e.target.closest('.sidebar-nav-btn');
        const tabId = btn.dataset.tab;
        if (tabId) {
          this.switchTab(tabId);
        }
      }
    });

    // Next button click
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.goToNext();
      });
    }

    // Phase navigation clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.phase-nav-btn')) {
        const phaseId = e.target.closest('.phase-nav-btn').dataset.phase;
        if (phaseId) {
          this.navigateToPhase(phaseId);
        }
      }
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    this.renderSidebar();
    this.loadContent(tabId);
    this.updateProgress();

    // Hide next button on conclusion/final-steps
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      if (tabId === 'conclusion' || tabId === 'final-steps') {
        nextBtn.style.display = 'none';
      } else {
        // Check if there's a next module
        const currentIndex = this.subphases.findIndex(s => s.id === tabId);
        const hasNext = currentIndex < this.subphases.length - 1;
        nextBtn.style.display = hasNext ? 'flex' : 'none';
      }
    }
  }

  goToNext() {
    const currentIndex = this.subphases.findIndex(s => s.id === this.currentTab);
    if (currentIndex < this.subphases.length - 1) {
      const nextSubphase = this.subphases[currentIndex + 1];
      this.switchTab(nextSubphase.id);

      // Scroll to top
      const contentArea = document.querySelector('.content-area');
      if (contentArea) {
        contentArea.scrollTop = 0;
      }
    }
  }

  async loadContent(tabId) {
    const contentArea = document.getElementById('current-content');
    if (!contentArea) return;

    // Show loading state
    contentArea.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <div style="width: 48px; height: 48px; border: 4px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p style="color: #6b7280;">Loading content...</p>
      </div>
    `;

    // Check cache first
    if (this.contentCache[tabId]) {
      contentArea.innerHTML = this.contentCache[tabId];
      contentArea.classList.add('content-fade-in');
      return;
    }

    // Find the content file for this tab
    const subphase = this.subphases.find(s => s.id === tabId);
    if (!subphase) {
      contentArea.innerHTML = '<div class="content-section"><p>Content not found</p></div>';
      return;
    }

    // Load content from file
    let contentUrl;
    try {
      const currentUrl = new URL(window.location.href);
      const currentPath = currentUrl.pathname;

      let projectId = window.__LMS_PROJECT_ID;
      let apiBase = window.__LMS_API_BASE;

      if (!apiBase) {
        let backendOrigin = null;
        if (currentPath.includes('/api/realtime-projects/')) {
          backendOrigin = currentUrl.origin;
        } else {
          const currentHost = currentUrl.hostname;
          if (currentHost === 'gnanamai.com' || currentHost === 'www.gnanamai.com') {
            backendOrigin = currentUrl.protocol + '//api.gnanamai.com';
          } else if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
            backendOrigin = currentUrl.protocol + '//localhost:5000';
          } else {
            backendOrigin = currentUrl.origin;
          }
        }

        if (projectId && backendOrigin) {
          apiBase = backendOrigin + '/api/realtime-projects/' + projectId;
          window.__LMS_API_BASE = apiBase;
        } else if (currentPath.includes('/api/realtime-projects/')) {
          const pathMatch = currentPath.match(/^\/api\/realtime-projects\/([^\/]+)/);
          if (pathMatch && pathMatch[1]) {
            projectId = pathMatch[1];
            const phaseFolders = ['BRD_phase', 'UI_UX_phase', 'Architectural_Design_phase', 'Development Phase', 'Testing_phase', 'Deployment Phase'];
            const isPhaseFolder = phaseFolders.some(pf => {
              const normalizedPf = pf.replace(/\s+/g, '_').toLowerCase();
              const normalizedExtracted = projectId.replace(/\s+/g, '_').toLowerCase();
              return normalizedPf === normalizedExtracted || projectId.includes('_phase') || projectId.includes('Phase');
            });

            if (!isPhaseFolder && backendOrigin) {
              apiBase = backendOrigin + '/api/realtime-projects/' + projectId;
              window.__LMS_API_BASE = apiBase;
              window.__LMS_PROJECT_ID = projectId;
            }
          }
        }
      }

      // Removed premature error throw to allow fallback to standalone mode

      if (apiBase) {
        const phaseFolders = {
          'brd': 'BRD_phase',
          'uiux': 'UI_UX_phase',
          'architectural': 'Architectural_Design_phase',
          'development': 'Development Phase',
          'testing': 'Testing_phase',
          'deployment': 'Deployment Phase'
        };

        let phaseFolder = null;
        if (this.currentPhase && phaseFolders[this.currentPhase]) {
          phaseFolder = phaseFolders[this.currentPhase];
        } else {
          const pathParts = currentPath.split('/').filter(p => p);
          const projectIndex = pathParts.findIndex(p => p === 'realtime-projects');
          if (projectIndex >= 0 && projectIndex + 3 < pathParts.length) {
            const urlPhaseFolder = pathParts[projectIndex + 3];
            const foundPhase = Object.keys(phaseFolders).find(
              key => {
                const pf = phaseFolders[key];
                return pf === urlPhaseFolder ||
                  pf.replace(/\s+/g, '_') === urlPhaseFolder ||
                  pf.replace(/\s+/g, '') === urlPhaseFolder ||
                  decodeURIComponent(urlPhaseFolder) === pf;
              }
            );
            if (foundPhase) {
              phaseFolder = phaseFolders[foundPhase];
            }
          }
        }

        let contentPath;
        if (phaseFolder) {
          const encodedFolder = encodeURIComponent(phaseFolder);
          contentPath = encodedFolder + '/' + subphase.file;
        } else {
          contentPath = subphase.file;
        }

        const cleanApiBase = apiBase.replace(/\/$/, '');
        const cleanContentPath = contentPath.replace(/^\//, '');
        contentUrl = cleanApiBase + '/' + cleanContentPath;

        let token = window.__LMS_TOKEN;
        if (!token) {
          try {
            const urlParams = new URLSearchParams(window.location.search);
            token = urlParams.get('token') || '';
            if (!token) {
              const urlMatch = window.location.href.match(/[?&]token=([^&]+)/);
              if (urlMatch && urlMatch[1]) {
                token = decodeURIComponent(urlMatch[1]);
              }
            }
            if (token) {
              window.__LMS_TOKEN = token;
            }
          } catch (e) {
            console.warn('[Navigation] Could not read token from URL:', e);
          }
        }

        if (token && !contentUrl.includes('token=')) {
          const separator = contentUrl.includes('?') ? '&' : '?';
          contentUrl = contentUrl + separator + 'token=' + encodeURIComponent(token);
        }
      } else {
        // Standalone mode: resolve relative to current page (works for file:// and http://)
        const currentHref = window.location.href;
        const currentDir = currentHref.substring(0, currentHref.lastIndexOf('/') + 1);
        contentUrl = currentDir + subphase.file;
      }

      if (!contentUrl || contentUrl === 'undefined' || contentUrl.includes('undefined')) {
        throw new Error('Invalid content URL constructed');
      }

      const response = await fetch(contentUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Failed to load content: ${response.status} ${response.statusText}. ${errorText.substring(0, 100)}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        console.warn('[Navigation] HTML parsing warning:', parserError.textContent);
      }

      const content = doc.querySelector('.content-body') || doc.querySelector('body') || doc.body;

      if (!content) {
        throw new Error('No content found in loaded HTML');
      }

      this.rewriteAssetUrls(content);

      this.contentCache[tabId] = content.innerHTML;
      contentArea.innerHTML = this.contentCache[tabId];
      contentArea.classList.add('content-fade-in');

    } catch (error) {
      console.error('Error loading content:', error);
      contentArea.innerHTML = `
        <div class="content-section">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 1rem;">
            <p style="color: #991b1b;">Unable to load content. Error: ${error.message}</p>
            <p style="color: #991b1b; margin-top: 0.5rem; font-size: 0.875rem;">File: ${subphase.file}</p>
            <p style="color: #991b1b; margin-top: 0.5rem; font-size: 0.875rem;">URL: ${contentUrl || 'Not constructed'}</p>
          </div>
        </div>
      `;
    }
  }

  rewriteAssetUrls(container) {
    if (!container) return;
    const apiBaseRaw = window.__LMS_API_BASE || '';
    if (!apiBaseRaw) return;
    const apiBase = apiBaseRaw.replace(/\/$/, '') + '/';

    const resolveUrl = (url) => {
      try {
        if (url.startsWith('../')) {
          const relativePath = url.replace('../', '');
          return apiBase + relativePath;
        } else if (url.startsWith('./')) {
          const currentPath = window.location.pathname;
          let phaseFolder = '';
          const pathMatch = currentPath.match(/\/api\/realtime-projects\/[^\/]+\/([^\/]+)\//);
          if (pathMatch && pathMatch[1]) {
            phaseFolder = pathMatch[1] + '/';
            const relativePath = url.replace('./', '');
            return apiBase + phaseFolder + relativePath;
          }
          return apiBase + url.replace('./', '');
        } else if (!url.startsWith('/') && !url.startsWith('http')) {
          return apiBase + url;
        }
        return new URL(url, apiBase).href;
      } catch (e) {
        return url;
      }
    };

    const getToken = () => {
      let token = window.__LMS_TOKEN;
      if (token) return token;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token') || '';
        if (!token) {
          const urlMatch = window.location.href.match(/[?&]token=([^&]+)/);
          if (urlMatch && urlMatch[1]) {
            token = decodeURIComponent(urlMatch[1]);
          }
        }
        if (token) {
          window.__LMS_TOKEN = token;
        }
      } catch (e) { }
      return token || '';
    };

    const addToken = (url) => {
      const token = getToken();
      if (!token) return url;
      try {
        const urlObj = new URL(url);
        if (!urlObj.searchParams.has('token')) {
          urlObj.searchParams.set('token', token);
        }
        return urlObj.href;
      } catch (e) {
        if (url.includes('token=')) return url;
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + 'token=' + encodeURIComponent(token);
      }
    };

    const shouldRewrite = (value) => {
      if (!value) return false;
      const trimmed = value.trim();
      if (!trimmed) return false;
      const lower = trimmed.toLowerCase();
      if (lower.startsWith('http://') || lower.startsWith('https://') ||
        lower.startsWith('data:') || lower.startsWith('mailto:') ||
        lower.startsWith('tel:') || lower.startsWith('#')) {
        return false;
      }
      return true;
    };

    const rewriteAttribute = (selector, attribute) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el) => {
        const value = el.getAttribute(attribute);
        if (!shouldRewrite(value)) return;
        const resolved = resolveUrl(value);
        const withToken = addToken(resolved);
        el.setAttribute(attribute, withToken);
      });
    };

    rewriteAttribute('img[src]', 'src');
    rewriteAttribute('source[src]', 'src');
    rewriteAttribute('video[src]', 'src');
    rewriteAttribute('audio[src]', 'src');
    rewriteAttribute('script[src]', 'src');
    rewriteAttribute('link[rel="stylesheet"][href]', 'href');
    rewriteAttribute('a[href]', 'href');
    rewriteAttribute('[data-image]', 'data-image');
  }

  rewriteFooterAssets() {
    const apiBaseRaw = window.__LMS_API_BASE || '';
    if (!apiBaseRaw) return;
    const apiBase = apiBaseRaw.replace(/\/$/, '') + '/';
    const footer = document.querySelector('footer');
    if (!footer) return;

    const resolveUrl = (url) => {
      try {
        return new URL(url, apiBase).href;
      } catch (e) {
        return url;
      }
    };

    const getToken = () => {
      let token = window.__LMS_TOKEN;
      if (token) return token;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token') || '';
        if (!token) {
          const urlMatch = window.location.href.match(/[?&]token=([^&]+)/);
          if (urlMatch && urlMatch[1]) {
            token = decodeURIComponent(urlMatch[1]);
          }
        }
        if (token) {
          window.__LMS_TOKEN = token;
        }
      } catch (e) { }
      return token || '';
    };

    const addToken = (url) => {
      const token = getToken();
      if (!token) return url;
      try {
        const urlObj = new URL(url);
        if (!urlObj.searchParams.has('token')) {
          urlObj.searchParams.set('token', token);
        }
        return urlObj.href;
      } catch (e) {
        if (url.includes('token=')) return url;
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + 'token=' + encodeURIComponent(token);
      }
    };

    const shouldRewrite = (value) => {
      if (!value) return false;
      const trimmed = value.trim();
      if (!trimmed) return false;
      const lower = trimmed.toLowerCase();
      if (lower.startsWith('http://') || lower.startsWith('https://') ||
        lower.startsWith('data:') || lower.startsWith('mailto:') ||
        lower.startsWith('tel:') || lower.startsWith('#')) {
        return false;
      }
      return true;
    };

    const footerLogos = footer.querySelectorAll('img[src*="lms_logo"]');
    footerLogos.forEach((img) => {
      const src = img.getAttribute('src');
      if (!shouldRewrite(src)) return;

      let resolvedSrc = src;
      if (src.startsWith('../')) {
        const relativePath = src.replace('../', '');
        resolvedSrc = apiBase + relativePath;
      } else if (!src.startsWith('/') && !src.startsWith('http')) {
        resolvedSrc = apiBase + src;
      } else {
        resolvedSrc = resolveUrl(src);
      }

      const withToken = addToken(resolvedSrc);
      img.setAttribute('src', withToken);
    });
  }

  loadInitialContent() {
    if (this.subphases.length > 0) {
      setTimeout(() => {
        this.switchTab(this.subphases[0].id);
      }, 100);
    }
  }

  updateProgress() {
    const progressList = document.getElementById('progress-list');
    if (!progressList) return;

    progressList.innerHTML = '';

    this.subphases.forEach((subphase) => {
      const progressItem = document.createElement('div');
      progressItem.className = 'progress-item';

      const isActive = this.currentTab === subphase.id;

      progressItem.innerHTML = `
        <div class="progress-dot ${isActive ? 'active' : ''}"></div>
        <span class="progress-label ${isActive ? 'active' : ''}">${subphase.label}</span>
      `;

      progressList.appendChild(progressItem);
    });
  }

  navigateToPhase(phaseId) {
    const phaseFolders = {
      'brd': 'BRD_phase',
      'uiux': 'UI_UX_phase',
      'architectural': 'Architectural_Design_phase',
      'code-development': 'Development Phase',
      'development': 'Development Phase',
      'testing': 'Testing_phase',
      'deployment': 'Deployment Phase'
    };

    const folder = phaseFolders[phaseId];
    if (!folder) {
      console.error('[Navigation] Unknown phase ID:', phaseId);
      return;
    }

    // SPECIAL HANDLING FOR LOCAL FILES (file:// protocol)
    if (window.location.protocol === 'file:') {
      const currentHref = window.location.href;
      const pathParts = currentHref.split('/');
      pathParts.pop(); // Remove current file (e.g., Overview.html)
      pathParts.pop(); // Remove current phase folder (e.g., BRD_phase)
      const projectRoot = pathParts.join('/') + '/';
      const targetUrl = projectRoot + folder + '/Overview.html';
      window.location.replace(targetUrl);
      return;
    }

    let targetUrl;
    const currentPath = window.location.pathname;
    const currentHref = window.location.href;

    let projectId = window.__LMS_PROJECT_ID;

    if (!projectId) {
      const pathParts = currentPath.split('/').filter(p => p);
      const projectIndex = pathParts.findIndex(p => p === 'realtime-projects');

      if (projectIndex >= 0 && projectIndex + 1 < pathParts.length) {
        const extractedId = pathParts[projectIndex + 1];
        const phaseFolderNames = Object.values(phaseFolders);
        const isPhaseFolder = phaseFolderNames.some(pf => {
          const normalizedPf = pf.replace(/\s+/g, '_').toLowerCase();
          const normalizedExtracted = extractedId.replace(/\s+/g, '_').toLowerCase();
          return normalizedPf === normalizedExtracted ||
            extractedId.includes('_phase') ||
            extractedId.includes('Phase');
        });

        if (!isPhaseFolder) {
          projectId = extractedId;
        }
      }
    }

    if (!projectId && currentHref.includes('/api/realtime-projects/')) {
      const urlMatch = currentHref.match(/\/api\/realtime-projects\/([^\/\?]+)/);
      if (urlMatch && urlMatch[1]) {
        const extractedId = urlMatch[1];
        const phaseFolderNames = Object.values(phaseFolders);
        const isPhaseFolder = phaseFolderNames.some(pf => {
          const normalizedPf = pf.replace(/\s+/g, '_').toLowerCase();
          const normalizedExtracted = extractedId.replace(/\s+/g, '_').toLowerCase();
          return normalizedPf === normalizedExtracted ||
            extractedId.includes('_phase') ||
            extractedId.includes('Phase');
        });
        if (!isPhaseFolder) {
          projectId = extractedId;
        }
      }
    }

    if (!projectId) {
      console.error('[Navigation] ERROR: Could not determine project ID!');
      return;
    }

    let backendOrigin = null;
    const currentUrl = new URL(window.location.href);
    const currentPathForNav = currentUrl.pathname;

    if (currentPathForNav.includes('/api/realtime-projects/')) {
      backendOrigin = currentUrl.origin;
    } else {
      const currentHost = currentUrl.hostname;
      if (currentHost === 'gnanamai.com' || currentHost === 'www.gnanamai.com') {
        backendOrigin = currentUrl.protocol + '//api.gnanamai.com';
      } else if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        backendOrigin = currentUrl.protocol + '//localhost:5000';
      } else {
        backendOrigin = currentUrl.origin;
      }
    }

    const apiBase = backendOrigin + '/api/realtime-projects/' + projectId;
    window.__LMS_API_BASE = apiBase;
    window.__LMS_PROJECT_ID = projectId;

    const cleanApiBase = apiBase.replace(/\/$/, '');
    const cleanFolder = folder.replace(/^\//, '');
    targetUrl = cleanApiBase + '/' + encodeURIComponent(cleanFolder) + '/Overview.html';

    if (!targetUrl.includes('/api/realtime-projects/' + projectId + '/')) {
      console.error('[Navigation] ERROR: Constructed URL does not contain project ID!');
      return;
    }

    let token = window.__LMS_TOKEN;
    if (!token) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token') || '';
        if (!token) {
          const urlMatch = window.location.href.match(/[?&]token=([^&]+)/);
          if (urlMatch && urlMatch[1]) {
            token = decodeURIComponent(urlMatch[1]);
          }
        }
        if (token) {
          window.__LMS_TOKEN = token;
        }
      } catch (e) {
        console.warn('[Navigation] Could not read token from URL:', e);
      }
    }

    if (token && !targetUrl.includes('token=')) {
      const separator = targetUrl.includes('?') ? '&' : '?';
      targetUrl = targetUrl + separator + 'token=' + encodeURIComponent(token);
    }

    window.location.replace(targetUrl);
  }

  updatePhaseNavigationBar() {
    const phases = ['brd', 'uiux', 'architectural', 'code-development', 'testing', 'deployment'];

    phases.forEach(phaseId => {
      const phaseBtn = document.querySelector(`[data-phase="${phaseId}"]`);
      if (phaseBtn) {
        phaseBtn.classList.remove('locked');
        phaseBtn.removeAttribute('disabled');
        const circle = phaseBtn.querySelector('.phase-nav-circle');
        if (circle) {
          circle.classList.remove('phase-locked');
          circle.style.opacity = '1';
        }
      }
    });

    const allPhaseButtons = document.querySelectorAll('.phase-nav-btn');
    allPhaseButtons.forEach(btn => {
      btn.classList.remove('locked');
      btn.removeAttribute('disabled');
      const circle = btn.querySelector('.phase-nav-circle');
      if (circle) {
        circle.classList.remove('phase-locked');
        circle.style.opacity = '1';
      }
    });
  }
}

// Initialize navigation system
const phaseNav = new PhaseNavigation();
window.phaseNav = phaseNav; // Expose globally for use in Conclusion.html buttons

// Clean up any lock-related localStorage data
(function () {
  if (localStorage.getItem('ecommerceProjectProgress')) {
    localStorage.removeItem('ecommerceProjectProgress');
  }

  setTimeout(() => {
    const phaseButtons = document.querySelectorAll('.phase-nav-btn');
    phaseButtons.forEach(btn => {
      btn.classList.remove('locked');
      const circle = btn.querySelector('.phase-nav-circle');
      if (circle) {
        circle.classList.remove('phase-locked');
        circle.style.opacity = '1';
      }
    });

    const sidebarButtons = document.querySelectorAll('.sidebar-nav-btn');
    sidebarButtons.forEach(btn => {
      btn.classList.remove('disabled');
      btn.removeAttribute('disabled');

      const icon = btn.querySelector('.sidebar-nav-icon');
      if (icon && icon.textContent.includes('🔒')) {
        const tabId = btn.dataset.tab;
        if (tabId && phaseNav.subphases) {
          const subphase = phaseNav.subphases.find(s => s.id === tabId);
          if (subphase) {
            icon.textContent = subphase.icon;
          }
        }
      }
    });
  }, 100);
})();

