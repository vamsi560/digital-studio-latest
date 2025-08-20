import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  Tooltip,
  Fade,
  Zoom,
  Paper,
  Grid,
  Stack,
  Avatar,
  Badge,
  Switch,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowForward,
  CloudUpload,
  Edit,
  FileUpload,
  Image,
  Code,
  Download,
  PlayArrow,
  Settings,
  CheckCircle,
  Error,
  Warning,
  Info,
  Add,
  Remove,
  ExpandMore,
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
  Build,
  Rocket,
  Speed,
  Security,
  Support,
  Star,
  TrendingUp,
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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
  border: '1px solid #374151',
  borderRadius: 16,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    borderColor: '#4B5563',
  },
}));

const StyledButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  transition: 'all 0.3s ease-in-out',
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
    },
  }),
  ...(variant === 'outlined' && {
    border: '2px solid #374151',
    '&:hover': {
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
  }),
}));

const UploadArea = styled(Box)(({ theme, isDragOver }) => ({
  border: '2px dashed #374151',
  borderRadius: 16,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: isDragOver ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
  borderColor: isDragOver ? '#10B981' : '#374151',
  '&:hover': {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 12,
  overflow: 'hidden',
  cursor: 'grab',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    cursor: 'grabbing',
  },
}));

const DropZone = styled(Box)(({ theme, isDragOver }) => ({
  border: '2px dashed #374151',
  borderRadius: 16,
  minHeight: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: isDragOver ? 'rgba(16, 185, 129, 0.1)' : 'rgba(31, 41, 55, 0.5)',
  borderColor: isDragOver ? '#10B981' : '#374151',
}));

// Enhanced Components
export const EnhancedServiceCard = ({ title, description, icon, onClick, disabled = false, comingSoon = false }) => (
  <StyledCard onClick={!disabled ? onClick : undefined} sx={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      {comingSoon && (
        <Chip
          label="Coming Soon"
          size="small"
          color="warning"
          icon={<Star />}
          sx={{ mt: 1 }}
        />
      )}
    </CardContent>
  </StyledCard>
);

export const EnhancedWorkflowStatus = ({ status, error }) => {
  const agents = [
    {
      id: 'architect',
      name: 'Architect',
      description: 'Analyzing project structure...',
      icon: <Architecture />,
      color: '#3B82F6',
    },
    {
      id: 'builder',
      name: 'Component Builder',
      description: 'Creating reusable components...',
      icon: <Build />,
      color: '#10B981',
    },
    {
      id: 'composer',
      name: 'Page Composer',
      description: 'Assembling pages...',
      icon: <ViewModule />,
      color: '#8B5CF6',
    },
    {
      id: 'finisher',
      name: 'Finisher & QA',
      description: 'Finalizing app and checking quality...',
      icon: <Verified />,
      color: '#F59E0B',
    },
  ];

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          An Error Occurred
        </Typography>
        <Typography variant="body2">{error}</Typography>
      </Alert>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Generation Progress
        </Typography>
        <Stack spacing={2}>
          {agents.map((agent) => {
            const currentStatus = status[agent.id] || 'pending';
            const isCompleted = currentStatus === 'completed';
            const isRunning = currentStatus === 'running';

            return (
              <Box
                key={agent.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: isRunning
                    ? 'rgba(16, 185, 129, 0.1)'
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'transparent',
                  border: isRunning ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: isCompleted
                      ? '#10B981'
                      : isRunning
                      ? agent.color
                      : '#374151',
                    width: 48,
                    height: 48,
                  }}
                >
                  {isCompleted ? <CheckCircle /> : agent.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {agent.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isRunning ? status.text : isCompleted ? 'Completed' : 'Pending'}
                  </Typography>
                </Box>
                {isRunning && <CircularProgress size={20} />}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const EnhancedFileUpload = ({ onFileUpload, disabled = false, accept = "*" }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    onFileUpload(files);
  };

  return (
    <UploadArea
      isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input').click()}
      sx={{ opacity: disabled ? 0.5 : 1 }}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        Upload Files
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Drag and drop files here or click to browse
      </Typography>
    </UploadArea>
  );
};

export const EnhancedImageTray = ({ images, onImageDragStart, onImageRemove }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
    {images.map((image, index) => (
      <ImagePreview
        key={index}
        draggable
        onDragStart={(e) => onImageDragStart(e, image)}
        sx={{ width: 100, height: 100 }}
      >
        <img
          src={URL.createObjectURL(image)}
          alt={image.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <IconButton
          size="small"
          onClick={() => onImageRemove(index)}
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
      </ImagePreview>
    ))}
  </Box>
);

export const EnhancedDropZone = ({ onDrop, isDragOver, children }) => (
  <DropZone isDragOver={isDragOver}>
    {children || (
      <Box sx={{ textAlign: 'center' }}>
        <DragIndicator sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Drop Images Here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Arrange your screens in the desired order
        </Typography>
      </Box>
    )}
  </DropZone>
);

export const EnhancedActionButtons = ({ onGenerate, onPreview, onDownload, loading = false }) => (
  <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
    <StyledButton
      variant="contained"
      onClick={onGenerate}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : <Rocket />}
      size="large"
    >
      {loading ? 'Generating...' : 'Generate Code'}
    </StyledButton>
    
    <StyledButton
      variant="outlined"
      onClick={onPreview}
      disabled={loading}
      startIcon={<PlayArrow />}
      size="large"
    >
      Preview
    </StyledButton>
    
    <StyledButton
      variant="outlined"
      onClick={onDownload}
      disabled={loading}
      startIcon={<Download />}
      size="large"
    >
      Download Codebase
    </StyledButton>
  </Stack>
);

export const EnhancedFigmaInput = ({ value, onChange, onImport, loading = false }) => (
  <Box sx={{ position: 'relative' }}>
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste Figma URL..."
      variant="outlined"
      size="large"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={onImport}
              disabled={loading || !value}
              sx={{ color: 'primary.main' }}
            >
              {loading ? <CircularProgress size={20} /> : <ArrowForward />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

export const EnhancedStylesheetSection = ({ onFileUpload, onManualStyles, designTokens, onDesignTokensChange }) => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Stylesheet
      </Typography>
      
      <StyledButton
        variant="outlined"
        component="label"
        startIcon={<FileUpload />}
        fullWidth
      >
        Upload .css file
        <input
          type="file"
          accept=".css"
          onChange={(e) => onFileUpload(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </StyledButton>
      
      <StyledButton
        variant="outlined"
        onClick={() => setIsTooltipVisible(!isTooltipVisible)}
        startIcon={<Edit />}
        fullWidth
      >
        Add Manual Styles
      </StyledButton>
      
      {isTooltipVisible && (
        <Fade in={isTooltipVisible}>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Design Tokens
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Primary Color"
                  type="color"
                  value={designTokens['--primary-color'] || '#4A90E2'}
                  onChange={(e) => onDesignTokensChange({
                    ...designTokens,
                    '--primary-color': e.target.value
                  })}
                  fullWidth
                />
                <TextField
                  label="Font Family"
                  placeholder="e.g., 'Inter', sans-serif"
                  value={designTokens['--font-family'] || ''}
                  onChange={(e) => onDesignTokensChange({
                    ...designTokens,
                    '--font-family': `'${e.target.value}'`
                  })}
                  fullWidth
                />
                <TextField
                  label="Border Radius (px)"
                  type="number"
                  placeholder="e.g., 8"
                  value={designTokens['--border-radius']?.replace('px', '') || ''}
                  onChange={(e) => onDesignTokensChange({
                    ...designTokens,
                    '--border-radius': `${e.target.value}px`
                  })}
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Stack>
  );
};

export const EnhancedHeader = ({ onBack, title, subtitle }) => (
  <Box sx={{ mb: 4 }}>
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      {onBack && (
        <IconButton onClick={onBack} sx={{ color: 'text.secondary' }}>
          <ArrowBack />
        </IconButton>
      )}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

export const EnhancedErrorDisplay = ({ message, onRetry }) => {
  if (!message) return null;
  
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
      sx={{ borderRadius: 2 }}
    >
      {message}
    </Alert>
  );
};

export const EnhancedLoadingOverlay = ({ loading, message = 'Loading...' }) => {
  if (!loading) return null;
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        borderRadius: 2,
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={48} />
        <Typography variant="body1" color="white">
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}; 