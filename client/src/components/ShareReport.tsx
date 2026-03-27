import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Share2, Copy, Check, Globe, Lock, Clock, X } from "lucide-react";

interface ShareReportProps {
  auditId: string;
}

export function ShareReport({ auditId }: ShareReportProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState(168);
  const [password, setPassword] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const { toast } = useToast();

  const generateShareLink = async () => {
    setLoading(true);
    // Simulate API call - replace with actual
    setTimeout(() => {
      const mockUrl = `${window.location.origin}/shared/mock-${Date.now()}`;
      setShareUrl(mockUrl);
      setLoading(false);
      toast({
        title: "Link Created",
        description: "Your report is ready to share",
      });
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const resetForm = () => {
    setShareUrl("");
    setPassword("");
    setExpiresIn(168);
    setIsPublic(true);
    setCopied(false);
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-lg rounded-lg" 
        align="end"
        sideOffset={5}
      >
        {/* Header with solid background */}
        <div className="p-4 border-b border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] rounded-t-lg flex items-center justify-between">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#2563eb]" />
            Share Report
          </h4>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-[#f1f5f9] dark:hover:bg-[#0f172a]" 
            onClick={() => setOpen(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Content with solid background */}
        <div className="p-4 bg-white dark:bg-[#1e293b] rounded-b-lg">
          {!shareUrl ? (
            <div className="space-y-4">
              {/* Expiration Select */}
              <div className="space-y-2">
                <Label htmlFor="expires" className="text-xs">Link Expiration</Label>
                <select
                  id="expires"
                  className="w-full p-2 text-sm rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b]"
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(Number(e.target.value))}
                >
                  <option value={24}>24 hours</option>
                  <option value={72}>3 days</option>
                  <option value={168}>7 days</option>
                  <option value={720}>30 days</option>
                </select>
              </div>
              
              {/* Password Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-toggle" className="text-xs">Password Protection</Label>
                  <p className="text-[10px] text-[#64748b]">
                    Require password to view
                  </p>
                </div>
                <Switch
                  id="password-toggle"
                  checked={!!password}
                  onCheckedChange={(checked) => 
                    setPassword(checked ? "temp" : "")
                  }
                  className="scale-75"
                />
              </div>
              
              {/* Password Input */}
              {password && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password === "temp" ? "" : password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm h-8"
                  />
                </div>
              )}
              
              {/* Public Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-toggle" className="text-xs">Public Access</Label>
                  <p className="text-[10px] text-[#64748b]">
                    Anyone with link can view
                  </p>
                </div>
                <Switch
                  id="public-toggle"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="scale-75"
                />
              </div>
              
              {/* Generate Button */}
              <Button
                className="w-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white text-sm h-8"
                onClick={generateShareLink}
                disabled={loading}
              >
                {loading ? "Creating..." : "Generate Link"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Link Display */}
              <div className="p-3 bg-[#f8fafc] dark:bg-[#1e293b] rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
                <div className="flex items-center gap-2 mb-2">
                  {isPublic ? (
                    <Globe className="w-3 h-3 text-green-500" />
                  ) : (
                    <Lock className="w-3 h-3 text-amber-500" />
                  )}
                  <span className="text-xs text-[#475569] dark:text-[#94a3b8]">
                    {isPublic ? "Public" : "Private"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-xs h-8"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="h-8 w-8 shrink-0"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[#64748b]">
                  <Clock className="w-3 h-3" />
                  Expires in {
                    expiresIn === 24 ? '24h' : 
                    expiresIn === 72 ? '3d' : 
                    expiresIn === 168 ? '7d' : '30d'
                  }
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => setShareUrl("")}
                >
                  New
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white text-xs h-8"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}