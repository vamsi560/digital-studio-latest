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
  Badge
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
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdvancedReactPreview from './advanced-react-preview';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease'
  }
}));

const UploadArea = styled(Box)(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.3)'}`,
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: isDragOver ? 'rgba(25, 118, 210, 0.1)' : 'rgba(255, 255, 255, 0.05)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    background: 'rgba(25, 118, 210, 0.1)'
  }
}));

const FlowSlot = styled(Box)(({ theme, hasImage }) => ({
  width: 140,
  height: 140,
  border: `2px dashed ${hasImage ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: hasImage ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    background: 'rgba(25, 118, 210, 0.1)'
  }
}));

const ImageThumbnail = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  border: '2px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 8,
  cursor: 'grab',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'scale(1.05)'
  },
  '&:active': {
    cursor: 'grabbing'
  }
}));

const WorkflowStep = styled(Box)(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 8,
  transition: 'all 0.3s ease',
  background: status === 'completed' ? 'rgba(76, 175, 80, 0.2)' : 
              status === 'running' ? 'rgba(25, 118, 210, 0.2)' : 
              'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${status === 'completed' ? 'rgba(76, 175, 80, 0.3)' : 
                      status === 'running' ? 'rgba(25, 118, 210, 0.3)' : 
                      'rgba(255, 255, 255, 0.1)'}`
}));

const EnhancedPrototypeView = ({ onNavigate, isJsZipLoaded }) => {
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

  const workflowSteps = [
    { id: 'architect', name: 'Architect', description: 'Analyzing project structure...', icon: <Architecture /> },
    { id: 'builder', name: 'Component Builder', description: 'Creating reusable components...', icon: <Build /> },
    { id: 'composer', name: 'Page Composer', description: 'Assembling pages...', icon: <Assignment /> },
    { id: 'finisher', name: 'Finisher & QA', description: 'Finalizing app and checking quality...', icon: <VerifiedUser /> }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        background: 'rgba(26, 26, 46, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        py: 2
      }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => onNavigate('landing')}
            sx={{ 
              color: 'white', 
              '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Back
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 600, flex: 1 }}>
            Prototype Lab
          </Typography>
          <Chip 
            label="Professional Mode" 
            color="primary" 
            size="small"
            icon={<Code />}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Figma Import */}
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Link color="primary" />
                    Figma Import
                  </Typography>
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
                            color="primary"
                          >
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      }
                    }}
                  />
                </CardContent>
              </StyledCard>

              {/* Stylesheet */}
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Style color="primary" />
                    Stylesheet
                  </Typography>
                  <Accordion sx={{ background: 'transparent', color: 'white' }}>
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
                      <Typography>Design Tokens</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          size="small"
                          label="Primary Color"
                          type="color"
                          defaultValue="#4A90E2"
                          sx={{ '& .MuiInputBase-input': { height: 40 } }}
                        />
                        <TextField
                          size="small"
                          label="Font Family"
                          placeholder="e.g., 'Inter', sans-serif"
                        />
                        <TextField
                          size="small"
                          label="Border Radius (px)"
                          type="number"
                          placeholder="8"
                        />
                        <Button variant="contained" size="small">
                          Apply Tokens
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </StyledCard>

              {/* Image Tray */}
              <StyledCard sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Image color="primary" />
                    Image Tray
                  </Typography>
                  
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
                  >
                    <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Upload Screens
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Drag & drop or click to upload PNG, JPG, or ZIP
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

                  <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                    <Grid container spacing={1}>
                      {uploadedFiles.map((file, index) => (
                        <Grid item key={index}>
                          <ImageThumbnail
                            draggable
                            onDragStart={(e) => handleDragStart(e, file)}
                          >
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </ImageThumbnail>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Screen Flow */}
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DragIndicator color="primary" />
                    Screen Flow
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2, 
                    minHeight: 200,
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 2
                  }}>
                    {flowOrder.length === 0 ? (
                      <Box sx={{ 
                        width: '100%', 
                        textAlign: 'center', 
                        py: 4,
                        color: 'text.secondary'
                      }}>
                        <DragIndicator sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                        <Typography>Drag images from the tray to order your screens here</Typography>
                      </Box>
                    ) : (
                      flowOrder.map((file, index) => (
                        <FlowSlot
                          key={index}
                          hasImage={!!file}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, index)}
                          onClick={() => file && setImagePreview(URL.createObjectURL(file))}
                        >
                          {file ? (
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                            />
                          ) : (
                            <Typography variant="h4" color="text.secondary">
                              {index + 1}
                            </Typography>
                          )}
                        </FlowSlot>
                      ))
                    )}
                  </Box>
                </CardContent>
              </StyledCard>

              {/* Actions */}
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Settings color="primary" />
                    Actions
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<Build />}
                      onClick={handleGenerateCode}
                      disabled={isLoading || flowOrder.some(f => f === null)}
                      sx={{ minWidth: 150 }}
                    >
                      Generate Code
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Preview />}
                      onClick={handlePreview}
                      disabled={Object.keys(generatedFiles).length === 0}
                      sx={{ minWidth: 120 }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<GetApp />}
                      onClick={handleDownload}
                      disabled={Object.keys(generatedFiles).length === 0 || !isJsZipLoaded}
                      sx={{ minWidth: 150 }}
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>

              {/* Workflow Status */}
              {isLoading && (
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Generation Progress
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        variant="indeterminate" 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <List>
                      {workflowSteps.map((step) => {
                        const status = workflowStatus[step.id] || 'pending';
                        return (
                          <ListItem key={step.id} sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32,
                                  bgcolor: status === 'completed' ? 'success.main' : 
                                          status === 'running' ? 'primary.main' : 
                                          'rgba(255, 255, 255, 0.2)'
                                }}
                              >
                                {status === 'completed' ? <CheckCircle /> : 
                                 status === 'running' ? <HourglassEmpty /> : 
                                 step.icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={step.name}
                              secondary={status === 'running' ? workflowStatus.text : 
                                        status === 'completed' ? 'Completed' : 'Pending'}
                              primaryTypographyProps={{ 
                                color: status === 'pending' ? 'text.secondary' : 'white' 
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </CardContent>
                </StyledCard>
              )}

              {/* Generated Code */}
              {Object.keys(generatedFiles).length > 0 && !isLoading && (
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
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
                      <Box sx={{ mb: 3, p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
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
                      overflow: 'auto'
                    }}>
                      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
                </StyledCard>
              )}
            </Box>
          </Grid>
        </Grid>
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
            <Box sx={{ display: 'flex', gap: 1 }}>
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