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
  Grow
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
  FullscreenExit,
  Dashboard,
  ViewModule,
  ViewList,
  GridView,
  Timeline,
  Speed,
  Rocket,
  Lightbulb,
  AutoAwesome,
  Psychology,
  Brush,
  PaletteOutlined,
  Layers,
  Widgets,
  ViewInAr,
  SmartToy,
  Memory,
  Storage,
  Cloud,
  Security,
  BugReport,
  Analytics,
  Assessment,
  TrendingUp,
  Check,
  Warning,
  Info,
  Star,
  Favorite,
  ThumbUp,
  ThumbDown,
  Share,
  MoreVert,
  Menu as MenuIcon,
  Home,
  Work,
  School,
  Business,
  Person,
  Group,
  Public,
  Language,
  Translate,
  Accessibility,
  Hearing,
  Visibility as VisibilityIcon,
  VisibilityOff,
  Brightness4,
  Brightness7,
  Notifications,
  AccountCircle,
  Search,
  FilterList,
  Sort,
  Tune,
  ViewColumn,
  ViewWeek,
  ViewDay,
  Schedule,
  Event,
  CalendarToday,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  Chat,
  Forum,
  Message,
  Send,
  Reply,
  Forward,
  Archive,
  Delete,
  Edit,
  Create,
  Save,
  Cancel,
  Undo,
  Redo,
  ContentCopy,
  ContentCut,
  ContentPaste,
  Print,
  PictureAsPdf,
  Description,
  Article,
  Book,
  LibraryBooks,
  MenuBook,
  Newspaper,
  Web,
  Computer,
  Laptop,
  Tablet,
  PhoneAndroid,
  PhoneIphone,
  Watch,
  Headphones,
  Speaker,
  Mic,
  Videocam,
  PhotoCamera,
  CameraAlt,
  CameraRoll,
  PhotoLibrary,
  Collections,
  Album,
  Slideshow,
  Movie,
  VideoLibrary,
  MusicNote,
  Audiotrack,
  QueueMusic,
  PlaylistPlay,
  Radio,
  Podcasts,
  LiveTv,
  Tv,
  Monitor,
  DisplaySettings,
  ScreenShare,
  Cast,
  Airplay,
  Bluetooth,
  Wifi,
  SignalCellular4Bar,
  SignalWifi4Bar,
  BatteryFull,
  BatteryChargingFull,
  Power,
  PowerSettingsNew,
  RestartAlt,
  Shutdown,
  Lock,
  LockOpen,
  VpnKey,
  Key,
  Fingerprint,
  Face,
  FaceRetouchingNatural,
  AutoFixHigh,
  AutoFixNormal,
  AutoFixOff,
  FilterCenterFocus,
  CenterFocusStrong,
  CenterFocusWeak,
  Crop,
  CropFree,
  CropSquare,
  CropPortrait,
  CropLandscape,
  CropRotate,
  CropDin,
  Transform,
  Straighten,
  RotateLeft,
  RotateRight,
  Flip,
  FlipCameraAndroid,
  FlipCameraIos,
  GridOn,
  GridOff,
  ViewComfy,
  ViewCompact,
  ViewHeadline,
  ViewQuilt,
  ViewStream,
  ViewAgenda,
  ViewCarousel,
  ViewDay,
  ViewWeek,
  ViewModule,
  ViewList,
  ViewTimeline,
  Timeline,
  Schedule,
  Event,
  EventAvailable,
  EventBusy,
  EventNote,
  Today,
  DateRange,
  CalendarMonth,
  CalendarToday,
  CalendarViewDay,
  CalendarViewWeek,
  CalendarViewMonth,
  AccessTime,
  AccessTimeFilled,
  Alarm,
  AlarmOn,
  AlarmOff,
  AlarmAdd,
  Timer,
  TimerOff,
  Timer10,
  Timer3,
  HourglassEmpty,
  HourglassFull,
  HourglassBottom,
  HourglassTop,
  WatchLater,
  Update,
  UpdateDisabled,
  History,
  HistoryEdu,
  HistoryToggleOff,
  WorkHistory,
  Work,
  WorkOff,
  WorkOutline,
  Business,
  BusinessCenter,
  Domain,
  DomainDisabled,
  LocationCity,
  LocationOn,
  LocationOff,
  LocationSearching,
  LocationDisabled,
  MyLocation,
  Place,
  LocalShipping,
  LocalTaxi,
  LocalBus,
  LocalTrain,
  LocalSubway,
  LocalTram,
  LocalAirport,
  LocalHotel,
  LocalHospital,
  LocalPharmacy,
  LocalGasStation,
  LocalCarWash,
  LocalLaundryService,
  LocalDining,
  LocalBar,
  LocalCafe,
  LocalPizza,
  LocalConvenienceStore,
  LocalGroceryStore,
  LocalMall,
  LocalMovies,
  LocalTheater,
  LocalLibrary,
  LocalSchool,
  LocalUniversity,
  LocalParking,
  LocalAtm,
  LocalPostOffice,
  LocalPolice,
  LocalFireDepartment,
  LocalAmbulance,
  LocalFlorist,
  LocalPrintshop,
  LocalSee,
  LocalOffer,
  LocalActivity,
  LocalPlay,
  LocalDrink
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdvancedReactPreview from './advanced-react-preview';

// Custom styled components with new design patterns
const FloatingActionPanel = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

const IconCard = styled(Card)(({ theme, active }) => ({
  background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.05)',
  border: `2px solid ${active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
  borderRadius: 20,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: 'blur(20px)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.4)'
  }
}));

const HexagonalUploadArea = styled(Box)(({ theme, isDragOver }) => ({
  width: 200,
  height: 200,
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDragOver ? 
      'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd)' :
      'linear-gradient(45deg, #667eea, #764ba2)',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    animation: isDragOver ? 'rotate 2s linear infinite' : 'none',
    zIndex: -1
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    background: 'rgba(26, 26, 46, 0.9)',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    zIndex: -1
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
}));

const CircularProgressRing = styled(Box)(({ theme, progress }) => ({
  width: 120,
  height: 120,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    background: `conic-gradient(from 0deg, #667eea ${progress * 3.6}deg, rgba(255, 255, 255, 0.1) ${progress * 3.6}deg)`,
    animation: 'spin 2s linear infinite'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: '50%',
    background: 'rgba(26, 26, 46, 0.9)'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
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
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showSidebar, setShowSidebar] = useState(false);

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
    { id: 'architect', name: 'Architect', description: 'Analyzing project structure...', icon: <Psychology /> },
    { id: 'builder', name: 'Component Builder', description: 'Creating reusable components...', icon: <Widgets /> },
    { id: 'composer', name: 'Page Composer', description: 'Assembling pages...', icon: <Layers /> },
    { id: 'finisher', name: 'Finisher & QA', description: 'Finalizing app and checking quality...', icon: <AutoAwesome /> }
  ];

  const actionButtons = [
    { icon: <Rocket />, label: 'Generate', action: handleGenerateCode, disabled: isLoading || flowOrder.some(f => f === null), color: 'primary' },
    { icon: <Visibility />, label: 'Preview', action: handlePreview, disabled: Object.keys(generatedFiles).length === 0, color: 'secondary' },
    { icon: <GetApp />, label: 'Download', action: handleDownload, disabled: Object.keys(generatedFiles).length === 0 || !isJsZipLoaded, color: 'success' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>

      {/* Header */}
      <AppBar position="sticky" sx={{ 
        background: 'rgba(26, 26, 46, 0.8)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => onNavigate('landing')}
            sx={{ color: 'white', mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <AutoAwesome sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Prototype Lab
            </Typography>
            <Chip 
              label="AI-Powered" 
              size="small"
              icon={<SmartToy />}
              sx={{ ml: 1 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <ViewList /> : <GridView />}
            </IconButton>
            <IconButton onClick={() => setShowSidebar(!showSidebar)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Grid container spacing={3}>
          
          {/* Left Sidebar - Collapsible */}
          <Grid item xs={12} lg={showSidebar ? 3 : 0}>
            <Slide direction="right" in={showSidebar} mountOnEnter unmountOnExit>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* Figma Import */}
                <IconCard>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Link sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Import from Figma
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Figma URL..."
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
                  </CardContent>
                </IconCard>

                {/* Design Tokens */}
                <IconCard>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Palette sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Design System
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'primary.main' }}>
                        <ColorLens />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'primary.main' }}>
                        <FormatSize />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'primary.main' }}>
                        <BorderRadius />
                      </IconButton>
                    </Box>
                  </CardContent>
                </IconCard>

                {/* Upload Area */}
                <IconCard>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <HexagonalUploadArea
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
                      <Box sx={{ 
                        position: 'relative', 
                        zIndex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        color: 'white'
                      }}>
                        <CloudUpload sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                          Upload Screens
                        </Typography>
                      </Box>
                    </HexagonalUploadArea>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.zip"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                    />
                  </CardContent>
                </IconCard>

                {/* Image Tray */}
                <IconCard>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Image sx={{ color: 'primary.main' }} />
                      <Typography variant="body2">Image Tray</Typography>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: 200, 
                      overflowY: 'auto',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 1
                    }}>
                      {uploadedFiles.map((file, index) => (
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
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={file.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </IconCard>
              </Box>
            </Slide>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} lg={showSidebar ? 9 : 12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Project Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FolderOpen sx={{ color: 'primary.main' }} />
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
              </Box>

              {/* Screen Flow */}
              <IconCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Timeline sx={{ color: 'primary.main' }} />
                    <Typography variant="h6">Screen Flow</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2, 
                    minHeight: 200,
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 3,
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    {flowOrder.length === 0 ? (
                      <Box sx={{ 
                        width: '100%', 
                        textAlign: 'center', 
                        py: 4,
                        color: 'text.secondary'
                      }}>
                        <DragIndicator sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                        <Typography>Drag images here to create your flow</Typography>
                      </Box>
                    ) : (
                      flowOrder.map((file, index) => (
                        <Box
                          key={index}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, index)}
                          onClick={() => file && setImagePreview(URL.createObjectURL(file))}
                          sx={{
                            width: 120,
                            height: 120,
                            border: `2px dashed ${file ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: file ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                            position: 'relative',
                            '&:hover': {
                              borderColor: 'primary.main',
                              background: 'rgba(25, 118, 210, 0.1)'
                            }
                          }}
                        >
                          {file ? (
                            <>
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
              </IconCard>

              {/* Workflow Status */}
              {isLoading && (
                <IconCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Speed sx={{ color: 'primary.main' }} />
                      <Typography variant="h6">Generation Progress</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <CircularProgressRing progress={75} />
                    </Box>
                    
                    <Stepper orientation="vertical" sx={{ '& .MuiStepLabel-root': { color: 'white' } }}>
                      {workflowSteps.map((step) => {
                        const status = workflowStatus[step.id] || 'pending';
                        return (
                          <Step key={step.id} active={status === 'running'} completed={status === 'completed'}>
                            <StepLabel 
                              icon={status === 'completed' ? <CheckCircle color="success" /> : 
                                    status === 'running' ? <HourglassEmpty color="primary" /> : 
                                    step.icon}
                            >
                              {step.name}
                            </StepLabel>
                            <StepContent>
                              <Typography variant="body2" color="text.secondary">
                                {status === 'running' ? workflowStatus.text : 
                                 status === 'completed' ? 'Completed successfully' : 'Waiting to start'}
                              </Typography>
                            </StepContent>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </CardContent>
                </IconCard>
              )}

              {/* Generated Code */}
              {Object.keys(generatedFiles).length > 0 && !isLoading && (
                <IconCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Code sx={{ color: 'primary.main' }} />
                      <Typography variant="h6">Generated Code</Typography>
                    </Box>
                    
                    {/* Live React Preview */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ViewInAr sx={{ color: 'secondary.main' }} />
                        <Typography variant="subtitle1">Live React Preview</Typography>
                      </Box>
                      <AdvancedReactPreview code={previewCode} showAnalysis={true} />
                    </Box>

                    {/* Accuracy Result */}
                    {accuracyResult && (
                      <Box sx={{ 
                        mb: 3, 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)', 
                        borderRadius: 3,
                        border: '1px solid rgba(76, 175, 80, 0.2)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <TrendingUp sx={{ color: 'success.main' }} />
                          <Typography variant="subtitle1">Estimated Accuracy</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Box sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'white'
                          }}>
                            {accuracyResult.score}%
                          </Box>
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
                </IconCard>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Floating Action Buttons */}
      <FloatingActionPanel>
        {actionButtons.map((button, index) => (
          <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
            <Fab
              key={button.label}
              color={button.color}
              onClick={button.action}
              disabled={button.disabled}
              sx={{
                width: 56,
                height: 56,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
                }
              }}
            >
              {button.icon}
            </Fab>
          </Zoom>
        ))}
      </FloatingActionPanel>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!imagePreview}
        onClose={() => setImagePreview(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Image sx={{ color: 'primary.main' }} />
              <Typography>Image Preview</Typography>
            </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility sx={{ color: 'primary.main' }} />
              <Typography>Live Preview</Typography>
            </Box>
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