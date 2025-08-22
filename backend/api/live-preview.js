// backend/api/live-preview.js (Consolidated Version)
import { WebContainer } from '@webcontainer/api';
import { callGenerativeAI, parseJsonWithCorrection } from './utils/shared.js';

let webcontainerInstance = null;

// Initialize WebContainer
async function initializeWebContainer() {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
  }
  return webcontainerInstance;
}

// Generate component analysis
async function generateComponentAnalysis(code) {
  try {
    const analysisPrompt = `
Analyze this React component code and provide a detailed analysis:

${code}

Provide a JSON response with the following structure:
{
  "componentName": "string",
  "componentType": "functional|class|memo|forwardRef",
  "description": "Brief description of what the component does",
  "complexity": "low|medium|high",
  "features": ["array of features like state, effects, props, etc."],
  "props": [
    {
      "name": "propName",
      "type": "string|number|boolean|object|array|function",
      "required": true|false,
      "defaultValue": "default value if any"
    }
  ],
  "hooks": ["array of React hooks used"],
  "hasState": true|false,
  "hasEffects": true|false,
  "hasContext": true|false,
  "hasRefs": true|false,
  "imports": ["array of imports"],
  "estimatedLines": number,
  "suggestions": ["array of improvement suggestions"]
}
`;

    const analysisResult = await callGenerativeAI(analysisPrompt, [], true);
    const parsedAnalysis = await parseJsonWithCorrection(analysisResult, analysisPrompt, []);
    
    return parsedAnalysis;
  } catch (error) {
    console.error('Component analysis error:', error);
    return {
      componentName: 'Unknown Component',
      componentType: 'functional',
      description: 'Component analysis failed',
      complexity: 'medium',
      features: [],
      props: [],
      hooks: [],
      hasState: false,
      hasEffects: false,
      hasContext: false,
      hasRefs: false,
      imports: [],
      estimatedLines: 0,
      suggestions: []
    };
  }
}

// Enhanced live preview with support for multiple frameworks
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { files, code, framework = 'react', projectName = 'generated-app' } = req.body;

    // Handle both files and code parameters
    let projectFiles = {};
    
    if (files && Object.keys(files).length > 0) {
      // Use provided files
      Object.entries(files).forEach(([path, content]) => {
        projectFiles[path] = { file: { contents: content } };
      });
    } else if (code) {
      // Generate a simple React project from code
      projectFiles = {
        'package.json': {
          file: {
            contents: JSON.stringify({
              name: projectName,
              version: '0.1.0',
              private: true,
              dependencies: {
                'react': '^18.2.0',
                'react-dom': '^18.2.0',
                '@types/react': '^18.2.0',
                '@types/react-dom': '^18.2.0'
              },
              scripts: {
                start: 'react-scripts start',
                build: 'react-scripts build',
                test: 'react-scripts test',
                eject: 'react-scripts eject'
              },
              devDependencies: {
                'react-scripts': '5.0.1'
              },
              browserslist: {
                production: ['>0.2%', 'not dead', 'not op_mini all'],
                development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
              }
            }, null, 2)
          }
        },
        'public/index.html': {
          file: {
            contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>${projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
          }
        },
        'src/index.js': {
          file: {
            contents: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
          }
        },
        'src/App.js': {
          file: {
            contents: code
          }
        }
      };
    } else {
      return res.status(400).json({ error: 'No files or code provided for preview.' });
    }

    // Generate component analysis if code is provided
    let analysis = null;
    if (code) {
      analysis = await generateComponentAnalysis(code);
    }

    const instance = await initializeWebContainer();

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

    // Generate preview HTML for iframe
    const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Preview</title>
    <style>
        body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .preview-container { max-width: 100%; overflow: auto; }
    </style>
</head>
<body>
    <div class="preview-container">
        <div id="root"></div>
    </div>
    <script>
        // Simple React component renderer for preview
        const React = window.React;
        const ReactDOM = window.ReactDOM;
        
        if (React && ReactDOM) {
            try {
                const root = ReactDOM.createRoot(document.getElementById('root'));
                // The component will be rendered here when the main app loads
                window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
            } catch (error) {
                window.parent.postMessage({ type: 'PREVIEW_ERROR', error }, '*');
            }
        } else {
            // Fallback: redirect to the actual server
            window.location.href = '${serverUrl}';
        }
    </script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
</body>
</html>`;

    res.status(200).json({ 
      success: true,
      url: serverUrl,
      previewHTML,
      framework,
      projectName,
      status: 'ready',
      analysis,
      dependencies: analysis?.imports || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in live-preview:', error);
    res.status(500).json({ 
      error: 'Failed to start live preview',
      details: error.message 
    });
  }
} 
