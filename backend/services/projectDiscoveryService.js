const fs = require('fs');
const path = require('path');

/**
 * Project Discovery Service
 * Scans local projects folder and discovers all HTML projects
 */

class ProjectDiscoveryService {
  constructor() {
    this.projectsPath = process.env.REALTIME_PROJECTS_PATH || path.join(__dirname, '../../Realtime_projects');
    console.log(`ProjectDiscoveryService initialized using local path: ${this.projectsPath}`);
    this.cachedProjects = null;
    this.lastCacheTime = 0;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Discover all projects in the local projects directory
   */
  async discoverProjects(forceRefresh = false) {
    try {
      // Return cached projects if valid
      if (!forceRefresh && this.cachedProjects && (Date.now() - this.lastCacheTime < this.CACHE_TTL)) {
        return this.cachedProjects;
      }

      console.log('Fetching projects from local directory (Cache miss or expired)...');
      const projects = [];
      const folders = this.listProjectFolders();

      for (const folderName of folders) {
        const projectInfo = await this.getProjectInfo(folderName);
        
        if (projectInfo) {
          projects.push(projectInfo);
        }
      }

      // Sort projects by order (if specified) or alphabetically by name
      projects.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return a.name.localeCompare(b.name);
      });

      // Update cache
      this.cachedProjects = projects;
      this.lastCacheTime = Date.now();

      return projects;
    } catch (error) {
      console.error('Error discovering projects from local folder:', error);
      // Fallback to cache if local scan fails and we have a cache, even if expired
      if (this.cachedProjects) {
          console.log('Returning stale cache due to local scan error');
          return this.cachedProjects;
      }
      return [];
    }
  }

  /**
   * Get project information from folder
   */
  async getProjectInfo(folderName) {
    try {
      const projectPath = path.join(this.projectsPath, folderName);
      const indexPath = path.join(projectPath, 'index.html');
      
      // Project must have index.html
      const hasIndex = fs.existsSync(indexPath) && fs.statSync(indexPath).isFile();
      if (!hasIndex) {
        return null;
      }

      // Try to read project.json
      const configPath = path.join(projectPath, 'project.json');
      let config = {};
      
      if (fs.existsSync(configPath)) {
        try {
          const configContent = fs.readFileSync(configPath, 'utf-8');
          config = JSON.parse(configContent);
        } catch (error) {
          console.log(`Error reading project.json for ${folderName}:`, error.message);
        }
      }

      // Use file stats from index.html as date proxy
      const indexStats = fs.statSync(indexPath);

      // Generate project info from folder name and config
      const projectId = config.id || folderName.toLowerCase().replace(/\s+/g, '-');
      const projectName = config.name || this.formatFolderName(folderName);
      
      return {
        id: projectId,
        folderName: folderName,
        name: projectName,
        description: config.description || `Interactive ${projectName} project`,
        category: config.category || 'Web Development',
        difficulty: config.difficulty || 'intermediate',
        thumbnail: config.thumbnail || await this.findThumbnail(folderName),
        tags: config.tags || [],
        estimatedHours: config.estimatedHours || 40,
        order: config.order !== undefined ? config.order : 999,
        version: config.version || '1.0.0',
        createdAt: config.createdAt || (indexStats.birthtime ? indexStats.birthtime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        updatedAt: config.updatedAt || (indexStats.mtime ? indexStats.mtime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        hideFooter: config.hideFooter === true, // Default to false (show footer unless explicitly hidden)
        hideHeader: config.hideHeader === true,
        path: projectPath
      };
    } catch (error) {
      console.error(`Error getting project info for ${folderName}:`, error);
      return null;
    }
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId) {
    const projects = await this.discoverProjects();
    // Case-insensitive matching
    const projectIdLower = projectId?.toLowerCase();
    const project = projects.find(p => 
      p.id?.toLowerCase() === projectIdLower || 
      p.folderName?.toLowerCase() === projectIdLower
    );
    
    if (!project) {
      console.log(`Project not found: ${projectId}`);
    }
    
    return project;
  }

  /**
   * Get project categories
   */
  async getCategories() {
    const projects = await this.discoverProjects();
    const categories = [...new Set(projects.map(p => p.category))];
    return categories.sort();
  }

  /**
   * Get project statistics
   */
  async getStats() {
    const projects = await this.discoverProjects();
    const categories = {};
    const difficulties = {};
    
    projects.forEach(project => {
      categories[project.category] = (categories[project.category] || 0) + 1;
      difficulties[project.difficulty] = (difficulties[project.difficulty] || 0) + 1;
    });

    return {
      total: projects.length,
      byCategory: categories,
      byDifficulty: difficulties
    };
  }

  /**
   * Format folder name to readable name
   */
  formatFolderName(folderName) {
    return folderName
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Find thumbnail image in project folder
   */
  async findThumbnail(folderName) {
    const possiblePaths = [
      'thumbnail.png',
      'thumbnail.jpg',
      'assets/thumbnail.png',
      'assets/thumbnail.jpg',
      'images/thumbnail.png',
      'img/thumbnail.png'
    ];

    for (const thumbPath of possiblePaths) {
      const fullPath = path.join(this.projectsPath, folderName, thumbPath);
      const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
      if (exists) {
        return thumbPath; // Just return the relative path from project root
      }
    }

    return null;
  }

  /**
   * List folders inside projectsPath
   */
  listProjectFolders() {
    if (!fs.existsSync(this.projectsPath)) {
      return [];
    }
    return fs.readdirSync(this.projectsPath, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .map(item => item.name);
  }
}

module.exports = new ProjectDiscoveryService();
