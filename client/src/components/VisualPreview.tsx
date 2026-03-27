import { useState } from "react";
import { AlertCircle, ExternalLink, Maximize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface VisualPreviewProps {
  url: string;
}

export function VisualPreview({ url }: VisualPreviewProps) {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setIframeError(false);
    setIsLoading(true);
    setKey(prev => prev + 1);
  };

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden">
        {/* Preview Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm font-medium text-[#475569] dark:text-[#94a3b8] ml-2">
              Website Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              title="Refresh preview"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFullscreen}
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        {!iframeError ? (
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#1e293b] z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-[#e2e8f0] border-t-[#2563eb] rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-[#475569] dark:text-[#94a3b8]">Loading preview...</p>
                </div>
              </div>
            )}
            <iframe
              key={key}
              src={url}
              title="Website Preview"
              className="w-full h-[600px] bg-white"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIframeError(true);
                setIsLoading(false);
              }}
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-3">
              Visual Preview Unavailable
            </h3>
            
            <p className="text-[#475569] dark:text-[#94a3b8] max-w-md mb-4">
              Due to browser security restrictions (X-Frame-Options), we cannot display 
              <span className="font-mono text-[#2563eb] dark:text-[#7c3aed] mx-1">{url}</span> 
              directly in this dashboard.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
                onClick={() => window.open(url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Website in New Tab
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}