import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Divider, IconButton, Typography } from '@mui/material';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import Cookies from 'js-cookie';
import { darkTheme } from './theme';
import AdvancedReactPreview from './components/advanced-react-preview';
import {
  EnhancedServiceCard,
  EnhancedWorkflowStatus,
  EnhancedFileUpload,
  EnhancedImageTray,
  EnhancedDropZone,
  EnhancedActionButtons,
  EnhancedFigmaInput,
  EnhancedStylesheetSection,
  EnhancedHeader,
  EnhancedErrorDisplay,
  EnhancedLoadingOverlay,
} from './components/EnhancedUI';
import {
  Code,
  Image,
  Build,
  Rocket,
  AutoAwesome,
  Psychology,
  Architecture,
  Construction,
  Handyman,
  Verified,
  Schedule,
  Timeline,
  Assessment,
  Analytics,
  Dashboard,
  ViewModule,
  ViewList,
  GridView,
  ListAlt,
  DragIndicator,
  DragHandle,
  ContentCopy,
  Share,
  MoreVert,
  Close,
  Minimize,
  Maximize,
  FullscreenExit,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  GitHub,
  ArrowBack,
  Refresh,
  Fullscreen,
  Visibility,
  VisibilityOff,
  Palette,
  Typography as TypographyIcon,
  BorderRadius,
  ColorLens,
  Upload,
  FolderOpen,
  Description,
  Speed,
  Security,
  Support,
  Star,
  TrendingUp,
} from '@mui/icons-material';

// Main Application Component
const AppEnhanced = () => {
  // State management
  const [currentView, setCurrentView] = useState('initial');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [flowOrder, setFlowOrder] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [stylesheetContent, setStylesheetContent] = useState('');
  const [designTokens, setDesignTokens] = useState({});
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [accuracyResult, setAccuracyResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState({});
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [isJsZipLoaded, setIsJsZipLoaded] = useState(false);
  const [projectName, setProjectName] = useState('react-project');

  // Load JSZip
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => setIsJsZipLoaded(true);
    document.head.appendChild(script);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((files) => {
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  // Drag and drop handlers
  const handleDragStart = (e, file) => {
    setDraggedItem(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const newFlowOrder = [...flowOrder];
    newFlowOrder[index] = draggedItem;
    setFlowOrder(newFlowOrder);
    setUploadedFiles(uploadedFiles.filter(f => f !== draggedItem));
    setDraggedItem(null);
  };

  // Figma import handler
  const handleFigmaImport = async () => {
    if (!figmaUrl.trim()) return;
    
    setIsLoading(true);
    setError('');
    setWorkflowStatus({});

    try {
      const response = await fetch('/api/import-figma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaUrl }),
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Figma API error: ${err.error || response.statusText}`);
      }
      
      const images = await response.json();
      const imageFiles = images.map(img => {
        const byteString = atob(img.data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: img.mimeType });
        return new File([blob], img.fileName, { type: img.mimeType });
      });
      
      handleFileUpload(imageFiles);
    } catch (error) {
      console.error('Figma import failed:', error);
      setError(`Figma import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setWorkflowStatus({});
    }
  };

  // Code generation handler
  const handleGenerateCode = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedFiles({});
    setAccuracyResult(null);

    const formData = new FormData();
    const orderedFiles = flowOrder.filter(Boolean);
    orderedFiles.forEach(file => formData.append('screens', file));
    formData.append('orderedFileNames', JSON.stringify(orderedFiles.map(f => f.name)));
    if (stylesheetContent) formData.append('stylesheet', stylesheetContent);
    if (Object.keys(designTokens).length > 0) formData.append('designTokens', JSON.stringify(designTokens));
    formData.append('projectName', projectName);

    try {
      setWorkflowStatus({ text: 'Architect: Analyzing project structure...', architect: 'running' });
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      
      setWorkflowStatus(prev => ({ ...prev, text: 'Component Builder: Creating reusable components...', architect: 'completed', builder: 'running' }));
      await new Promise(res => setTimeout(res, 800));

      setWorkflowStatus(prev => ({ ...prev, text: 'Page Composer: Assembling pages...', builder: 'completed', composer: 'running' }));
      await new Promise(res => setTimeout(res, 800));
      
      const data = await response.json();

      setWorkflowStatus(prev => ({ ...prev, text: 'Finisher & QA: Finalizing and checking quality...', composer: 'completed', finisher: 'running' }));
      await new Promise(res => setTimeout(res, 800));

      setGeneratedFiles(data.files || {});
      setAccuracyResult(data.accuracyResult);
      setWorkflowStatus({ text: 'Done!', architect: 'completed', builder: 'completed', composer: 'completed', finisher: 'completed' });

    } catch (error) {
      console.error('Error generating code:', error);
      setError(error.message);
      setWorkflowStatus({ text: `Error: ${error.message}`, architect: 'completed', builder: 'completed', composer: 'completed', finisher: 'error' });
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  // Download handler
  const handleDownload = async () => {
    if (!isJsZipLoaded) {
      setError("Zip library not loaded yet. Please wait.");
      return;
    }
    
    const zip = new window.JSZip();
    for (const path in generatedFiles) {
      zip.file(path, generatedFiles[path]);
    }
    
    const zipBlob = await zip.generateAsync({type:"blob"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${projectName || 'react-project'}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Preview handler
  const handlePreview = async () => {
    setIsPreviewing(true);

    if (!window.WebContainer) {
      setError("Error: WebContainer API is not available. Preview cannot be started.");
      setIsPreviewing(false);
      return;
    }

    setLoadingText('Booting WebContainer...');
    
    try {
      const webcontainerInstance = await window.WebContainer.boot();
      
      const projectFiles = {};
      for(const path in generatedFiles) {
        projectFiles[path] = { file: { contents: generatedFiles[path] } };
      }
      
      await webcontainerInstance.mount(projectFiles);

      webcontainerInstance.on('server-ready', (port, url) => {
        setPreviewUrl(url);
        setLoadingText('');
      });

      const installProcess = await webcontainerInstance.spawn('npm', ['install']);
      setLoadingText('Installing dependencies...');
      await installProcess.exit;

      const devProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);
      setLoadingText('Starting dev server...');
    } catch (error) {
      console.error("Failed to boot WebContainer:", error);
      setError("Failed to start the preview environment. See console for details.");
      setIsPreviewing(false);
    }
  };

  // Auto-select main file for preview
  useEffect(() => {
    if (generatedFiles && Object.keys(generatedFiles).length > 0) {
      const mainFile = Object.keys(generatedFiles).find(f => f.endsWith('App.jsx') || f.endsWith('App.js') || f.endsWith('App.tsx'));
      if (mainFile) setPreviewCode(generatedFiles[mainFile]);
    }
  }, [generatedFiles]);

  // Navigation handler
  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Initial View
  if (currentView === 'initial') {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            background: 'linear-gradient(135deg, #0D0F18 0%, #111827 100%)',
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 8 }}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 2 }}>
              VM Digital Studio does
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  ml: 2,
                }}
              >
                that.
              </Box>
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ fontStyle: 'italic', color: 'text.secondary', maxWidth: 800, mb: 4 }}>
            "You've got to start with the user experience and work back toward the technology - not the other way around."
            <Box component="span" sx={{ display: 'block', mt: 1, fontStyle: 'normal' }}>
              - Steve Jobs
            </Box>
          </Typography>
          
          <Box
            onClick={() => handleNavigate('landing')}
            sx={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'pointer',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          >
            <KeyboardArrowDown sx={{ fontSize: 48, color: 'text.secondary' }} />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Landing View
  if (currentView === 'landing') {
    const services = [
      {
        title: 'Design to Code',
        description: 'Transform Figma designs into production-ready React components',
        icon: <Code />,
        onClick: () => handleNavigate('main'),
      },
      {
        title: 'AI Code Generation',
        description: 'Generate intelligent code with advanced AI assistance',
        icon: <AutoAwesome />,
        onClick: () => handleNavigate('main'),
      },
      {
        title: 'Component Library',
        description: 'Build and manage reusable component systems',
        icon: <ViewModule />,
        onClick: () => handleNavigate('main'),
      },
      {
        title: 'Code Analysis',
        description: 'Analyze and optimize your codebase',
        icon: <Analytics />,
        onClick: () => handleNavigate('main'),
      },
      {
        title: 'Performance Testing',
        description: 'Test and optimize application performance',
        icon: <Speed />,
        onClick: () => handleNavigate('main'),
        comingSoon: true,
      },
      {
        title: 'Security Audit',
        description: 'Automated security analysis and recommendations',
        icon: <Security />,
        onClick: () => handleNavigate('main'),
        comingSoon: true,
      },
    ];

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <EnhancedHeader
            title="VM Digital Studio"
            subtitle="Professional design-to-code platform"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <IconButton
              component="a"
              href="https://github.com"
              target="_blank"
              sx={{ color: 'text.secondary' }}
            >
              <GitHub />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {services.map((service, index) => (
              <EnhancedServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                onClick={service.onClick}
                disabled={service.comingSoon}
                comingSoon={service.comingSoon}
              />
            ))}
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  // Main Application View
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0D0D0D 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleNavigate('landing')}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #fff, #888)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Design to Code Studio
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transform designs into production-ready React components
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88' }} />
                  <Typography variant="caption" color="text.secondary">Live</Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, gap: 4 }}>
            {/* Left Panel - Enhanced Controls */}
            <Box sx={{ width: { xs: '100%', xl: 380 }, flexShrink: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Import Section */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <Upload sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(45deg, #fff, #ccc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      IMPORT DESIGN
                    </Typography>
                  </Box>
                  <EnhancedFigmaInput
                    value={figmaUrl}
                    onChange={setFigmaUrl}
                    onImport={handleFigmaImport}
                    loading={isLoading}
                  />
                </Box>
                
                {/* Stylesheet Section */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                      <Palette sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(45deg, #fff, #ccc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      STYLES & TOKENS
                    </Typography>
                  </Box>
                  <EnhancedStylesheetSection
                    onFileUpload={setStylesheetContent}
                    onManualStyles={() => setIsTooltipVisible(!isTooltipVisible)}
                    designTokens={designTokens}
                    onDesignTokensChange={setDesignTokens}
                  />
                </Box>
                
                {/* Image Tray */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    flexGrow: 1,
                    minHeight: 0,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                      <Image sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(45deg, #fff, #ccc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      IMAGE TRAY
                    </Typography>
                  </Box>
                  
                  <EnhancedFileUpload
                    onFileUpload={handleFileUpload}
                    disabled={!isJsZipLoaded}
                    accept="image/*,.zip"
                  />
                  
                  {uploadedFiles.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <EnhancedImageTray
                        images={uploadedFiles}
                        onImageDragStart={handleDragStart}
                        onImageRemove={(index) => {
                          setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            
            {/* Right Panel - Enhanced Main Content */}
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Screen Flow */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                      <DragIndicator sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(45deg, #fff, #ccc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      SCREEN FLOW
                    </Typography>
                  </Box>
                  
                  <EnhancedDropZone
                    onDrop={(e, index) => handleDrop(e, index)}
                    isDragOver={!!draggedItem}
                  >
                    {flowOrder.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {flowOrder.map((file, index) => (
                          file && (
                            <Box
                              key={index}
                              sx={{
                                width: 140,
                                height: 140,
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                position: 'relative',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px) scale(1.02)',
                                  borderColor: 'primary.main',
                                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                },
                              }}
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                                  p: 1,
                                }}
                              >
                                <Typography variant="caption" sx={{ color: 'white', fontSize: '0.7rem' }}>
                                  {file.name}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const newOrder = [...flowOrder];
                                  newOrder[index] = null;
                                  setFlowOrder(newOrder);
                                  setUploadedFiles(prev => [...prev, file]);
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                  color: 'white',
                                  backdropFilter: 'blur(10px)',
                                  '&:hover': { 
                                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                    transform: 'scale(1.1)',
                                  },
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <Close fontSize="small" />
                              </IconButton>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  background: 'rgba(0, 255, 136, 0.9)',
                                  color: 'black',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                }}
                              >
                                {index + 1}
                              </Box>
                            </Box>
                          )
                        ))}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 8,
                          border: '2px dashed rgba(255, 255, 255, 0.2)',
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.02)',
                        }}
                      >
                        <DragIndicator sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          Arrange Your Screens
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Drag images from the tray to create your screen flow
                        </Typography>
                      </Box>
                    )}
                  </EnhancedDropZone>
                </Box>
                
                {/* Actions */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                      <Rocket sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(45deg, #fff, #ccc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      GENERATE & EXPORT
                    </Typography>
                  </Box>
                  
                  <EnhancedActionButtons
                    onGenerate={handleGenerateCode}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    loading={isLoading}
                  />
                </Box>
                
                {/* Workflow Status */}
                {Object.keys(workflowStatus).length > 0 && (
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 3,
                      p: 3,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <EnhancedWorkflowStatus
                      status={workflowStatus}
                      error={error}
                    />
                  </Box>
                )}
                
                {/* Error Display */}
                <EnhancedErrorDisplay
                  message={error}
                  onRetry={() => setError('')}
                />
                
                {/* Generated Code Preview */}
                {Object.keys(generatedFiles).length > 0 && (
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 3,
                      p: 3,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
                        <Code sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(45deg, #fff, #ccc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      GENERATED CODE PREVIEW
                      </Typography>
                    </Box>
                    
                    <AdvancedReactPreview
                      code={previewCode}
                      className="w-full"
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AppEnhanced; 
