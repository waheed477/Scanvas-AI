import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@shared/routes";
import { Loader2, Plus, X, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

interface BatchResult {
  url: string;
  score: number;
  id?: string;
  error?: string;
}

export function BatchScanner() {
  const [urls, setUrls] = useState<string[]>(['']);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BatchResult[]>([]);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length ? newUrls : ['']);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleBatchScan = async () => {
    const validUrls = urls.filter(u => u.trim() !== '');
    
    if (validUrls.length === 0) {
      toast({
        title: "No URLs",
        description: "Please enter at least one URL",
        variant: "destructive",
      });
      return;
    }

    setScanning(true);
    setProgress(0);
    setResults([]);

    try {
      const response = await api.post('/api/batch-scan', { 
        urls: validUrls,
        standards: ['wcag2aa']
      });

      setResults(response.results);
      
      toast({
        title: "✅ Batch Scan Complete",
        description: `Scanned ${response.summary.successful}/${response.summary.total} URLs successfully`,
      });

      // Show comparison if multiple successful scans
      if (response.comparison) {
        toast({
          title: "📊 Comparison Available",
          description: `Best: ${response.comparison.bestScore} | Worst: ${response.comparison.worstScore} | Avg: ${response.comparison.averageScore}`,
        });
      }

    } catch (error: any) {
      toast({
        title: "❌ Batch Scan Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScanning(false);
      setProgress(100);
    }
  };

  return (
    <Card className="border-white/20 bg-white/10 backdrop-blur-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-white/80" />
            Batch URL Scanner
          </h3>
          <Badge variant="outline" className="bg-white/10 text-white/80 border-white/20">
            Compare Multiple Sites
          </Badge>
        </div>

        <div className="space-y-3">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`URL ${index + 1} (e.g., example.com)`}
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                disabled={scanning}
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
              {urls.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUrlField(index)}
                  disabled={scanning}
                  className="text-white/50 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
  <Button
    variant="outline"
    onClick={addUrlField}
    disabled={scanning}
    className="gap-2 border-white/20 bg-transparent text-white/80 hover:text-white hover:bg-white/10"
  >
    <Plus className="w-4 h-4" />
    Add URL
  </Button>
  <Button
    onClick={handleBatchScan}
    disabled={scanning || urls.filter(u => u.trim()).length === 0}
    className="flex-1 bg-white text-[#1e293b] hover:bg-white/90 gap-2"
  >
    {scanning ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Scanning {urls.filter(u => u.trim()).length} URLs...
      </>
    ) : (
      <>
        Start Batch Scan
        <Badge variant="outline" className="bg-[#1e293b]/10 text-[#1e293b] border-[#1e293b]/20">
          {urls.filter(u => u.trim()).length}
        </Badge>
      </>
    )}
  </Button>
</div>

        {scanning && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-white/20" />
            <p className="text-sm text-white/50 text-center">
              Scanning... This may take a few minutes
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-white">Results:</h4>
            {results.map((result, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-white/20 bg-white/5 flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors"
                onClick={() => result.id && setLocation(`/audit/${result.id}`)}
              >
                <div className="flex items-center gap-3">
                  <Badge className={result.error ? "bg-red-500/80" : result.score >= 90 ? "bg-emerald-500/80" : result.score >= 70 ? "bg-blue-500/80" : result.score >= 50 ? "bg-yellow-500/80" : "bg-red-500/80"}>
                    {result.error ? '❌' : result.score}
                  </Badge>
                  <span className="text-sm truncate max-w-[200px] text-white/80">{result.url}</span>
                </div>
                {result.error ? (
                  <span className="text-xs text-red-400">{result.error}</span>
                ) : (
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    View Report
                  </Button>
                )}
              </div>
            ))}

            {/* Comparison Summary */}
            {results.length > 1 && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-sm font-medium text-white/80">Comparison:</p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="text-center">
                    <p className="text-white/50">Best</p>
                    <p className="text-emerald-400 font-bold">
                      {Math.max(...results.filter(r => !r.error).map(r => r.score || 0))}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/50">Average</p>
                    <p className="text-blue-400 font-bold">
                      {Math.round(results.filter(r => !r.error).reduce((s, r) => s + (r.score || 0), 0) / results.filter(r => !r.error).length)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/50">Worst</p>
                    <p className="text-red-400 font-bold">
                      {Math.min(...results.filter(r => !r.error).map(r => r.score || 0))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}