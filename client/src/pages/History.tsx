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
      className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 mb-3 cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            audit.score >= 90 ? "bg-emerald-500/20 text-emerald-400" :
            audit.score >= 70 ? "bg-blue-500/20 text-blue-400" :
            audit.score >= 50 ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400"
          }`}>
            {audit.score}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate text-white">{audit.url}</p>
            <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(audit.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
        <Badge className={`${getScoreColor(audit.score)} text-white text-xs`}>
          {audit.score}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <TrendingUp className="w-3 h-3" />
          <span>{getIssueCount(audit)} issues</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-white/70 hover:text-white">
          View Details →
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f16] via-[#0f172a] to-[#1a1f2e] py-4 md:py-8 px-3 md:px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Audit History
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-1">
              View and analyze your past accessibility scans
            </p>
          </div>
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "trends")}>
            <TabsList className="bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="list" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
                <span>📋</span>
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-white/50">Total Scans</p>
              <p className="text-lg md:text-2xl font-bold text-white">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : totalScans}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-white/50">Avg Score</p>
              <p className="text-lg md:text-2xl font-bold text-white">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : averageScore.toFixed(1)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-white/50">Best Score</p>
              <p className="text-lg md:text-2xl font-bold text-emerald-400">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : bestScore}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-white/50">Issues Found</p>
              <p className="text-lg md:text-2xl font-bold text-white">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                  audits?.reduce((sum, a) => sum + (a.summary?.total || 0), 0) || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search by URL..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-10 md:h-12 text-sm w-full bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-white/40 hover:text-red-400" />
              </button>
            )}
          </div>
          
          {isMobile && (
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="gap-2 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.keys(filters).filter(k => 
                k !== 'search' && filters[k as keyof FilterOptions] !== null && 
                filters[k as keyof FilterOptions] !== '' && 
                !(Array.isArray(filters[k as keyof FilterOptions]) && (filters[k as keyof FilterOptions] as any[]).length === 0)
              ).length > 0 && (
                <Badge className="ml-1 bg-white/20 text-white text-xs">
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
              <Card className="border-white/20 bg-white/10 backdrop-blur-md">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-white/60" />
                      <p className="text-white/50">Loading history...</p>
                    </div>
                  ) : filteredAudits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-white/10">
                            <TableHead className="text-white/50">Website URL</TableHead>
                            <TableHead className="text-white/50">Score</TableHead>
                            <TableHead className="text-white/50">Issues</TableHead>
                            <TableHead className="text-white/50">Date</TableHead>
                            <TableHead className="text-right text-white/50">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAudits.map((audit) => (
                            <TableRow 
                              key={audit.id} 
                              className="cursor-pointer hover:bg-white/5 border-b border-white/10"
                              onClick={() => setLocation(`/audit/${audit.id}`)}
                            >
                              <TableCell className="font-medium max-w-[300px] truncate">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-white/40 flex-shrink-0" />
                                  <span className="truncate text-white/80">{audit.url}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getScoreColor(audit.score)}>
                                  {audit.score}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white/60">
                                {getIssueCount(audit)} issues
                              </TableCell>
                              <TableCell className="text-white/50">
                                {format(new Date(audit.createdAt), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
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
                      <p className="text-white/50">No audits found.</p>
                      <Button onClick={() => setLocation("/")} className="bg-white text-[#1e293b] hover:bg-white/90">Run your first scan</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-white/60" />
                  <p className="text-white/50">Loading history...</p>
                </div>
              ) : filteredAudits.length > 0 ? (
                filteredAudits.map((audit) => (
                  <AuditMobileCard key={audit.id} audit={audit} />
                ))
              ) : (
                <div className="text-center py-12 space-y-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
                  <p className="text-white/50">No audits found.</p>
                  <Button onClick={() => setLocation("/")} className="w-full sm:w-auto bg-white text-[#1e293b] hover:bg-white/90">
                    Run your first scan
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-4 text-xs md:text-sm text-white/40 text-right">
          Showing {filteredAudits.length} of {audits?.length || 0} audits
        </div>
      </div>
    </div>
  );
}