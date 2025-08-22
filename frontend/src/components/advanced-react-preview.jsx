// frontend/src/components/AdvancedReactPreview.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

const AdvancedReactPreview = ({ 
  code, 
  onError, 
  onReady, 
  autoRefresh = true,
  showAnalysis = true,
  className = "" 
}) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const iframeRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Debounced preview generation
  const generatePreview = useCallback(async (immediate = false) => {
    if (!code?.trim()) {
      setPreviewData(null);
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const delay = immediate ? 0 : 1000; // 1 second debounce

    debounceTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setPreviewReady(false);

      try {
        const response = await fetch('/api/live-preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success) {
          setPreviewData(data);
          setAnalysis(data.analysis);
          onReady?.(data);
        } else {
          setError(data.error);
          onError?.(data.error);
        }
      } catch (err) {
        const errorMsg = 'Failed to generate preview';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setLoading(false);
      }
    }, delay);
  }, [code, onError, onReady]);

  // Auto-refresh when code changes
  useEffect(() => {
    if (autoRefresh && code) {
      generatePreview();
    }
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [code, autoRefresh, generatePreview]);

  // Handle iframe messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      switch (event.data?.type) {
        case 'PREVIEW_READY':
          setPreviewReady(true);
          console.log('Preview ready:', event.data);
          break;
        case 'PREVIEW_ERROR':
          console.error('Preview error:', event.data.error);
          setError(`Runtime Error: ${event.data.error.message}`);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    generatePreview(true);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  if (!code?.trim()) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-400 text-lg mb-2">📝</div>
        <p className="text-gray-500">No code to preview</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Analysis Panel */}
      {showAnalysis && analysis && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <span className="text-lg">🔍</span>
              Component Analysis
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              analysis.complexity === 'low' ? 'bg-green-100 text-green-800' :
              analysis.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {analysis.complexity} complexity
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-blue-800 mb-2">
                <strong>{analysis.componentName}</strong> ({analysis.componentType})
              </p>
              <p className="text-sm text-blue-700">{analysis.description}</p>
              {analysis.estimatedLines > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  Estimated: {analysis.estimatedLines} lines of code
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              {analysis.features?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-blue-900">Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {analysis.suggestions?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-blue-900">Suggestions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.suggestions.slice(0, 3).map((suggestion, i) => (
                      <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        {suggestion}
                      </span>
                    ))}
                    {analysis.suggestions.length > 3 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        +{analysis.suggestions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {analysis.props?.length > 0 && (
              <div>
                <span className="font-medium text-blue-900">Props ({analysis.props.length}):</span>
                <ul className="text-blue-700 mt-1 space-y-1">
                  {analysis.props.map((prop, i) => (
                    <li key={i} className="text-xs">
                      • {prop.name} ({prop.type}) {prop.required && '⚠️'}
                      {prop.defaultValue && ` = ${prop.defaultValue}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.hooks?.length > 0 && (
              <div>
                <span className="font-medium text-blue-900">Hooks ({analysis.hooks.length}):</span>
                <ul className="text-blue-700 mt-1 space-y-1">
                  {analysis.hooks.map((hook, i) => (
                    <li key={i} className="text-xs">• {hook}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.imports?.length > 0 && (
              <div>
                <span className="font-medium text-blue-900">Imports ({analysis.imports.length}):</span>
                <ul className="text-blue-700 mt-1 space-y-1">
                  {analysis.imports.slice(0, 5).map((imp, i) => (
                    <li key={i} className="text-xs">• {imp}</li>
                  ))}
                  {analysis.imports.length > 5 && (
                    <li className="text-xs text-blue-500">+{analysis.imports.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Component State Analysis */}
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                  analysis.hasState ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {analysis.hasState ? '✓' : '✗'}
                </div>
                <span className="text-xs text-blue-900">State</span>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                  analysis.hasEffects ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {analysis.hasEffects ? '✓' : '✗'}
                </div>
                <span className="text-xs text-blue-900">Effects</span>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                  analysis.hasContext ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {analysis.hasContext ? '✓' : '✗'}
                </div>
                <span className="text-xs text-blue-900">Context</span>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                  analysis.hasRefs ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {analysis.hasRefs ? '✓' : '✗'}
                </div>
                <span className="text-xs text-blue-900">Refs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-lg flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-2">Preview Error</h3>
              <p className="text-red-700 text-sm mb-3">{error}</p>
              <button
                onClick={handleRefresh}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Frame */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Toolbar */}
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              React Preview {analysis?.componentName && `- ${analysis.componentName}`}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Status indicator */}
            <div className="flex items-center space-x-2 text-sm">
              {loading && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  <span>Loading...</span>
                </div>
              )}
              {previewReady && !loading && (
                <div className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Ready</span>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
              title="Refresh preview"
            >
              🔄
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
              title="Fullscreen"
            >
              ⛶
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="flex items-center space-x-3">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-gray-600">Generating preview...</span>
              </div>
            </div>
          )}
          
          {previewData?.previewHTML && (
            <iframe
              key={refreshKey}
              ref={iframeRef}
              srcDoc={previewData.previewHTML}
              className="w-full h-96 border-0"
              title="React Component Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
              onLoad={() => {
                // Send a message to the iframe to check if it loaded properly
                setTimeout(() => {
                  if (iframeRef.current) {
                    iframeRef.current.contentWindow.postMessage({ type: 'CHECK_READY' }, '*');
                  }
                }, 1000);
              }}
            />
          )}
          
          {/* Fallback preview if iframe doesn't work */}
          {previewData?.url && !previewData?.previewHTML && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Preview is available at the development server URL:
              </p>
              <a 
                href={previewData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm break-all"
              >
                {previewData.url}
              </a>
            </div>
          )}
          
          {/* No preview data available */}
          {!previewData?.previewHTML && !previewData?.url && previewReady && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-yellow-800 font-medium">Preview Not Available</span>
              </div>
              <p className="text-yellow-700 text-sm">
                The preview could not be generated. This might be due to:
              </p>
              <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
                <li>Component compilation errors</li>
                <li>Missing dependencies</li>
                <li>Unsupported React features</li>
              </ul>
              <button
                onClick={handleRefresh}
                className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors text-sm"
              >
                🔄 Retry Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info (Development) */}
      {process.env.NODE_ENV === 'development' && previewData && (
        <details className="bg-gray-50 border rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            🔧 Debug Information
          </summary>
          <div className="mt-3 space-y-2 text-xs">
            <div><strong>Generated:</strong> {previewData.timestamp}</div>
            <div><strong>Framework:</strong> {previewData.framework}</div>
            <div><strong>Project:</strong> {previewData.projectName}</div>
            <div><strong>Status:</strong> {previewData.status}</div>
            <div><strong>Component Name:</strong> {analysis?.componentName || 'Unknown'}</div>
            <div><strong>Component Type:</strong> {analysis?.componentType || 'Unknown'}</div>
            <div><strong>Complexity:</strong> {analysis?.complexity || 'Unknown'}</div>
            <div><strong>Estimated Lines:</strong> {analysis?.estimatedLines || 0}</div>
            <div><strong>Has State:</strong> {analysis?.hasState ? 'Yes' : 'No'}</div>
            <div><strong>Has Effects:</strong> {analysis?.hasEffects ? 'Yes' : 'No'}</div>
            <div><strong>Has Context:</strong> {analysis?.hasContext ? 'Yes' : 'No'}</div>
            <div><strong>Has Refs:</strong> {analysis?.hasRefs ? 'Yes' : 'No'}</div>
            <div><strong>Props Count:</strong> {analysis?.props?.length || 0}</div>
            <div><strong>Hooks Count:</strong> {analysis?.hooks?.length || 0}</div>
            <div><strong>Imports Count:</strong> {analysis?.imports?.length || 0}</div>
            <div><strong>Features Count:</strong> {analysis?.features?.length || 0}</div>
            <div><strong>Suggestions Count:</strong> {analysis?.suggestions?.length || 0}</div>
            {previewData.url && <div><strong>Server URL:</strong> {previewData.url}</div>}
          </div>
        </details>
      )}
    </div>
  );
};

export default AdvancedReactPreview;
