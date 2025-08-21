import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
  Fab,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  InputAdornment,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fade,
  Zoom,
  Slide,
  Grow,
  ListItemButton,
  Collapse
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  DragIndicator,
  PlayArrow,
  Download,
  Preview,
  Code,
  Palette,
  Settings,
  CheckCircle,
  Error,
  HourglassEmpty,
  FileUpload,
  Link,
  Add,
  Remove,
  ExpandMore,
  Refresh,
  Visibility,
  GetApp,
  Build,
  Architecture,
  Assignment,
  VerifiedUser,
  FolderOpen,
  Image,
  Style,
  ColorLens,
  FormatSize,
  BorderRadius,
  Close,
  GridView,
  Timeline,
  Speed,
  Rocket,
  AutoAwesome,
  Psychology,
  Layers,
  Widgets,
  ViewInAr,
  SmartToy,
  Storage,
  TrendingUp,
  Menu as MenuIcon,
  Brush,
  Bolt
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdvancedReactPreview from './advanced-react-preview';

// Custom styled components
const SidebarSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .section-header': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
}));

const SidebarOption = styled(ListItemButton)(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  background: selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
  color: selected ? 'white' : 'rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(4px)'
  },
  '& .MuiListItemIcon-root': {
    color: selected ? 'white' : 'rgba(255, 255, 255, 0.6)',
    minWidth: 36
  }
}));

const UploadArea = styled(Box)(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.2)'}`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(8, 4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: isDragOver ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.02)',
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    background: 'rgba(102, 126, 234, 0.05)'
  }
}));

const EnhancedPrototypeView = ({ onNavigate, isJsZipLoaded }) => {
  // Existing state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [flowOrder, setFlowOrder] = useState([]);
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState({});
  const [projectName, setProjectName] = useState('react-project');
  const [draggedItem, setDraggedItem] = useState(null);
  const [stylesheetContent, setStylesheetContent] = useState('');
  const [designTokens, setDesignTokens] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [accuracyResult, setAccuracyResult] = useState(null);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // New state for the enhanced UI
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [selectedStyling, setSelectedStyling] = useState('tailwind');
  const [selectedArchitecture, setSelectedArchitecture] = useState('component-based');
  const [selectedImportSource, setSelectedImportSource] = useState('figma');
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);

  // Framework options
  const frameworks = [
    { id: 'react', name: 'React', icon: <Code />, color: '#61DAFB' },
    { id: 'vue', name: 'Vue.js', icon: <Code />, color: '#4FC08D' },
    { id: 'angular', name: 'Angular', icon: <Code />, color: '#DD0031' },
    { id: 'svelte', name: 'Svelte', icon: <Code />, color: '#FF3E00' }
  ];

  // Styling options
  const stylingOptions = [
    { id: 'tailwind', name: 'Tailwind CSS', icon: <Palette /> },
    { id: 'styled-components', name: 'Styled Components', icon: <Style /> },
    { id: 'pure-css', name: 'Pure CSS', icon: <Brush /> },
    { id: 'scss', name: 'SCSS', icon: <ColorLens /> }
  ];

  // Architecture options
  const architectureOptions = [
    { id: 'component-based', name: 'Component-based', icon: <Widgets />, color: '#4CAF50' },
    { id: 'modular', name: 'Modular', icon: <Layers /> },
    { id: 'atomic-design', name: 'Atomic Design', icon: <Architecture /> },
    { id: 'mvc-pattern', name: 'MVC Pattern', icon: <Build /> }
  ];

  // Import sources
  const importSources = [
    { id: 'figma', name: 'Figma', icon: <Link /> },
    { id: 'sketch', name: 'Sketch', icon: <Image /> },
    { id: 'adobe-xd', name: 'Adobe XD', icon: <Image /> }
  ];

  // Existing functions
  const handleFileUpload = useCallback(async (files) => {
    if (!isJsZipLoaded) {
      setSnackbar({ open: true, message: "Zip library not loaded yet. Please wait.", severity: 'warning' });
      return;
    }
    const newFiles = [];
    for (const file of files) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        const zip = await window.JSZip.loadAsync(file);
        for (const filename in zip.files) {
          if (/\.(jpe?g|png)$/i.test(filename) && !zip.files[filename].dir) {
            const imageFile = await zip.files[filename].async('blob');
            const properFile = new File([imageFile], filename, { type: imageFile.type });
            newFiles.push(properFile);
          }
        }
      } else if (file.type.startsWith('image/')) {
        newFiles.push(file);
      }
    }
    const combinedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(combinedFiles);
    // Initialize flow order with the correct number of slots
    setFlowOrder(new Array(combinedFiles.length).fill(null));
    setSnackbar({ open: true, message: `${newFiles.length} images uploaded successfully!`, severity: 'success' });
  }, [uploadedFiles, isJsZipLoaded]);

  const handleDragStart = (e, file) => setDraggedItem(file);
  
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (!draggedItem) return;
    const newFlowOrder = [...flowOrder];
    newFlowOrder[index] = draggedItem;
    setFlowOrder(newFlowOrder);
    setUploadedFiles(uploadedFiles.filter(f => f !== draggedItem));
    setDraggedItem(null);
  };

  const handleFigmaImport = async () => {
    if (!figmaUrl) return;
    setIsLoading(true);
    setError('');
    setWorkflowStatus({ text: 'Importing from Figma...', architect: 'running' });
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
      setSnackbar({ open: true, message: `Figma import failed: ${error.message}`, severity: 'error' });
    } finally {
      setIsLoading(false);
      setWorkflowStatus({});
    }
  };

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
    
    // Add new configuration options
    formData.append('framework', selectedFramework);
    formData.append('styling', selectedStyling);
    formData.append('architecture', selectedArchitecture);

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
      setSnackbar({ open: true, message: 'Code generated successfully!', severity: 'success' });
      setShowGeneratedCode(true);

    } catch (error) {
      console.error('Error generating code:', error);
      setError(error.message);
      setWorkflowStatus({ text: `Error: ${error.message}`, architect: 'completed', builder: 'completed', composer: 'completed', finisher: 'error' });
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!isJsZipLoaded) {
      setSnackbar({ open: true, message: "Zip library not loaded yet. Please wait.", severity: 'warning' });
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
    setSnackbar({ open: true, message: 'Project downloaded successfully!', severity: 'success' });
  };

  const handlePreview = async () => {
    setIsPreviewing(true);

    if (!window.WebContainer) {
      setError("Error: WebContainer API is not available. Preview cannot be started.");
      setIsPreviewing(false);
      setSnackbar({ open: true, message: "WebContainer API is not available", severity: 'error' });
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
      setSnackbar({ open: true, message: "Failed to start preview environment", severity: 'error' });
    }
  };

  useEffect(() => {
    if (generatedFiles && Object.keys(generatedFiles).length > 0) {
      const mainFile = Object.keys(generatedFiles).find(f => f.endsWith('App.jsx') || f.endsWith('App.js') || f.endsWith('App.tsx'));
      if (mainFile) setPreviewCode(generatedFiles[mainFile]);
    }
  }, [generatedFiles]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <AppBar position="static" sx={{ 
        background: 'rgba(26, 26, 46, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '8px 16px',
              borderRadius: 2
            }}>
              <Bolt sx={{ color: 'white' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Digital Studio
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Design to Code Platform
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Bolt />}
              onClick={handleGenerateCode}
              disabled={isLoading || flowOrder.some(f => f === null)}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
              }}
            >
              Generate Code
            </Button>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handlePreview}
              disabled={Object.keys(generatedFiles).length === 0}
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': { borderColor: 'white', background: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={handleDownload}
              disabled={Object.keys(generatedFiles).length === 0 || !isJsZipLoaded}
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': { borderColor: 'white', background: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Download
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar */}
        <Box sx={{ 
          width: 320, 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 3,
          overflowY: 'auto'
        }}>
          {/* Framework Section */}
          <SidebarSection>
            <div className="section-header">
              <Code />
              Framework
            </div>
            <List dense>
              {frameworks.map((framework) => (
                <ListItem key={framework.id} disablePadding>
                  <SidebarOption
                    selected={selectedFramework === framework.id}
                    onClick={() => setSelectedFramework(framework.id)}
                  >
                    <ListItemIcon>
                      {framework.icon}
                    </ListItemIcon>
                    <ListItemText primary={framework.name} />
                  </SidebarOption>
                </ListItem>
              ))}
            </List>
          </SidebarSection>

          {/* Styling Section */}
          <SidebarSection>
            <div className="section-header">
              <Palette />
              Styling
            </div>
            <List dense>
              {stylingOptions.map((option) => (
                <ListItem key={option.id} disablePadding>
                  <SidebarOption
                    selected={selectedStyling === option.id}
                    onClick={() => setSelectedStyling(option.id)}
                  >
                    <ListItemIcon>
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText primary={option.name} />
                  </SidebarOption>
                </ListItem>
              ))}
            </List>
          </SidebarSection>

          {/* Architecture Section */}
          <SidebarSection>
            <div className="section-header">
              <Architecture />
              Architecture
            </div>
            <List dense>
              {architectureOptions.map((option) => (
                <ListItem key={option.id} disablePadding>
                  <SidebarOption
                    selected={selectedArchitecture === option.id}
                    onClick={() => setSelectedArchitecture(option.id)}
                  >
                    <ListItemIcon>
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText primary={option.name} />
                  </SidebarOption>
                </ListItem>
              ))}
            </List>
          </SidebarSection>

          {/* Import From Section */}
          <SidebarSection>
            <div className="section-header">
              <Settings />
              Import From
            </div>
            <List dense>
              {importSources.map((source) => (
                <ListItem key={source.id} disablePadding>
                  <SidebarOption
                    selected={selectedImportSource === source.id}
                    onClick={() => setSelectedImportSource(source.id)}
                  >
                    <ListItemIcon>
                      {source.icon}
                    </ListItemIcon>
                    <ListItemText primary={source.name} />
                  </SidebarOption>
                </ListItem>
              ))}
            </List>
          </SidebarSection>

          {/* Figma Import */}
          {selectedImportSource === 'figma' && (
            <SidebarSection>
              <div className="section-header">
                <Link />
                Figma Import
              </div>
              <TextField
                fullWidth
                size="small"
                placeholder="Paste Figma URL..."
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleFigmaImport}
                        disabled={!figmaUrl}
                        size="small"
                      >
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                  }
                }}
              />
            </SidebarSection>
          )}

          {/* Project Name */}
          <SidebarSection>
            <div className="section-header">
              <FolderOpen />
              Project Settings
            </div>
            <TextField
              fullWidth
              size="small"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                }
              }}
            />
          </SidebarSection>

          {/* Image Tray */}
          <SidebarSection>
            <div className="section-header">
              <Image />
              Image Tray
            </div>
            
            {/* Upload Button */}
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': { borderColor: 'white', background: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Upload Images
                <input
                  type="file"
                  multiple
                  accept="image/*,.zip"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                />
              </Button>
            </Box>

            {/* Uploaded Images Grid */}
            <Box sx={{ 
              maxHeight: 300, 
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1
            }}>
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, index) => (
                  <Box
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, file)}
                    sx={{
                      width: 60,
                      height: 60,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      cursor: 'grab',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'scale(1.05)'
                      },
                      '&:active': {
                        cursor: 'grabbing'
                      }
                    }}
                  >
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        cursor: 'grab'
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  py: 2,
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}>
                  No images uploaded yet
                </Box>
              )}
            </Box>

            {/* Instructions */}
            {uploadedFiles.length > 0 && (
              <Typography variant="caption" sx={{ 
                display: 'block', 
                mt: 1, 
                color: 'text.secondary',
                textAlign: 'center'
              }}>
                Drag images to the screen flow area
              </Typography>
            )}
          </SidebarSection>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, padding: 4, overflowY: 'auto' }}>
          {!showGeneratedCode ? (
            /* Screen Flow and Upload Area */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Screen Flow */}
              <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timeline sx={{ color: 'primary.main' }} />
                    Screen Flow
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2, 
                    minHeight: 200,
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 2,
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    {uploadedFiles.length === 0 ? (
                      <Box sx={{ 
                        width: '100%', 
                        textAlign: 'center', 
                        py: 4,
                        color: 'text.secondary'
                      }}>
                        <DragIndicator sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                        <Typography>Upload images first, then drag them here to order your screens</Typography>
                      </Box>
                    ) : (
                      // Show slots based on uploaded files
                      Array.from({ length: uploadedFiles.length }, (_, index) => (
                        <Box
                          key={index}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, index)}
                          onClick={() => flowOrder[index] && setImagePreview(URL.createObjectURL(flowOrder[index]))}
                          sx={{
                            width: 120,
                            height: 120,
                            border: `2px dashed ${flowOrder[index] ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: flowOrder[index] ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                            position: 'relative',
                            '&:hover': {
                              borderColor: 'primary.main',
                              background: 'rgba(25, 118, 210, 0.1)'
                            }
                          }}
                        >
                          {flowOrder[index] ? (
                            <>
                              <img 
                                src={URL.createObjectURL(flowOrder[index])} 
                                alt={flowOrder[index].name} 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  borderRadius: 8
                                }}
                              />
                              <Chip 
                                label={index + 1} 
                                size="small" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: -8, 
                                  right: -8,
                                  background: 'primary.main'
                                }} 
                              />
                            </>
                          ) : (
                            <Typography variant="h4" color="text.secondary">
                              {index + 1}
                            </Typography>
                          )}
                        </Box>
                      ))
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Upload Area - Only show if no images uploaded */}
              {uploadedFiles.length === 0 && (
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <UploadArea
                      isDragOver={isDragOver}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const files = Array.from(e.dataTransfer.files);
                        handleFileUpload(files);
                      }}
                      onClick={() => document.getElementById('file-upload').click()}
                      sx={{ minHeight: 300 }}
                    >
                      <CloudUpload sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                        Upload Your Designs
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
                        Drag & drop your screen designs or click to browse
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Supports JPG, PNG, SVG, WebP
                      </Typography>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.zip"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                      />
                    </UploadArea>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              {uploadedFiles.length > 0 && (
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Settings sx={{ color: 'primary.main' }} />
                      Actions
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<Bolt />}
                        onClick={handleGenerateCode}
                        disabled={isLoading || flowOrder.some(f => f === null)}
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
                        }}
                      >
                        Generate Code
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={handlePreview}
                        disabled={Object.keys(generatedFiles).length === 0}
                        sx={{ 
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': { borderColor: 'white', background: 'rgba(255, 255, 255, 0.1)' }
                        }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<GetApp />}
                        onClick={handleDownload}
                        disabled={Object.keys(generatedFiles).length === 0 || !isJsZipLoaded}
                        sx={{ 
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': { borderColor: 'white', background: 'rgba(255, 255, 255, 0.1)' }
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          ) : (
            /* Generated Code Display */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Workflow Status */}
              {isLoading && (
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Speed sx={{ color: 'primary.main' }} />
                      Generation Progress
                    </Typography>
                    <LinearProgress 
                      variant="indeterminate" 
                      sx={{ height: 8, borderRadius: 4, mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {workflowStatus.text || 'Processing...'}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Generated Code */}
              {Object.keys(generatedFiles).length > 0 && !isLoading && (
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Code sx={{ color: 'primary.main' }} />
                      Generated Code
                    </Typography>
                    
                    {/* Live React Preview */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Live React Preview
                      </Typography>
                      <AdvancedReactPreview code={previewCode} showAnalysis={true} />
                    </Box>

                    {/* Accuracy Result */}
                    {accuracyResult && (
                      <Box sx={{ 
                        mb: 3, 
                        p: 2, 
                        background: 'rgba(76, 175, 80, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(76, 175, 80, 0.2)'
                      }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Estimated Accuracy
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h4" color="success.main" fontWeight="bold">
                            {accuracyResult.score}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {accuracyResult.justification}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Code Display */}
                    <Paper sx={{ 
                      background: '#1e1e1e', 
                      color: '#d4d4d4',
                      maxHeight: 400,
                      overflow: 'auto',
                      borderRadius: 2
                    }}>
                      <Box sx={{ 
                        p: 2, 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Storage sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle2">Generated Files</Typography>
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <pre style={{ margin: 0, fontSize: '12px' }}>
                          <code>
                            {Object.entries(generatedFiles).map(([path, code]) => 
                              `// --- FILENAME: ${path} ---\n${code}`
                            ).join('\n\n')}
                          </code>
                        </pre>
                      </Box>
                    </Paper>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!imagePreview}
        onClose={() => setImagePreview(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Image Preview</Typography>
            <IconButton onClick={() => setImagePreview(null)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <img 
            src={imagePreview} 
            alt="Preview" 
            style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={isPreviewing}
        onClose={() => setIsPreviewing(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{ sx: { height: '90vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Live Preview</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {loadingText || 'Live Preview'}
              </Typography>
              <IconButton onClick={() => setIsPreviewing(false)}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <iframe 
            src={previewUrl || 'about:blank'} 
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              background: 'white'
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedPrototypeView; 