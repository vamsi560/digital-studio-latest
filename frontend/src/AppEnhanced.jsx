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
  
  // Modal states - moved to top level
  const [showFigmaModal, setShowFigmaModal] = useState(false);
  const [showStylesModal, setShowStylesModal] = useState(false);
  const [showTokensModal, setShowTokensModal] = useState(false);

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

    // Determine which endpoint to use based on current view
    let endpoint = '/api/generate-code'; // Default for prototype lab
    if (['android-lab', 'ios-lab', 'pwa-lab'].includes(currentView)) {
      endpoint = '/api/generate-native-code';
      formData.append('platform', currentView.replace('-lab', ''));
    }

    try {
      setWorkflowStatus({ text: 'Architect: Analyzing project structure...', architect: 'running' });
      const response = await fetch(endpoint, {
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

  // Landing View - "Introducing" page with three lab cards
  if (currentView === 'landing') {
    const labs = [
      {
        title: 'Prototype Lab',
        icon: <ViewModule />,
        onClick: () => handleNavigate('prototype-lab'),
      },
      {
        title: 'App Lab',
        icon: <Build />,
        onClick: () => handleNavigate('app-lab'),
      },
      {
        title: 'Integration Lab',
        icon: <Refresh />,
        onClick: () => handleNavigate('integration-lab'),
      },
    ];

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0D0F18 0%, #111827 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          {/* Header with VM logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              VM
            </Box>
            <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 600 }}>
              Digital Studio
            </Typography>
          </Box>
          
          {/* Main title */}
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
            Introducing
          </Typography>
          
          {/* Subtitle */}
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 8 }}>
            We do ui/ux design for
          </Typography>
          
          {/* Three lab cards */}
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {labs.map((lab, index) => (
              <Box
                key={lab.title}
                onClick={lab.onClick}
                sx={{
                  width: 200,
                  height: 200,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-8px)',
                    borderColor: '#00ff88',
                  },
                }}
              >
                <Box sx={{ mb: 2, color: 'white' }}>
                  {React.cloneElement(lab.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  {lab.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Prototype Lab View - Redesigned with rich UI
  if (currentView === 'prototype-lab') {

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
          {/* Compact Header */}
          <Box
            sx={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'sticky',
              top: 0,
              zIndex: 1000,
            }}
          >
            <Container maxWidth="xl">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={() => handleNavigate('landing')}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #fff, #888)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Prototype Lab
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Design to React Components
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 1.5, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88' }} />
                    <Typography variant="caption" sx={{ color: '#00ff88', fontSize: '0.7rem' }}>Live</Typography>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>

          <Container maxWidth="xl" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
            {/* Floating Action Bar */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5, 
              mb: 4, 
              flexWrap: 'wrap',
              justifyContent: 'center',
              '& > *': {
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.05)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }
              }
            }}>
              {/* Figma Import Button */}
              <Box
                onClick={() => setShowFigmaModal(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                {/* Figma Icon */}
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #F24E1E 0%, #FF7262 100%)',
                    borderRadius: '3px',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      width: '8px',
                      height: '8px',
                      background: 'white',
                      borderRadius: '1px',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '8px',
                      background: 'white',
                      borderRadius: '1px',
                    }
                  }} />
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '0.85rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  Import Figma
                </Typography>
              </Box>

              {/* Styles Button */}
              <Box
                onClick={() => setShowStylesModal(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.1), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Box sx={{
                    width: 18,
                    height: 18,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                    borderRadius: '50%',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '8px',
                      height: '8px',
                      background: 'white',
                      borderRadius: '50%',
                    }
                  }} />
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '0.85rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  Styles
                </Typography>
              </Box>

              {/* Tokens Button */}
              <Box
                onClick={() => setShowTokensModal(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Box sx={{
                    width: 16,
                    height: 16,
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    borderRadius: '3px',
                    position: 'relative',
                    transform: 'rotate(45deg)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '6px',
                      height: '6px',
                      background: 'white',
                      borderRadius: '50%',
                    }
                  }} />
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '0.85rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  Tokens
                </Typography>
              </Box>
            </Box>

            {/* Creative Layout - No Traditional Boxes */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' }, 
              gap: 4,
              position: 'relative'
            }}>
              {/* Left Sidebar - Floating Elements */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
                position: 'relative'
              }}>
                {/* Upload Area - Floating Panel */}
                <Box sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-1px',
                    left: '-1px',
                    right: '-1px',
                    bottom: '-1px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c)',
                    borderRadius: '16px',
                    zIndex: -1,
                    opacity: 0.3,
                    filter: 'blur(8px)',
                  }
                }}>
                  <Box sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    }
                  }}>
                    {/* Upload Icon */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 2,
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '16px',
                          height: '16px',
                          background: 'white',
                          borderRadius: '2px',
                          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)',
                        }
                      }} />
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}>
                        Upload Images
                      </Typography>
                    </Box>
                    
                    <EnhancedFileUpload
                      onFileUpload={handleFileUpload}
                      disabled={!isJsZipLoaded}
                      accept="image/*,.zip"
                    />
                    
                    {uploadedFiles.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                          px: 1.5,
                          py: 0.5,
                          background: 'rgba(34, 197, 94, 0.2)',
                          borderRadius: '20px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          width: 'fit-content'
                        }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                          <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 600 }}>
                            {uploadedFiles.length} image{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                          </Typography>
                        </Box>
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

                {/* Actions Area - Floating Panel */}
                <Box sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-1px',
                    left: '-1px',
                    right: '-1px',
                    bottom: '-1px',
                    background: 'linear-gradient(135deg, #10B981, #059669, #34D399, #6EE7B7)',
                    borderRadius: '16px',
                    zIndex: -1,
                    opacity: 0.3,
                    filter: 'blur(8px)',
                  }
                }}>
                  <Box sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    }
                  }}>
                    {/* Generate Icon */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 2 
                    }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '16px',
                          height: '16px',
                          background: 'white',
                          borderRadius: '50%',
                          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)',
                        }
                      }} />
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}>
                        Generate Code
                      </Typography>
                    </Box>
                    
                    <EnhancedActionButtons
                      onGenerate={handleGenerateCode}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      loading={isLoading}
                    />
                  </Box>
                </Box>

                {/* Status Area */}
                {Object.keys(workflowStatus).length > 0 && (
                  <Box sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    p: 2.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      background: 'linear-gradient(180deg, #3B82F6, #1D4ED8)',
                      borderRadius: '0 2px 2px 0',
                    }
                  }}>
                    <EnhancedWorkflowStatus
                      status={workflowStatus}
                      error={error}
                    />
                  </Box>
                )}
              </Box>
              
              {/* Right Content - Main Area */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 4,
                position: 'relative'
              }}>
                {/* Screen Flow - Floating Canvas */}
                <Box sx={{
                  position: 'relative',
                  minHeight: 400,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(135deg, #EC4899, #F43F5E, #F97316, #EAB308)',
                    borderRadius: '20px',
                    zIndex: -1,
                    opacity: 0.2,
                    filter: 'blur(12px)',
                  }
                }}>
                  <Box sx={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: '18px',
                    p: 4,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: 400,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    }
                  }}>
                    {/* Flow Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 3,
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '18px',
                          height: '18px',
                          background: 'white',
                          borderRadius: '2px',
                          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)',
                        }
                      }} />
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}>
                        Screen Flow
                      </Typography>
                      {flowOrder.length > 0 && (
                        <Box sx={{ 
                          ml: 'auto', 
                          px: 2, 
                          py: 1, 
                          background: 'rgba(34, 197, 94, 0.2)', 
                          borderRadius: '20px',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <Typography variant="body2" sx={{ 
                            color: '#22C55E', 
                            fontWeight: 700,
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                          }}>
                            {flowOrder.filter(Boolean).length} screens
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <EnhancedDropZone
                      onDrop={(e, index) => handleDrop(e, index)}
                      isDragOver={!!draggedItem}
                    >
                      {flowOrder.length > 0 ? (
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                          gap: 3,
                          p: 2
                        }}>
                          {flowOrder.map((file, index) => (
                            file && (
                              <Box
                                key={index}
                                sx={{
                                  aspectRatio: '1',
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  border: '2px solid rgba(255, 255, 255, 0.2)',
                                  position: 'relative',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  backdropFilter: 'blur(10px)',
                                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    transform: 'translateY(-8px) scale(1.05)',
                                    borderColor: '#8B5CF6',
                                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
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
                                    p: 1.5,
                                  }}
                                >
                                  <Typography variant="caption" sx={{ 
                                    color: 'white', 
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                                  }}>
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
                                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    width: 24,
                                    height: 24,
                                    '&:hover': { 
                                      backgroundColor: 'rgba(220, 38, 38, 1)',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <Close sx={{ fontSize: 14 }} />
                                </IconButton>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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
                            border: '2px dashed rgba(255, 255, 255, 0.3)',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(10px)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '80px',
                              height: '80px',
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
                              borderRadius: '50%',
                              filter: 'blur(20px)',
                            }
                          }}
                        >
                          <Box sx={{
                            width: 64,
                            height: 64,
                            background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '32px',
                              height: '32px',
                              background: 'white',
                              borderRadius: '4px',
                              clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)',
                            }
                          }} />
                          <Typography variant="h6" color="white" sx={{ 
                            mb: 1,
                            fontWeight: 600,
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                          }}>
                            Arrange Your Screens
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                          }}>
                            Drag images from the tray to create your screen flow
                          </Typography>
                        </Box>
                      )}
                    </EnhancedDropZone>
                  </Box>
                </Box>
                
                {/* Generated Code Preview */}
                {Object.keys(generatedFiles).length > 0 && (
                  <Box sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706, #F97316, #EA580C)',
                      borderRadius: '20px',
                      zIndex: -1,
                      opacity: 0.2,
                      filter: 'blur(12px)',
                    }
                  }}>
                    <Box sx={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      backdropFilter: 'blur(25px)',
                      borderRadius: '18px',
                      p: 4,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        mb: 3 
                      }}>
                        <Box sx={{
                          width: 36,
                          height: 36,
                          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '20px',
                            height: '20px',
                            background: 'white',
                            borderRadius: '2px',
                            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)',
                          }
                        }} />
                        <Typography variant="h5" sx={{ 
                          fontWeight: 700, 
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                          Generated Code Preview
                        </Typography>
                      </Box>
                      
                      <AdvancedReactPreview
                        code={previewCode}
                        className="w-full"
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Container>

          {/* Figma Import Modal */}
          {showFigmaModal && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
              onClick={() => setShowFigmaModal(false)}
            >
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  maxWidth: 500,
                  width: '100%',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <Box sx={{ width: 20, height: 20, background: 'white', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 700, fontSize: '0.7rem' }}>F</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                    Import from Figma
                  </Typography>
                </Box>
                
                <EnhancedFigmaInput
                  value={figmaUrl}
                  onChange={setFigmaUrl}
                  onImport={() => {
                    handleFigmaImport();
                    setShowFigmaModal(false);
                  }}
                  loading={isLoading}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    onClick={() => setShowFigmaModal(false)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Styles Modal */}
          {showStylesModal && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
              onClick={() => setShowStylesModal(false)}
            >
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  maxWidth: 600,
                  width: '100%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <Palette sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                    Styles & CSS
                  </Typography>
                </Box>
                
                <EnhancedStylesheetSection
                  onFileUpload={setStylesheetContent}
                  onManualStyles={() => setIsTooltipVisible(!isTooltipVisible)}
                  designTokens={designTokens}
                  onDesignTokensChange={setDesignTokens}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    onClick={() => setShowStylesModal(false)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Tokens Modal */}
          {showTokensModal && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
              onClick={() => setShowTokensModal(false)}
            >
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  maxWidth: 600,
                  width: '100%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <ColorLens sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                    Design Tokens
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configure your design tokens for consistent styling across components.
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    onClick={() => setShowTokensModal(false)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Error Display */}
          <EnhancedErrorDisplay
            message={error}
            onRetry={() => setError('')}
          />
        </Box>
      </ThemeProvider>
    );
  }

  // App Lab View - "Choose Your Platform" page
  if (currentView === 'app-lab') {
    const platforms = [
      {
        title: 'Android',
        icon: <Build />,
        onClick: () => handleNavigate('android-lab'),
      },
      {
        title: 'iOS',
        icon: <Build />,
        onClick: () => handleNavigate('ios-lab'),
      },
      {
        title: 'Progressive Web App',
        icon: <Build />,
        onClick: () => handleNavigate('pwa-lab'),
      },
    ];

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0D0F18 0%, #111827 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              App Lab
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="body2"
                onClick={() => handleNavigate('landing')}
                sx={{
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
              >
                ← Back
              </Typography>
              <IconButton
                component="a"
                href="https://github.com"
                target="_blank"
                sx={{ color: 'text.secondary' }}
              >
                <GitHub />
              </IconButton>
            </Box>
          </Box>
          
          {/* Main title */}
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 8, color: 'white' }}>
            Choose Your Platform
          </Typography>
          
          {/* Platform buttons */}
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {platforms.map((platform, index) => (
              <Box
                key={platform.title}
                onClick={platform.onClick}
                sx={{
                  width: 200,
                  height: 200,
                  background: 'rgba(0, 100, 200, 0.2)',
                  borderRadius: 3,
                  border: '1px solid rgba(0, 100, 200, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(0, 100, 200, 0.3)',
                    transform: 'translateY(-8px)',
                    borderColor: '#00ff88',
                  },
                }}
              >
                <Box sx={{ mb: 2, color: 'white' }}>
                  {React.cloneElement(platform.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  {platform.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Integration Lab View
  if (currentView === 'integration-lab') {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0D0F18 0%, #111827 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Integration Lab
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="body2"
                onClick={() => handleNavigate('landing')}
                sx={{
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
              >
                ← Back
              </Typography>
              <IconButton
                component="a"
                href="https://github.com"
                target="_blank"
                sx={{ color: 'text.secondary' }}
              >
                <GitHub />
              </IconButton>
            </Box>
          </Box>
          
          {/* Main title */}
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 8, color: 'white' }}>
            Integration Lab
          </Typography>
          
          {/* Coming Soon Message */}
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 3,
              p: 4,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: 600,
            }}
          >
            <Refresh sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Advanced integration features and API management tools are under development.
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Platform-specific lab views (Android, iOS, PWA) - Redesigned
  const platformViews = ['android-lab', 'ios-lab', 'pwa-lab'];
  if (platformViews.includes(currentView)) {
    const platformNames = {
      'android-lab': 'Android',
      'ios-lab': 'iOS',
      'pwa-lab': 'Progressive Web App'
    };
    
    const platformName = platformNames[currentView];
    
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
          {/* Compact Header */}
          <Box
            sx={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'sticky',
              top: 0,
              zIndex: 1000,
            }}
          >
            <Container maxWidth="xl">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={() => handleNavigate('app-lab')}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #fff, #888)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {platformName} Lab
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Generate native {platformName.toLowerCase()} code
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 1.5, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88' }} />
                    <Typography variant="caption" sx={{ color: '#00ff88', fontSize: '0.7rem' }}>Live</Typography>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>

          <Container maxWidth="xl" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
            {/* Floating Action Bar */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5, 
              mb: 4, 
              flexWrap: 'wrap',
              justifyContent: 'center',
              '& > *': {
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.05)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }
              }
            }}>
              {/* Figma Import Button */}
              <Box
                onClick={() => setShowFigmaModal(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                {/* Figma Icon */}
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #F24E1E 0%, #FF7262 100%)',
                    borderRadius: '3px',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      width: '8px',
                      height: '8px',
                      background: 'white',
                      borderRadius: '1px',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '8px',
                      background: 'white',
                      borderRadius: '1px',
                    }
                  }} />
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '0.85rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  Import Figma
                </Typography>
              </Box>

              {/* Platform Button */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${currentView === 'android-lab' ? 'rgba(52, 211, 153, 0.2)' : currentView === 'ios-lab' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(251, 146, 60, 0.2)'}, ${currentView === 'android-lab' ? 'rgba(16, 185, 129, 0.1)' : currentView === 'ios-lab' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(245, 101, 101, 0.1)'})`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${currentView === 'android-lab' ? 'rgba(52, 211, 153, 0.1)' : currentView === 'ios-lab' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(251, 146, 60, 0.1)'}, transparent)`,
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                {/* Platform Icon */}
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Box sx={{
                    width: 20,
                    height: 20,
                    background: `linear-gradient(135deg, ${currentView === 'android-lab' ? '#34D399' : currentView === 'ios-lab' ? '#3B82F6' : '#FB923C'}, ${currentView === 'android-lab' ? '#10B981' : currentView === 'ios-lab' ? '#2563EB' : '#F97316'})`,
                    borderRadius: currentView === 'android-lab' ? '2px' : currentView === 'ios-lab' ? '50%' : '3px',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: currentView === 'android-lab' ? '12px' : currentView === 'ios-lab' ? '8px' : '10px',
                      height: currentView === 'android-lab' ? '12px' : currentView === 'ios-lab' ? '8px' : '10px',
                      background: 'white',
                      borderRadius: currentView === 'android-lab' ? '1px' : currentView === 'ios-lab' ? '50%' : '1px',
                    }
                  }} />
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '0.85rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  {platformName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
              {/* Left Panel - Compact Controls */}
              <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Image Upload Section */}
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      p: 2.5,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ p: 0.5, borderRadius: 1, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <Image sx={{ color: 'white', fontSize: 16 }} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                        Upload Images
                      </Typography>
                    </Box>
                    
                    <EnhancedFileUpload
                      onFileUpload={handleFileUpload}
                      disabled={!isJsZipLoaded}
                      accept="image/*,.zip"
                    />
                    
                    {uploadedFiles.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          {uploadedFiles.length} image{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                        </Typography>
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

                  {/* Actions Section */}
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      p: 2.5,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ p: 0.5, borderRadius: 1, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                        <Rocket sx={{ color: 'white', fontSize: 16 }} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                        Generate {platformName} Code
                      </Typography>
                    </Box>
                    
                    <EnhancedActionButtons
                      onGenerate={handleGenerateCode}
                      onPreview={handlePreview}
                      onDownload={handleDownload}
                      loading={isLoading}
                    />
                  </Box>

                  {/* Status Section */}
                  {Object.keys(workflowStatus).length > 0 && (
                    <Box
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 2.5,
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
                </Box>
              </Box>
              
              {/* Right Panel - Main Content */}
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Screen Flow */}
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      p: 2.5,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      minHeight: 300,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ p: 0.5, borderRadius: 1, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <DragIndicator sx={{ color: 'white', fontSize: 16 }} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                        Screen Flow
                      </Typography>
                      {flowOrder.length > 0 && (
                        <Box sx={{ ml: 'auto', px: 1, py: 0.5, borderRadius: 1, background: 'rgba(0, 255, 136, 0.2)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                          <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 600 }}>
                            {flowOrder.filter(Boolean).length} screens
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <EnhancedDropZone
                      onDrop={(e, index) => handleDrop(e, index)}
                      isDragOver={!!draggedItem}
                    >
                      {flowOrder.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          {flowOrder.map((file, index) => (
                            file && (
                              <Box
                                key={index}
                                sx={{
                                  width: 120,
                                  height: 120,
                                  borderRadius: 2,
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
                                    p: 0.5,
                                  }}
                                >
                                  <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem' }}>
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
                                    top: 4,
                                    right: 4,
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    width: 20,
                                    height: 20,
                                    '&:hover': { 
                                      backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <Close sx={{ fontSize: 12 }} />
                                </IconButton>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    left: 4,
                                    px: 0.5,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                    background: 'rgba(0, 255, 136, 0.9)',
                                    color: 'black',
                                    fontSize: '0.6rem',
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
                            py: 6,
                            border: '2px dashed rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.02)',
                          }}
                        >
                          <DragIndicator sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Arrange Your Screens
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Drag images from the tray to create your screen flow
                          </Typography>
                        </Box>
                      )}
                    </EnhancedDropZone>
                  </Box>
                  
                  {/* Generated Code Preview */}
                  {Object.keys(generatedFiles).length > 0 && (
                    <Box
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        p: 2.5,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 0.5, borderRadius: 1, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
                          <Code sx={{ color: 'white', fontSize: 16 }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                          Generated {platformName} Code Preview
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

          {/* Figma Import Modal */}
          {showFigmaModal && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
              onClick={() => setShowFigmaModal(false)}
            >
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  maxWidth: 500,
                  width: '100%',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <Box sx={{ width: 20, height: 20, background: 'white', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 700, fontSize: '0.7rem' }}>F</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                    Import from Figma
                  </Typography>
                </Box>
                
                <EnhancedFigmaInput
                  value={figmaUrl}
                  onChange={setFigmaUrl}
                  onImport={() => {
                    handleFigmaImport();
                    setShowFigmaModal(false);
                  }}
                  loading={isLoading}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    onClick={() => setShowFigmaModal(false)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Error Display */}
          <EnhancedErrorDisplay
            message={error}
            onRetry={() => setError('')}
          />
        </Box>
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
