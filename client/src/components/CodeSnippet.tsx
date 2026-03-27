import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getSnippetForRule } from "@/data/snippets/code-snippets";

interface CodeSnippetProps {
  ruleId: string;
  violation?: any;
}

export function CodeSnippet({ ruleId, violation }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'code' | 'preview'>('code');
  const { toast } = useToast();
  
  const snippet = getSnippetForRule(ruleId, violation);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.after);
    setCopied(true);
    toast({
      title: "✅ Copied!",
      description: "Fixed code snippet copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-4 border-[#e2e8f0] dark:border-[#334155]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#2563eb]/10 text-[#2563eb]">
              {snippet.language}
            </Badge>
            <span className="text-sm font-medium text-[#0f172a] dark:text-white">
              Fix Example
            </span>
          </div>
          <div className="flex gap-2">
            <Tabs value={view} onValueChange={(v) => setView(v as 'code' | 'preview')}>
              <TabsList className="h-8">
                <TabsTrigger value="code" className="px-3 py-1 text-xs">
                  <Code className="w-3 h-3 mr-1" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="preview" className="px-3 py-1 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="h-8 px-3"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <TabsContent value="code" className="mt-0">
          <div className="space-y-3">
            {/* Before Code */}
            <div>
              <p className="text-xs font-medium text-red-500 mb-1">❌ Before</p>
              <pre className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg overflow-x-auto text-xs font-mono border border-red-200 dark:border-red-800">
                {snippet.before}
              </pre>
            </div>
            
            {/* After Code */}
            <div>
              <p className="text-xs font-medium text-green-500 mb-1">✅ After</p>
              <pre className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg overflow-x-auto text-xs font-mono border border-green-200 dark:border-green-800">
                {snippet.after}
              </pre>
            </div>
            
            {/* Explanation */}
            <div className="text-xs text-[#64748b] dark:text-[#94a3b8] p-2 bg-[#f8fafc] dark:bg-[#1e293b] rounded">
              💡 {snippet.explanation}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="space-y-4 p-4 bg-white dark:bg-[#1e293b] rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#64748b]">Live Preview:</p>
              <div 
                className="p-4 bg-[#f8fafc] dark:bg-[#0f172a] rounded"
                dangerouslySetInnerHTML={{ __html: snippet.after }}
              />
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
}