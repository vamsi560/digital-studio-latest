// 📁 File: api/index.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Handle config options request
    if (req.url.includes('/config-options') || req.query.type === 'config') {
      try {
        const configOptions = {
          frameworks: [
            {
              id: 'react',
              name: 'React',
              description: 'A JavaScript library for building user interfaces',
              icon: '⚛️',
              color: '#61DAFB',
              features: ['Component-based', 'Virtual DOM', 'JSX', 'Hooks']
            },
            {
              id: 'vue',
              name: 'Vue.js',
              description: 'The Progressive JavaScript Framework',
              icon: '🟢',
              color: '#4FC08D',
              features: ['Reactive', 'Component-based', 'Single File Components']
            },
            {
              id: 'angular',
              name: 'Angular',
              description: 'Platform for building mobile and desktop web applications',
              icon: '🔴',
              color: '#DD0031',
              features: ['TypeScript', 'Dependency Injection', 'CLI Tools']
            },
            {
              id: 'svelte',
              name: 'Svelte',
              description: 'Cybernetically enhanced web apps',
              icon: '🟠',
              color: '#FF3E00',
              features: ['Compile-time', 'No Virtual DOM', 'Reactive']
            }
          ],
          styling: [
            {
              id: 'tailwind',
              name: 'Tailwind CSS',
              description: 'A utility-first CSS framework',
              icon: '🎨',
              color: '#06B6D4',
              features: ['Utility-first', 'Responsive', 'Customizable']
            },
            {
              id: 'styled-components',
              name: 'Styled Components',
              description: 'Visual primitives for the component age',
              icon: '💅',
              color: '#DB7093',
              features: ['CSS-in-JS', 'Dynamic styling', 'Theme support']
            },
            {
              id: 'pure-css',
              name: 'Pure CSS',
              description: 'A set of small, responsive CSS modules',
              icon: '📄',
              color: '#2F80ED',
              features: ['Lightweight', 'Modular', 'Responsive']
            },
            {
              id: 'scss',
              name: 'SCSS',
              description: 'Sass is the most mature, stable, and powerful CSS extension language',
              icon: '🔧',
              color: '#CF649A',
              features: ['Variables', 'Nesting', 'Mixins', 'Functions']
            }
          ],
          architecture: [
            {
              id: 'component-based',
              name: 'Component-based',
              description: 'Modular components with clear separation of concerns',
              icon: '🧩',
              color: '#4CAF50',
              features: ['Reusable components', 'Clear separation', 'Easy testing']
            },
            {
              id: 'modular',
              name: 'Modular',
              description: 'Feature-based modules with shared utilities',
              icon: '📦',
              color: '#2196F3',
              features: ['Feature modules', 'Shared utilities', 'Scalable']
            },
            {
              id: 'atomic-design',
              name: 'Atomic Design',
              description: 'Atoms, molecules, organisms, templates, and pages',
              icon: '⚛️',
              color: '#9C27B0',
              features: ['Systematic approach', 'Design system', 'Consistency']
            },
            {
              id: 'mvc-pattern',
              name: 'MVC Pattern',
              description: 'Model-View-Controller architecture',
              icon: '🏗️',
              color: '#FF9800',
              features: ['Separation of concerns', 'Maintainable', 'Testable']
            }
          ],
          importSources: [
            {
              id: 'figma',
              name: 'Figma',
              description: 'Collaborative interface design tool',
              icon: '🎨',
              color: '#F24E1E',
              features: ['Design files', 'Components', 'Prototypes']
            },
            {
              id: 'sketch',
              name: 'Sketch',
              description: 'Digital design for Mac',
              icon: '📐',
              color: '#FFAE00',
              features: ['Vector graphics', 'Symbols', 'Artboards']
            },
            {
              id: 'adobe-xd',
              name: 'Adobe XD',
              description: 'Design, prototype, and share user experiences',
              icon: '#',
              color: '#FF61F6',
              features: ['UI/UX design', 'Prototyping', 'Collaboration']
            }
          ]
        };

        res.status(200).json(configOptions);
      } catch (error) {
        console.error('Error in config-options:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      // Default response
      res.status(200).json({ message: 'Digital Studio backend is running!' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
