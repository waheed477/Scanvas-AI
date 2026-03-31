import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@shared/routes";
import { format } from "date-fns";
import { ArrowLeft, AlertTriangle, Loader2, Shield, Globe, Lock, ServerCrash, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ScoreGauge } from "@/components/ScoreGauge";
import { IssueCard } from "@/components/IssueCard";
import { VisualPreview } from "@/components/VisualPreview";
import { ReportExport } from "@/components/ReportExport";
import { StandardsSelector } from "@/components/StandardsSelector";
import LoadingBar from "@/components/LoadingBar";
import { ExecutivePDF } from "@/components/ExecutivePDF";
import { RemediationRoadmap } from "@/components/RemediationRoadmap";
import { ShareReport } from "@/components/ShareReport";
import { ManualTesting } from "@/components/ManualTesting";
import { useMediaQuery } from "@/hooks/use-media-query";
import { VisionScanToggle } from "@/components/VisionScanToggle";
import { BenchmarkComparison } from "@/components/BenchmarkComparison";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuditDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("issues");
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['wcag2aa']);
  const [showLoading, setShowLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visionIssues, setVisionIssues] = useState<any[]>([]);
  const [showVisionIssues, setShowVisionIssues] = useState(false);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  // Guard condition
  if (!id || id === 'undefined') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#334155] mx-auto mb-4" />
          <p className="text-[#475569]">Loading audit details...</p>
        </div>
      </div>
    );
  }

  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['audit', id, selectedStandards],
    queryFn: async () => {
      console.log('Fetching audit with ID:', id, 'Standards:', selectedStandards);
      setShowLoading(true);
      try {
        const data = await api.get(`/api/audit/${id}`);
        return data;
      } finally {
        setTimeout(() => setShowLoading(false), 500);
      }
    },
    enabled: !!id && id !== 'undefined',
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#334155] mx-auto mb-4" />
          <p className="text-[#475569]">Loading audit details...</p>
        </div>
      </div>
    );
  }

  if (error || !audit) {
    console.error('Audit fetch error:', error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <ServerCrash className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Audit not found</h2>
          <p className="text-[#475569] mb-4">The audit you're looking for doesn't exist or couldn't be loaded.</p>
          <Button onClick={() => setLocation("/")} className="w-full sm:w-auto bg-[#334155] text-white hover:bg-[#5b6e8c]">Go Home</Button>
        </div>
      </div>
    );
  }

  // Check if scan had an error
  const scanError = audit.error;
  const violations = audit.results?.violations || [];

  // Group violations by impact
  const criticalCount = violations.filter((v: any) => v.impact === 'critical').length;
  const seriousCount = violations.filter((v: any) => v.impact === 'serious').length;
  const moderateCount = violations.filter((v: any) => v.impact === 'moderate').length;
  const minorCount = violations.filter((v: any) => v.impact === 'minor').length;

  // Professional score color mapping with messages
  const getScoreInfo = (score: number) => {
    if (score >= 95) {
      return {
        color: 'text-emerald-600',
        badge: '⭐ Excellent',
        message: 'Near-perfect accessibility! Only minor improvements possible.'
      };
    }
    if (score >= 85) {
      return {
        color: 'text-green-600',
        badge: '✓ Good',
        message: 'Good accessibility score. Address remaining issues for better compliance.'
      };
    }
    if (score >= 70) {
      return {
        color: 'text-blue-600',
        badge: '📊 Needs Improvement',
        message: 'Several accessibility issues found. Prioritize critical fixes.'
      };
    }
    if (score >= 50) {
      return {
        color: 'text-yellow-600',
        badge: '⚠️ Poor',
        message: 'Significant accessibility barriers detected. Immediate attention required.'
      };
    }
    return {
      color: 'text-red-600',
      badge: '🚨 Critical',
      message: 'Critical accessibility issues blocking user access. Fix urgently!'
    };
  };

  // Get error message based on type
  const getErrorMessage = (error: string) => {
    if (error.includes('Navigation timeout') || error.includes('timeout')) {
      return {
        title: "Scan Timeout",
        message: "The website took too long to respond. This often happens with slow servers or heavy sites.",
        icon: <ServerCrash className="h-12 w-12 text-amber-500" />,
        action: "Try scanning during off-peak hours or check if the site is accessible."
      };
    }
    if (error.includes('Could not load website') || error.includes('ERR_NAME_NOT_RESOLVED') || error.includes('ENOTFOUND')) {
      return {
        title: "Website Unreachable",
        message: "We couldn't load this website. It may be down or blocking automated scans.",
        icon: <Globe className="h-12 w-12 text-amber-500" />,
        action: "Try opening the website manually to check if it's accessible."
      };
    }
    if (error.includes('window') || error.includes('document')) {
      return {
        title: "Website Cannot Be Scanned Automatically",
        message: "This website uses advanced bot protection (like Cloudflare) or requires JavaScript to render.",
        icon: <Lock className="h-12 w-12 text-amber-500" />,
        action: "Try opening the website manually in a new tab."
      };
    }
    return {
      title: "Scan Failed",
      message: error || "We couldn't complete the accessibility scan for this website.",
      icon: <AlertTriangle className="h-12 w-12 text-amber-500" />,
      action: "This could be due to temporary issues."
    };
  };

  const errorInfo = scanError ? getErrorMessage(scanError) : null;

  // Mobile action buttons component
  const MobileActionButtons = () => (
    <div className="flex flex-col gap-2 w-full">
      <ShareReport auditId={id} />
      <StandardsSelector 
        selectedStandards={selectedStandards}
        onStandardsChange={setSelectedStandards}
        disabled={scanError}
      />
      {!scanError && (
        <>
          <ExecutivePDF auditId={id} auditData={audit} />
          <ReportExport auditId={id} auditData={audit} />
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-4 md:py-8 px-3 md:px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header with back button and responsive actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/history")}
            className="gap-2 text-[#475569] hover:text-[#334155] w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm md:text-base">Back to History</span>
          </Button>
          
          {/* Desktop action buttons */}
          {!isMobile && (
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <ShareReport auditId={id} />
              <StandardsSelector 
                selectedStandards={selectedStandards}
                onStandardsChange={setSelectedStandards}
                disabled={scanError}
              />
              {!scanError && (
                <>
                  <ExecutivePDF auditId={id} auditData={audit} />
                  <ReportExport auditId={id} auditData={audit} />
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 w-fit">
                  <Menu className="w-4 h-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2">
                  <MobileActionButtons />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Loading Bar */}
        {showLoading && (
          <LoadingBar 
            duration={2}
            color="from-[#334155] to-[#5b6e8c]"
            onComplete={() => console.log('Loading complete')}
          />
        )}

        {/* Main Content */}
        <div className="audit-report-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column - Score and Summary */}
            <div className="space-y-4 md:space-y-6">
              {/* Score Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-[#e2e8f0] bg-[#f8fafc]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    {scanError ? (
                      <div className="text-center py-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                          {errorInfo?.icon}
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-[#111827] mb-2">
                          {errorInfo?.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[#475569] mb-4">
                          {errorInfo?.message}
                        </p>
                        <div className="bg-amber-50 p-3 md:p-4 rounded-lg text-left">
                          <p className="text-xs md:text-sm text-amber-800 flex items-start gap-2">
                            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{errorInfo?.action}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ScoreGauge score={audit.score} size={isMobile ? 120 : 160} />
                        
                        <div className="text-center mt-4">
                          <p className="text-xs md:text-sm text-[#475569]">
                            Based on {selectedStandards.length} compliance standards
                          </p>
                          
                          {/* Professional Score Message */}
                          <div className="mt-3 p-3 bg-white rounded-lg border border-[#e2e8f0]">
                            <Badge className={`mb-2 ${getScoreInfo(audit.score).color} bg-opacity-10`}>
                              {getScoreInfo(audit.score).badge}
                            </Badge>
                            <p className="text-xs md:text-sm text-[#111827]">
                              {getScoreInfo(audit.score).message}
                            </p>
                          </div>
                          
                          {/* Standards badges */}
                          <div className="flex flex-wrap gap-1 justify-center mt-2">
                            {selectedStandards.map(standard => (
                              <Badge key={standard} variant="outline" className="text-[10px] md:text-xs bg-white text-[#475569] border-[#e2e8f0]">
                                {standard.replace('wcag2', 'WCAG ').replace('aa', 'AA').replace('aaa', 'AAA').toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats grid - Keep severity colors separate */}
                        <div className="w-full grid grid-cols-2 gap-2 md:gap-3 mt-4 md:mt-6">
                          <div className="p-2 md:p-3 bg-red-50 rounded-lg text-center">
                            <p className="text-[10px] md:text-xs text-red-600">CRITICAL</p>
                            <p className="text-base md:text-xl font-bold text-red-700">{criticalCount}</p>
                          </div>
                          <div className="p-2 md:p-3 bg-orange-50 rounded-lg text-center">
                            <p className="text-[10px] md:text-xs text-orange-600">SERIOUS</p>
                            <p className="text-base md:text-xl font-bold text-orange-700">{seriousCount}</p>
                          </div>
                          <div className="p-2 md:p-3 bg-yellow-50 rounded-lg text-center">
                            <p className="text-[10px] md:text-xs text-yellow-600">MODERATE</p>
                            <p className="text-base md:text-xl font-bold text-yellow-700">{moderateCount}</p>
                          </div>
                          <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-[10px] md:text-xs text-blue-600">MINOR</p>
                            <p className="text-base md:text-xl font-bold text-blue-700">{minorCount}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="w-full mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#e2e8f0]">
                      <p className="text-xs md:text-sm text-[#111827] font-medium">Audited on</p>
                      <p className="text-xs md:text-sm text-[#475569]">
                        {audit.createdAt ? format(new Date(audit.createdAt), "dd/MM/yyyy 'at' h:mm a") : 'Date not available'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benchmark Comparison */}
              {!scanError && (
                <BenchmarkComparison url={audit.url} score={audit.score} />
              )}
            </div>

            {/* Right Column - Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue={scanError ? "preview" : "issues"} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-[#f1f5f9] flex flex-wrap h-auto">
                    <TabsTrigger 
                      value="issues" 
                      className="data-[state=active]:bg-white text-[#475569] data-[state=active]:text-[#111827] text-xs md:text-sm px-2 md:px-3"
                      disabled={scanError}
                    >
                      Issues {!scanError && `(${violations.length})`}
                    </TabsTrigger>
                    <TabsTrigger value="roadmap" className="data-[state=active]:bg-white text-[#475569] data-[state=active]:text-[#111827] text-xs md:text-sm px-2 md:px-3">
                      Roadmap
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="data-[state=active]:bg-white text-[#475569] data-[state=active]:text-[#111827] text-xs md:text-sm px-2 md:px-3">
                      Manual
                    </TabsTrigger>
                    <TabsTrigger value="vision" className="data-[state=active]:bg-white text-[#475569] data-[state=active]:text-[#111827] text-xs md:text-sm px-2 md:px-3">
                      👁️ AI Vision
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="data-[state=active]:bg-white text-[#475569] data-[state=active]:text-[#111827] text-xs md:text-sm px-2 md:px-3">
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="issues" className="space-y-4 mt-0">
                  {scanError ? (
                    <div className="text-center py-8 md:py-12 bg-white rounded-xl border border-[#e2e8f0] px-4">
                      <Lock className="h-10 w-10 md:h-12 md:w-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-lg md:text-xl font-semibold text-[#111827] mb-2">
                        No Issues Available
                      </h3>
                      <p className="text-sm md:text-base text-[#475569] max-w-md mx-auto">
                        The scan could not be completed due to website restrictions.
                      </p>
                    </div>
                  ) : violations.length > 0 ? (
                    violations.map((violation: any, index: number) => (
                      <IssueCard key={index} issue={violation} />
                    ))
                  ) : (
                    <div className="text-center py-8 md:py-12 bg-white rounded-xl border border-[#e2e8f0] px-4">
                      <Shield className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg md:text-xl font-semibold text-[#111827] mb-2">
                        No accessibility issues found!
                      </h3>
                      <p className="text-sm md:text-base text-[#475569]">
                        This website passes all selected compliance standards.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="roadmap" className="space-y-4 mt-0">
                  {scanError ? (
                    <div className="text-center py-8 md:py-12 bg-white rounded-xl border border-[#e2e8f0] px-4">
                      <Lock className="h-10 w-10 md:h-12 md:w-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-lg md:text-xl font-semibold text-[#111827] mb-2">
                        Roadmap Unavailable
                      </h3>
                      <p className="text-sm md:text-base text-[#475569]">
                        Cannot generate remediation roadmap because the scan failed.
                      </p>
                    </div>
                  ) : (
                    <RemediationRoadmap violations={violations} />
                  )}
                </TabsContent>

                <TabsContent value="manual" className="mt-4">
                  <ManualTesting />
                </TabsContent>

                <TabsContent value="vision" className="space-y-4 mt-4">
                  <VisionScanToggle 
                    url={audit.url}
                    onScanComplete={(issues) => {
                      setVisionIssues(issues);
                      setShowVisionIssues(true);
                    }}
                  />
                  
                  {showVisionIssues && visionIssues.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-[#111827]">Visual Issues Detected ({visionIssues.length})</h3>
                      {visionIssues.map((issue, idx) => (
                        <div key={idx} className="p-4 border border-[#e2e8f0] rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              issue.impact === 'critical' ? 'bg-red-100 text-red-700' :
                              issue.impact === 'serious' ? 'bg-orange-100 text-orange-700' :
                              issue.impact === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {issue.impact}
                            </span>
                            <span className="text-sm font-medium text-[#111827]">{issue.help}</span>
                          </div>
                          <p className="text-sm text-[#475569]">{issue.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showVisionIssues && visionIssues.length === 0 && (
                    <div className="text-center py-8 text-[#64748b]">
                      <p>No visual issues detected by AI.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <VisualPreview url={audit.url} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}