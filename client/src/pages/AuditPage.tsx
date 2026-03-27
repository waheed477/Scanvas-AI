import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateAudit, useAudits } from "@/hooks/use-audits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Search, 
  Zap, 
  Sparkles, 
  Shield, 
  BarChart,
  Globe,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  History
} from "lucide-react";
import { motion } from "framer-motion";
import { BatchScanner } from "@/components/BatchScanner";
import { StandardsSelector } from "@/components/StandardsSelector";
import { formatDistanceToNow } from "date-fns";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['wcag2aa']);
  const [, setLocation] = useLocation();
  const createAudit = useCreateAudit();
  const { data: recentAudits, isLoading: auditsLoading } = useAudits();
  const { toast } = useToast();

  // Get real stats from actual data
  const today = new Date().toDateString();
  const auditsToday = recentAudits?.filter(a => 
    new Date(a.createdAt).toDateString() === today
  ).length || 0;
  
  const totalIssues = recentAudits?.reduce((sum, a) => 
    sum + (a.summary?.total || 0), 0
  ) || 0;
  
  const avgScore = recentAudits && recentAudits.length > 0
    ? Math.round(recentAudits.reduce((sum, a) => sum + (a.score || 0), 0) / recentAudits.length)
    : 0;

  const stats = [
    { 
      label: "Audits Today", 
      value: auditsToday.toString(), 
      icon: Clock, 
      color: "blue",
      real: true 
    },
    { 
      label: "Issues Found", 
      value: totalIssues.toLocaleString(), 
      icon: AlertCircle, 
      color: "red",
      real: true 
    },
    { 
      label: "Avg Score", 
      value: avgScore.toString(), 
      icon: TrendingUp, 
      color: avgScore >= 70 ? "green" : avgScore >= 50 ? "yellow" : "red",
      real: true 
    },
    { 
      label: "Total Scans", 
      value: recentAudits?.length.toLocaleString() || "0", 
      icon: Globe, 
      color: "purple",
      real: true 
    }
  ];

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    if (!url || url.trim() === '') {
      toast({
        title: "❌ URL Required",
        description: "Please enter a website URL to audit",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Starting audit with URL:', url);
    
    // Format URL if needed
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Validate URL format
    try {
      new URL(formattedUrl);
    } catch {
      toast({
        title: "❌ Invalid URL",
        description: "Please enter a valid website URL (e.g., example.com)",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createAudit.mutateAsync({ 
        url: formattedUrl,
        standards: selectedStandards
      });
      setLocation(`/audit/${result.id}`);
    } catch (err: any) {
      toast({
        title: "❌ Audit Failed",
        description: err.message || "Failed to start audit",
        variant: "destructive",
      });
    }
  };

  // Quick example URLs
  const exampleUrls = [
    { url: "example.com", label: "Example (Basic)", category: "test" },
    { url: "webaim.org", label: "WebAIM (Educational)", category: "educational" },
    { url: "bbc.com", label: "BBC (News)", category: "news" },
    { url: "github.com", label: "GitHub (Tech)", category: "tech" },
    { url: "nytimes.com", label: "NY Times (News)", category: "news" },
    { url: "w3.org", label: "W3C (Standards)", category: "standards" }
  ];

  const [exampleCategory, setExampleCategory] = useState<string>("all");
  
  const filteredExamples = exampleCategory === "all" 
    ? exampleUrls 
    : exampleUrls.filter(ex => ex.category === exampleCategory);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] py-6 md:py-8 px-3 md:px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="gap-2 text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#7c3aed] w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setLocation("/history")}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">View History</span>
            </Button>
            <StandardsSelector 
              selectedStandards={selectedStandards}
              onStandardsChange={setSelectedStandards}
            />
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#2563eb]/10 to-[#7c3aed]/10 text-[#2563eb] dark:text-[#7c3aed] text-xs md:text-sm font-medium mb-4 md:mb-6 border border-[#2563eb]/20">
            <Zap className="w-3 h-3 md:w-4 md:h-4" />
            <span>New Accessibility Scan</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 px-2">
            <span className="bg-gradient-to-r from-[#0f172a] to-[#2563eb] dark:from-white dark:to-[#7c3aed] bg-clip-text text-transparent">
              Start a New Audit
            </span>
          </h1>
          
          <p className="text-sm md:text-lg text-[#475569] dark:text-[#94a3b8] max-w-2xl mx-auto px-4">
            Enter any website URL to get instant accessibility insights and recommendations
          </p>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="single" className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full max-w-xs md:max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="single" className="gap-1 md:gap-2 text-xs md:text-sm">
              <Search className="w-3 h-3 md:w-4 md:h-4" />
              <span>Single URL</span>
            </TabsTrigger>
            <TabsTrigger value="batch" className="gap-1 md:gap-2 text-xs md:text-sm">
              <BarChart className="w-3 h-3 md:w-4 md:h-4" />
              <span>Batch Scan</span>
            </TabsTrigger>
          </TabsList>

          {/* Single URL Scan */}
          <TabsContent value="single">
            <Card className="border-[#e2e8f0] dark:border-[#334155] bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-8">
                <form onSubmit={handleAudit} className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0f172a] dark:text-white block">
                      Website URL
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#64748b] w-4 h-4 md:w-5 md:h-5" />
                        <Input
                          placeholder="Enter website URL (e.g., example.com)"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pl-9 md:pl-11 h-12 md:h-14 text-sm md:text-base border-[#e2e8f0] dark:border-[#334155] focus-visible:ring-2 focus-visible:ring-[#2563eb]/30"
                          disabled={createAudit.isPending}
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="h-12 md:h-14 px-4 md:px-8 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white hover:from-[#1d4ed8] hover:to-[#6d28d9] shadow-lg disabled:opacity-50 whitespace-nowrap text-sm md:text-base"
                        disabled={createAudit.isPending}
                      >
                        {createAudit.isPending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="hidden sm:inline">Scanning...</span>
                          </span>
                        ) : (
                          "Start Audit"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Example URLs with Categories */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs md:text-sm text-[#64748b]">Try these examples:</p>
                      <select
                        value={exampleCategory}
                        onChange={(e) => setExampleCategory(e.target.value)}
                        className="text-xs md:text-sm bg-transparent border border-[#e2e8f0] dark:border-[#334155] rounded px-2 py-1"
                      >
                        <option value="all">All</option>
                        <option value="test">Test Sites</option>
                        <option value="news">News</option>
                        <option value="tech">Tech</option>
                        <option value="educational">Educational</option>
                        <option value="standards">Standards</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredExamples.map((example) => (
                        <button
                          key={example.url}
                          type="button"
                          onClick={() => setUrl(example.url)}
                          className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] text-xs md:text-sm text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#7c3aed] hover:border-[#2563eb]/50 transition-colors"
                        >
                          {example.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch Scan */}
          <TabsContent value="batch">
            <BatchScanner />
          </TabsContent>
        </Tabs>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-[#e2e8f0] dark:border-[#334155] hover:shadow-md transition-all">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-950/30 flex items-center justify-center mx-auto mb-2 md:mb-3`}>
                    <stat.icon className={`w-4 h-4 md:w-5 md:h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-[#0f172a] dark:text-white">
                    {auditsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-xs md:text-sm text-[#64748b]">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Preview */}
        {recentAudits && recentAudits.length > 0 && (
          <div className="mt-8 md:mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-[#0f172a] dark:text-white">
                Recent Activity
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/history")}
                className="text-xs md:text-sm gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid gap-2">
              {recentAudits.slice(0, 3).map((audit) => (
                <div
                  key={audit.id}
                  onClick={() => setLocation(`/audit/${audit.id}`)}
                  className="p-3 md:p-4 bg-white dark:bg-[#1e293b] rounded-lg border border-[#e2e8f0] dark:border-[#334155] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 ${
                        audit.score >= 90 ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
                        audit.score >= 70 ? "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" :
                        audit.score >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400" :
                        "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      }`}>
                        {audit.score}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm md:text-base truncate">
                          {audit.url}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-[#2563eb] dark:text-[#7c3aed] flex-shrink-0">
                      {audit.summary?.total || 0} issues
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="mt-8 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-[#0f172a] to-[#2563eb] dark:from-white dark:to-[#7c3aed] bg-clip-text text-transparent px-2">
            Why Use Scanvas?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: <Shield className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Comprehensive",
                desc: "WCAG 2.1 AA, Section 508, and ADA compliance checking"
              },
              {
                icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Lightning Fast",
                desc: "Get results in seconds with our optimized scanning engine"
              },
              {
                icon: <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Actionable",
                desc: "Code snippets and step-by-step remediation guidance"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-[#e2e8f0] dark:border-[#334155] hover:shadow-lg transition-all">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2563eb]/10 dark:bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <div className="text-[#2563eb] dark:text-[#7c3aed]">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-[#475569] dark:text-[#94a3b8]">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}