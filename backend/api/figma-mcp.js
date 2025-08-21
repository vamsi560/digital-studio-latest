import axios from 'axios';
import { callGenerativeAI, parseJsonWithCorrection } from './utils/shared.js';

function extractFileKey(figmaUrl) {
  const match = figmaUrl.match(/figma\.com\/(file|design)\/([a-zA-Z0-9]+)\//);
  return match ? match[2] : null;
}

export default async (req, res) => {
  try {
    const { figmaUrl, framework, styling, architecture } = req.body;
    
    if (!figmaUrl) {
      return res.status(400).json({ error: 'No figmaUrl provided.' });
    }
    
    const fileKey = extractFileKey(figmaUrl);
    if (!fileKey) {
      return res.status(400).json({ error: 'Invalid Figma URL.' });
    }

    const token = "figd_00LP2oP9Fqfd0PY0alm9L9tsjlC85pn8m5KEeXMn";
    if (!token) {
      return res.status(400).json({
        error: 'FIGMA_API_TOKEN is not configured on the server.'
      });
    }

    const headers = {
      'X-Figma-Token': token,
      'User-Agent': 'vm-digital-studio/1.0',
      'Accept': 'application/json'
    };

    // Step 1: Get Figma file structure and design tokens
    const fileResp = await axios.get(`https://api.figma.com/v1/files/${fileKey}`, { headers });
    const document = fileResp.data.document;
    
    // Step 2: Extract design tokens and components
    const designData = extractDesignTokens(document);
    
    // Step 3: Get images for visual reference
    const frames = extractFrames(document);
    const imageUrls = await getImageUrls(fileKey, frames, headers);
    
    // Step 4: Generate code using AI with design tokens
    const generatedCode = await generateCodeFromDesign(designData, imageUrls, {
      framework: framework || 'react',
      styling: styling || 'tailwind',
      architecture: architecture || 'component-based'
    });

    res.status(200).json({
      success: true,
      designTokens: designData.tokens,
      components: designData.components,
      screens: designData.screens,
      generatedCode,
      images: imageUrls
    });

  } catch (err) {
    console.error('Figma MCP error:', err);
    res.status(500).json({
      error: 'Figma MCP integration failed',
      details: err.message
    });
  }
};

function extractDesignTokens(document) {
  const tokens = {
    colors: {},
    typography: {},
    spacing: {},
    shadows: {},
    borderRadius: {}
  };
  
  const components = [];
  const screens = [];

  function traverseNode(node, parentPath = '') {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    
    // Extract colors
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID' && fill.color) {
          const colorKey = `color-${Math.round(fill.color.r * 255)}-${Math.round(fill.color.g * 255)}-${Math.round(fill.color.b * 255)}`;
          tokens.colors[colorKey] = `rgb(${Math.round(fill.color.r * 255)}, ${Math.round(fill.color.g * 255)}, ${Math.round(fill.color.b * 255)})`;
        }
      });
    }

    // Extract typography
    if (node.style && node.style.fontFamily) {
      const fontKey = `font-${node.style.fontFamily}-${node.style.fontSize}`;
      tokens.typography[fontKey] = {
        fontFamily: node.style.fontFamily,
        fontSize: node.style.fontSize,
        fontWeight: node.style.fontWeight || 400,
        lineHeight: node.style.lineHeightPx
      };
    }

    // Extract spacing and sizing
    if (node.absoluteBoundingBox) {
      const { width, height } = node.absoluteBoundingBox;
      tokens.spacing[`w-${Math.round(width)}`] = `${width}px`;
      tokens.spacing[`h-${Math.round(height)}`] = `${height}px`;
    }

    // Extract shadows
    if (node.effects && Array.isArray(node.effects)) {
      node.effects.forEach(effect => {
        if (effect.type === 'DROP_SHADOW') {
          const shadowKey = `shadow-${Math.round(effect.radius)}`;
          tokens.shadows[shadowKey] = `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px rgba(0,0,0,${effect.opacity})`;
        }
      });
    }

    // Extract border radius
    if (node.cornerRadius) {
      tokens.borderRadius[`radius-${Math.round(node.cornerRadius)}`] = `${node.cornerRadius}px`;
    }

    // Identify components
    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      components.push({
        id: node.id,
        name: node.name,
        path,
        type: node.type,
        properties: extractComponentProperties(node)
      });
    }

    // Identify screens/frames
    if (node.type === 'FRAME') {
      screens.push({
        id: node.id,
        name: node.name,
        path,
        width: node.absoluteBoundingBox?.width,
        height: node.absoluteBoundingBox?.height,
        children: node.children?.length || 0
      });
    }

    // Recursively traverse children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => traverseNode(child, path));
    }
  }

  traverseNode(document);

  return { tokens, components, screens };
}

function extractComponentProperties(node) {
  const properties = {};
  
  if (node.absoluteBoundingBox) {
    properties.size = {
      width: node.absoluteBoundingBox.width,
      height: node.absoluteBoundingBox.height
    };
  }
  
  if (node.fills && Array.isArray(node.fills)) {
    properties.background = node.fills.map(fill => ({
      type: fill.type,
      color: fill.color,
      opacity: fill.opacity
    }));
  }
  
  if (node.strokes && Array.isArray(node.strokes)) {
    properties.border = node.strokes.map(stroke => ({
      color: stroke.color,
      weight: stroke.weight,
      type: stroke.type
    }));
  }
  
  return properties;
}

function extractFrames(document) {
  const frames = [];
  
  function findFrames(node) {
    if (node.type === 'FRAME') {
      frames.push({ id: node.id, name: node.name });
    }
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(findFrames);
    }
  }
  
  findFrames(document);
  return frames;
}

async function getImageUrls(fileKey, frames, headers) {
  if (frames.length === 0) return [];
  
  const ids = frames.map(f => f.id).join(',');
  const imagesResp = await axios.get(`https://api.figma.com/v1/images/${fileKey}?ids=${ids}&format=png`, { headers });
  const images = imagesResp.data.images || {};
  
  return frames.map(frame => ({
    id: frame.id,
    name: frame.name,
    url: images[frame.id] || null
  })).filter(img => img.url);
}

async function generateCodeFromDesign(designData, images, options) {
  const { framework, styling, architecture } = options;
  
  // Create a comprehensive prompt for code generation
  const prompt = `
Generate ${framework} code for a design system based on the following extracted design tokens and components:

DESIGN TOKENS:
${JSON.stringify(designData.tokens, null, 2)}

COMPONENTS:
${JSON.stringify(designData.components, null, 2)}

SCREENS:
${JSON.stringify(designData.screens, null, 2)}

REQUIREMENTS:
- Framework: ${framework}
- Styling: ${styling}
- Architecture: ${architecture}
- Use the extracted design tokens for consistent styling
- Create reusable components based on the identified components
- Generate screen layouts based on the frame structure
- Include proper TypeScript types if applicable
- Follow best practices for the selected framework and styling approach

Generate the following files:
1. Main component files for each screen
2. Reusable component files
3. Design token configuration
4. Styling files (CSS/Tailwind/SCSS)
5. Package.json with appropriate dependencies
6. README with setup instructions

Respond with a JSON object containing all generated files with their content.
`;

  try {
    const generatedCode = await callGenerativeAI(prompt, [], true);
    const parsedCode = await parseJsonWithCorrection(generatedCode, prompt, []);
    
    return parsedCode;
  } catch (error) {
    console.error('Code generation error:', error);
    throw new Error('Failed to generate code from design tokens');
  }
} 