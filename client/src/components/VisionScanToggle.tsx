import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Cloud, Cpu, Loader2, Sparkles, ChevronDown, Zap, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VisionScanToggleProps {
  url: string;
  onScanComplete: (issues: any[]) => void;
}

const models = [
  { 
    id: 'local', 
    name: 'SmolVLM (Local)', 
    description: 'Runs on your device, privacy-first, completely free',
    icon: <Cpu className="w-4 h-4" />,
    speed: 'Fast',
    accuracy: 'Good',
    badge: 'Local',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
  },
  { 
    id: 'cloud', 
    name: 'Llama 3.2 Vision (Cloud)', 
    description: 'More accurate visual analysis, uses cloud AI',
    icon: <Cloud className="w-4 h-4" />,
    speed: 'Medium',
    accuracy: 'Excellent',
    badge: 'Cloud',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
  }
];

export function VisionScanToggle({ url, onScanComplete }: VisionScanToggleProps) {
  const [selectedModel, setSelectedModel] = useState<'local' | 'cloud'>('local');
  const [scanning, setScanning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // ✅ Updated to use environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const runVisionScan = async () => {
    setScanning(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/vision-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, mode: selectedModel })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const modelName = models.find(m => m.id === selectedModel)?.name;
        toast({
          title: `✅ Vision scan complete`,
          description: `Found ${data.count} visual issues using ${modelName}`,
        });
        onScanComplete(data.issues);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: '❌ Vision scan failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setScanning(false);
    }
  };

  const selectedModelInfo = models.find(m => m.id === selectedModel);

  return (
    <Card className="border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-sm">
      <CardHeader className="pb-3 border-b border-[#e2e8f0] dark:border-[#334155]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#2563eb]/10 to-[#7c3aed]/10">
            <Sparkles className="w-5 h-5 text-[#2563eb] dark:text-[#7c3aed]" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-[#0f172a] dark:text-white">
              AI Vision Scanner
            </CardTitle>
            <CardDescription className="text-sm text-[#475569] dark:text-[#94a3b8] mt-0.5">
              Detect visual accessibility issues using AI
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-5 space-y-5">
        {/* Model Selection Label */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#0f172a] dark:text-white flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#2563eb]" />
            Choose AI Model
          </Label>
          
          {/* Custom Dropdown with Solid Background */}
          <div className="relative">
            <Select
              value={selectedModel}
              onValueChange={(value) => setSelectedModel(value as 'local' | 'cloud')}
              onOpenChange={setIsOpen}
            >
              <SelectTrigger className="w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-xl px-4 py-3 h-auto shadow-sm hover:border-[#2563eb]/50 transition-all">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-[#f1f5f9] dark:bg-[#1e293b]">
                    {selectedModelInfo?.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-[#0f172a] dark:text-white">
                      {selectedModelInfo?.name}
                    </div>
                    <div className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                      {selectedModelInfo?.description}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#64748b] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </SelectTrigger>
              
              {/* Solid Dropdown Content - Opaque */}
              <SelectContent className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-xl shadow-lg p-1 mt-1">
                {models.map((model) => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="rounded-lg cursor-pointer transition-all data-[highlighted]:bg-[#f1f5f9] dark:data-[highlighted]:bg-[#0f172a] data-[state=checked]:bg-[#2563eb]/5"
                  >
                    <div className="flex items-center gap-3 py-2">
                      <div className="p-2 rounded-lg bg-[#f1f5f9] dark:bg-[#1e293b]">
                        {model.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#0f172a] dark:text-white text-sm">
                            {model.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${model.badgeColor}`}>
                            {model.badge}
                          </span>
                        </div>
                        <div className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                          {model.description}
                        </div>
                        <div className="flex gap-2 mt-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#f1f5f9] dark:bg-[#0f172a] text-[#475569] dark:text-[#94a3b8]">
                            ⚡ {model.speed}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#f1f5f9] dark:bg-[#0f172a] text-[#475569] dark:text-[#94a3b8]">
                            🎯 {model.accuracy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Model Info Card */}
        {selectedModelInfo && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-[#f8fafc] to-white dark:from-[#0f172a] dark:to-[#1e293b] border border-[#e2e8f0] dark:border-[#334155]">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-[#f1f5f9] dark:bg-[#1e293b]">
                {selectedModelInfo.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[#0f172a] dark:text-white">
                    Active Model: {selectedModelInfo.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedModelInfo.badgeColor}`}>
                    {selectedModelInfo.badge}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
                  {selectedModelInfo.id === 'local' 
                    ? 'Runs entirely on your device. No data leaves your computer. 100% private.'
                    : 'Uses cloud AI for enhanced accuracy. Sends screenshot to Together AI servers.'}
                </p>
                <div className="flex gap-3 mt-2 text-xs text-[#475569] dark:text-[#94a3b8]">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Speed: {selectedModelInfo.speed}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Accuracy: {selectedModelInfo.accuracy}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scan Button */}
        <Button
          onClick={runVisionScan}
          disabled={scanning}
          className="w-full gap-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:from-[#1d4ed8] hover:to-[#6d28d9] text-white font-medium py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {scanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              {selectedModelInfo?.icon}
              Run {selectedModelInfo?.name} Scan
            </>
          )}
        </Button>
        
        {/* Info Note */}
        <p className="text-xs text-center text-[#64748b] dark:text-[#94a3b8]">
          Visual analysis detects color contrast, text size, layout issues, and focus indicators
        </p>
      </CardContent>
    </Card>
  );
}