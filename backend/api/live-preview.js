// backend/api/live-preview.js (Consolidated Version)
import { WebContainer } from '@webcontainer/api';

let webcontainerInstance = null;

// Initialize WebContainer
async function initializeWebContainer() {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
  }
  return webcontainerInstance;
}

// Enhanced live preview with support for multiple frameworks
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { files, framework = 'react', projectName = 'generated-app' } = req.body;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files provided for preview.' });
    }

    const instance = await initializeWebContainer();

    // Prepare project files based on framework
    const projectFiles = {};
    
    Object.entries(files).forEach(([path, content]) => {
      // Ensure proper file structure for different frameworks
      let adjustedPath = path;
      
      if (framework === 'vue' && path.endsWith('.vue')) {
        // Vue files need special handling
        projectFiles[path] = { file: { contents: content } };
      } else if (framework === 'angular' && path.endsWith('.ts')) {
        // Angular TypeScript files
        projectFiles[path] = { file: { contents: content } };
      } else if (framework === 'svelte' && path.endsWith('.svelte')) {
        // Svelte files
        projectFiles[path] = { file: { contents: content } };
      } else {
        // Default handling for React and other frameworks
        projectFiles[path] = { file: { contents: content } };
      }
    });

    // Add framework-specific configuration files
    if (framework === 'vue') {
      // Add Vite config for Vue
      if (!projectFiles['vite.config.js']) {
        projectFiles['vite.config.js'] = {
          file: {
            contents: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true
  }
})`
          }
        };
      }
    } else if (framework === 'svelte') {
      // Add Vite config for Svelte
      if (!projectFiles['vite.config.js']) {
        projectFiles['vite.config.js'] = {
          file: {
            contents: `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000,
    host: true
  }
})`
          }
        };
      }
    }

    // Mount the project files
    await instance.mount(projectFiles);

    // Set up server ready listener
    let serverUrl = null;
    instance.on('server-ready', (port, url) => {
      serverUrl = url;
    });

    // Install dependencies based on framework
    const installProcess = await instance.spawn('npm', ['install']);
    await installProcess.exit;

    // Start the development server based on framework
    let devProcess;
    if (framework === 'vue' || framework === 'svelte') {
      devProcess = await instance.spawn('npm', ['run', 'dev']);
    } else if (framework === 'angular') {
      devProcess = await instance.spawn('ng', ['serve', '--port', '3000']);
    } else {
      // Default to React
      devProcess = await instance.spawn('npm', ['start']);
    }

    // Wait for server to be ready
    let attempts = 0;
    const maxAttempts = 30;
    while (!serverUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!serverUrl) {
      return res.status(500).json({ 
        error: 'Server failed to start within expected time',
        details: 'The development server did not become ready in time.'
      });
    }

    res.status(200).json({ 
      url: serverUrl,
      framework,
      projectName,
      status: 'ready'
    });

  } catch (error) {
    console.error('Error in live-preview:', error);
    res.status(500).json({ 
      error: 'Failed to start live preview',
      details: error.message 
    });
  }
} 
