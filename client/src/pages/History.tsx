import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api } from "@shared/routes";
import { format } from "date-fns";
import { Search, Loader2, Clock, Globe, TrendingUp, Calendar, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Audit, AuditSummary } from "@shared/schema";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendsChart } from "@/components/TrendsChart";
import { AuditFilters, FilterOptions } from "@/components/AuditFilters";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "trends">("list");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [, setLocation] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    scoreRange: [0, 100],
    severity: [],
    hasIssues: null
  });

  const { data: audits, isLoading } = useQuery<Audit[]>({
    queryKey: ['audits'],
    queryFn: async () => {
      console.log('Fetching audits...');
      const data = await api.get(api.audits.list);
      console.log('Audits fetched:', data);
      return data || [];
    },
  });

  // Filter audits based on criteria
  const filteredAudits = useMemo(() => {
    if (!audits) return [];
    
    return audits.filter(audit => {
      if (filters.search && !audit.url.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      if (filters.dateRange !== 'all') {
        const auditDate = new Date(audit.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - auditDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (filters.dateRange === 'today' && daysDiff > 1) return false;
        if (filters.dateRange === 'week' && daysDiff > 7) return false;
        if (filters.dateRange === 'month' && daysDiff > 30) return false;
      }
      
      if (audit.score < filters.scoreRange[0] || audit.score > filters.scoreRange[1]) {
        return false;
      }
      
      if (filters.hasIssues !== null) {
        const hasIssues = (audit.summary?.total || 0) > 0;
        if (filters.hasIssues !== hasIssues) return false;
      }
      
      return true;
    });
  }, [audits, filters]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500 text-black";
    return "bg-red-500";
  };

  const getIssueCount = (audit: Audit): number => {
    const summary = audit.summary as AuditSummary;
    return summary?.total || 0;
  };

  const totalScans = audits?.length || 0;
  const averageScore = audits?.reduce((acc, curr) => acc + curr.score, 0) / totalScans || 0;
  const bestScore = audits?.reduce((max, curr) => Math.max(max, curr.score), 0) || 0;

  const AuditMobileCard = ({ audit }: { audit: Audit }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setLocation(`/audit/${audit.id}`)}
      className="bg-white/90 backdrop-blur-sm rounded-lg border border-[#e2e8f0] p-4 mb-3 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            audit.score >= 90 ? "bg-emerald-100 text-emerald-700" :
            audit.score >= 70 ? "bg-blue-100 text-blue-700" :
            audit.score >= 50 ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          }`}>
            {audit.score}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate text-[#111827]">{audit.url}</p>
            <div className="flex items-center gap-2 text-xs text-[#64748b] mt-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(audit.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
        <Badge className={`${getScoreColor(audit.score)} text-white text-xs`}>
          {audit.score}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e2e8f0]">
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <TrendingUp className="w-3 h-3" />
          <span>{getIssueCount(audit)} issues</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-[#334155]">
          View Details →
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Professional Background - Abstract Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fafbfd] to-[#f5f7fa]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-l from-[#334155]/10 to-[#5b6e8c]/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-[#64748b]/10 to-[#334155]/10 rounded-full blur-3xl animate-float" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23334155\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
        {/* Floating Dots */}
        <div className="absolute top-1/3 left-10 w-1.5 h-1.5 bg-[#334155]/20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-20 w-2 h-2 bg-[#5b6e8c]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#64748b]/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Wave Border */}
        <svg className="absolute bottom-0 left-0 w-full h-32 opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 120">
          <path fill="#334155" fillOpacity="0.1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,58.7C672,64,768,96,864,101.3C960,107,1056,85,1152,74.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>

      <div className="container max-w-6xl mx-auto py-4 md:py-8 px-3 md:px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#111827] to-[#334155] bg-clip-text text-transparent">
              Audit History
            </h1>
            <p className="text-sm md:text-base text-[#475569] mt-1">
              View and analyze your past accessibility scans
            </p>
          </div>
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "trends")}>
            <TabsList className="bg-[#f1f5f9]">
              <TabsTrigger value="list" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 data-[state=active]:bg-white">
                <span>📋</span>
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 data-[state=active]:bg-white">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-[#e2e8f0]">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-[#64748b]">Total Scans</p>
              <p className="text-lg md:text-2xl font-bold text-[#111827]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : totalScans}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-[#e2e8f0]">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-[#64748b]">Avg Score</p>
              <p className="text-lg md:text-2xl font-bold text-[#111827]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : averageScore.toFixed(1)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-[#e2e8f0]">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-[#64748b]">Best Score</p>
              <p className="text-lg md:text-2xl font-bold text-emerald-600">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : bestScore}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-[#e2e8f0]">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-[#64748b]">Issues Found</p>
              <p className="text-lg md:text-2xl font-bold text-[#111827]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                  audits?.reduce((sum, a) => sum + (a.summary?.total || 0), 0) || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rest of the component remains the same */}
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <Input
              placeholder="Search by URL..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-10 md:h-12 text-sm w-full bg-white/90 backdrop-blur-sm border-[#e2e8f0]"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-[#64748b] hover:text-red-500" />
              </button>
            )}
          </div>
          
          {isMobile && (
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="gap-2 bg-white/80 backdrop-blur-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.keys(filters).filter(k => 
                k !== 'search' && filters[k as keyof FilterOptions] !== null && 
                filters[k as keyof FilterOptions] !== '' && 
                !(Array.isArray(filters[k as keyof FilterOptions]) && (filters[k as keyof FilterOptions] as any[]).length === 0)
              ).length > 0 && (
                <Badge className="ml-1 bg-[#334155] text-white text-xs">
                  {Object.keys(filters).filter(k => 
                    k !== 'search' && filters[k as keyof FilterOptions] !== null && 
                    filters[k as keyof FilterOptions] !== '' && 
                    !(Array.isArray(filters[k as keyof FilterOptions]) && (filters[k as keyof FilterOptions] as any[]).length === 0)
                  ).length}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {(!isMobile || mobileFiltersOpen) && (
          <div className="mb-6">
            <AuditFilters 
              onFilterChange={setFilters}
              totalAudits={filteredAudits.length}
            />
          </div>
        )}

        {/* Content Area */}
        {viewMode === "trends" ? (
          <TrendsChart audits={filteredAudits} />
        ) : (
          <>
            <div className="hidden md:block">
              <Card className="border-[#e2e8f0] bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-[#334155]" />
                      <p className="text-[#475569]">Loading history...</p>
                    </div>
                  ) : filteredAudits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-[#e2e8f0]">
                            <TableHead className="text-[#64748b]">Website URL</TableHead>
                            <TableHead className="text-[#64748b]">Score</TableHead>
                            <TableHead className="text-[#64748b]">Issues</TableHead>
                            <TableHead className="text-[#64748b]">Date</TableHead>
                            <TableHead className="text-right text-[#64748b]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAudits.map((audit) => (
                            <TableRow 
                              key={audit.id} 
                              className="cursor-pointer hover:bg-[#f8fafc]/80 border-b border-[#e2e8f0]"
                              onClick={() => setLocation(`/audit/${audit.id}`)}
                            >
                              <TableCell className="font-medium max-w-[300px] truncate">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-[#334155] flex-shrink-0" />
                                  <span className="truncate text-[#111827]">{audit.url}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getScoreColor(audit.score)}>
                                  {audit.score}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-[#475569]">
                                {getIssueCount(audit)} issues
                              </TableCell>
                              <TableCell className="text-[#64748b]">
                                {format(new Date(audit.createdAt), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-[#334155]">
                                  View Report →
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <p className="text-[#475569]">No audits found.</p>
                      <Button onClick={() => setLocation("/")} className="bg-[#334155] text-white hover:bg-[#5b6e8c]">Run your first scan</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-[#334155]" />
                  <p className="text-[#475569]">Loading history...</p>
                </div>
              ) : filteredAudits.length > 0 ? (
                filteredAudits.map((audit) => (
                  <AuditMobileCard key={audit.id} audit={audit} />
                ))
              ) : (
                <div className="text-center py-12 space-y-4 bg-white/80 backdrop-blur-sm rounded-lg border border-[#e2e8f0] p-8">
                  <p className="text-[#475569]">No audits found.</p>
                  <Button onClick={() => setLocation("/")} className="w-full sm:w-auto bg-[#334155] text-white hover:bg-[#5b6e8c]">
                    Run your first scan
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-4 text-xs md:text-sm text-[#64748b] text-right">
          Showing {filteredAudits.length} of {audits?.length || 0} audits
        </div>
      </div>
    </div>
  );
}