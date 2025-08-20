import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Divider, IconButton } from '@mui/material';
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
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <EnhancedHeader
          onBack={() => handleNavigate('landing')}
          title="Design to Code"
          subtitle="Transform your designs into production-ready React components"
        />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Left Panel - Controls */}
          <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Import Section */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  IMPORT
                </Typography>
                <EnhancedFigmaInput
                  value={figmaUrl}
                  onChange={setFigmaUrl}
                  onImport={handleFigmaImport}
                  loading={isLoading}
                />
              </Box>
              
              <Divider />
              
              {/* Stylesheet Section */}
              <EnhancedStylesheetSection
                onFileUpload={setStylesheetContent}
                onManualStyles={() => setIsTooltipVisible(!isTooltipVisible)}
                designTokens={designTokens}
                onDesignTokensChange={setDesignTokens}
              />
              
              <Divider />
              
              {/* Image Tray */}
              <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  IMAGE TRAY
                </Typography>
                
                <EnhancedFileUpload
                  onFileUpload={handleFileUpload}
                  disabled={!isJsZipLoaded}
                  accept="image/*,.zip"
                />
                
                {uploadedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
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
          
          {/* Right Panel - Main Content */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Screen Flow */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  SCREEN FLOW
                </Typography>
                
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
                              border: '2px solid #374151',
                              position: 'relative',
                            }}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
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
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
                              }}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Box>
                        )
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Drag images from the tray to order your screens here.
                    </Typography>
                  )}
                </EnhancedDropZone>
              </Box>
              
              {/* Actions */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  ACTIONS
                </Typography>
                
                <EnhancedActionButtons
                  onGenerate={handleGenerateCode}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  loading={isLoading}
                />
              </Box>
              
              {/* Workflow Status */}
              {Object.keys(workflowStatus).length > 0 && (
                <EnhancedWorkflowStatus
                  status={workflowStatus}
                  error={error}
                />
              )}
              
              {/* Error Display */}
              <EnhancedErrorDisplay
                message={error}
                onRetry={() => setError('')}
              />
              
              {/* Generated Code Preview */}
              {Object.keys(generatedFiles).length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    GENERATED CODE PREVIEW
                  </Typography>
                  
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
    </ThemeProvider>
  );
};

export default AppEnhanced; 