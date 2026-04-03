import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuditFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalAudits: number;
}

export interface FilterOptions {
  search: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  scoreRange: [number, number];
  severity: ('critical' | 'serious' | 'moderate' | 'minor')[];
  hasIssues: boolean | null;
}

export function AuditFilters({ onFilterChange, totalAudits }: AuditFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    scoreRange: [0, 100],
    severity: [],
    hasIssues: null
  });

  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...tempFilters, ...newFilters };
    setTempFilters(updated);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    onFilterChange(tempFilters);
    if (!isDesktop) {
      setIsExpanded(false);
    }
  };

  const clearFilters = () => {
    const cleared = {
      search: '',
      dateRange: 'all' as const,
      scoreRange: [0, 100] as [number, number],
      severity: [],
      hasIssues: null
    };
    setTempFilters(cleared);
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) count++;
    if (filters.severity.length > 0) count++;
    if (filters.hasIssues !== null) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  const severityOptions = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500', textColor: 'text-white' },
    { value: 'serious', label: 'Serious', color: 'bg-orange-500', textColor: 'text-white' },
    { value: 'moderate', label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-black' },
    { value: 'minor', label: 'Minor', color: 'bg-blue-500', textColor: 'text-white' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' }
  ];

  return (
    <Card className="border-white/20 bg-white/10 backdrop-blur-md">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-white/50" />
            <h3 className="font-medium text-sm text-white/80">Filters</h3>
            {activeCount > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white/80 border-none">
                {activeCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
              >
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 md:hidden"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search by URL..."
              value={tempFilters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-9 pr-8 h-10 text-sm w-full bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
            />
            {tempFilters.search && (
              <button
                onClick={() => updateFilters({ search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-white/40 hover:text-red-400" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {(isExpanded || isDesktop) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {/* Date Range */}
                <div>
                  <label className="text-xs font-medium text-white/50 mb-2 block">
                    Date Range
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
                    {dateOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={tempFilters.dateRange === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilters({ dateRange: option.value as any })}
                        className={`whitespace-nowrap flex-shrink-0 ${
                          tempFilters.dateRange === option.value
                            ? 'bg-white text-[#1e293b] hover:bg-white/90'
                            : 'border-white/20 bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Score Range */}
                <div>
                  <label className="text-xs font-medium text-white/50 mb-2 block">
                    Score Range: {tempFilters.scoreRange[0]} - {tempFilters.scoreRange[1]}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempFilters.scoreRange[0]}
                      onChange={(e) => updateFilters({ 
                        scoreRange: [parseInt(e.target.value), tempFilters.scoreRange[1]] 
                      })}
                      className="flex-1 accent-white/60"
                    />
                    <span className="text-sm text-white/50">to</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempFilters.scoreRange[1]}
                      onChange={(e) => updateFilters({ 
                        scoreRange: [tempFilters.scoreRange[0], parseInt(e.target.value)] 
                      })}
                      className="flex-1 accent-white/60"
                    />
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="text-xs font-medium text-white/50 mb-2 block">
                    Severity
                  </label>
                  <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
                    {severityOptions.map(option => (
                      <Button
                        key={option.value}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSeverity = tempFilters.severity.includes(option.value as any)
                            ? tempFilters.severity.filter(s => s !== option.value)
                            : [...tempFilters.severity, option.value as any];
                          updateFilters({ severity: newSeverity });
                        }}
                        className={`flex items-center gap-2 ${
                          tempFilters.severity.includes(option.value as any)
                            ? `${option.color} ${option.textColor} border-none`
                            : 'border-white/20 bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${option.color}`} />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Has Issues Toggle */}
                <div>
                  <label className="text-xs font-medium text-white/50 mb-2 block">
                    Issues
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={tempFilters.hasIssues === true ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilters({ hasIssues: true })}
                      className={
                        tempFilters.hasIssues === true 
                          ? 'bg-white text-[#1e293b] hover:bg-white/90' 
                          : 'border-white/20 bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                      }
                    >
                      Has Issues
                    </Button>
                    <Button
                      variant={tempFilters.hasIssues === false ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilters({ hasIssues: false })}
                      className={
                        tempFilters.hasIssues === false 
                          ? 'bg-white text-[#1e293b] hover:bg-white/90' 
                          : 'border-white/20 bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                      }
                    >
                      No Issues
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    className="flex-1 bg-white text-[#1e293b] hover:bg-white/90"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 bg-transparent text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      setTempFilters(filters);
                      if (!isDesktop) setIsExpanded(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-white/10">
            {filters.search && (
              <Badge variant="secondary" className="bg-white/20 text-white/80 gap-1 border-none">
                Search: {filters.search}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" 
                  onClick={() => {
                    const cleared = { ...filters, search: '' };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            )}
            {filters.dateRange !== 'all' && (
              <Badge variant="secondary" className="bg-white/20 text-white/80 gap-1 border-none">
                {dateOptions.find(d => d.value === filters.dateRange)?.label}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                  onClick={() => {
                    const cleared = { ...filters, dateRange: 'all' };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            )}
            {(filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) && (
              <Badge variant="secondary" className="bg-white/20 text-white/80 gap-1 border-none">
                Score: {filters.scoreRange[0]}-{filters.scoreRange[1]}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                  onClick={() => {
                    const cleared = { ...filters, scoreRange: [0, 100] };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            )}
            {filters.severity.map(sev => (
              <Badge key={sev} variant="secondary" className="bg-white/20 text-white/80 gap-1 border-none">
                {sev}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                  onClick={() => {
                    const cleared = { 
                      ...filters, 
                      severity: filters.severity.filter(s => s !== sev) 
                    };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            ))}
            {filters.hasIssues !== null && (
              <Badge variant="secondary" className="bg-white/20 text-white/80 gap-1 border-none">
                {filters.hasIssues ? 'Has Issues' : 'No Issues'}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                  onClick={() => {
                    const cleared = { ...filters, hasIssues: null };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-xs text-white/40 text-right">
          Showing {totalAudits} audits
        </div>
      </CardContent>
    </Card>
  );
}