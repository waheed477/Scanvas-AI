import { useState } from "react";
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
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    scoreRange: [0, 100],
    severity: [],
    hasIssues: null
  });

  const [tempFilters, setTempFilters] = useState(filters);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...tempFilters, ...newFilters };
    setTempFilters(updated);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    onFilterChange(tempFilters);
    if (window.innerWidth < 768) {
      setIsExpanded(false); // Auto-collapse on mobile after apply
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

  // Severity options with colors
  const severityOptions = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500', textColor: 'text-white' },
    { value: 'serious', label: 'Serious', color: 'bg-orange-500', textColor: 'text-white' },
    { value: 'moderate', label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-black' },
    { value: 'minor', label: 'Minor', color: 'bg-blue-500', textColor: 'text-white' }
  ];

  // Date range options
  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' }
  ];

  return (
    <Card className="border-[#e2e8f0] dark:border-[#334155]">
      <CardContent className="p-4">
        {/* Header - Always visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#64748b]" />
            <h3 className="font-medium text-sm">Filters</h3>
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-2">
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
                className="h-8 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
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

        {/* Mobile Search Bar - Always visible */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <Input
              placeholder="Search by URL..."
              value={tempFilters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-9 pr-8 h-10 text-sm w-full"
            />
            {tempFilters.search && (
              <button
                onClick={() => updateFilters({ search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-[#64748b] hover:text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {(isExpanded || window.innerWidth >= 768) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {/* Date Range - Horizontal Scroll on Mobile */}
                <div>
                  <label className="text-xs font-medium text-[#64748b] mb-2 block">
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
                            ? 'bg-[#2563eb] text-white'
                            : ''
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Score Range - Responsive Sliders */}
                <div>
                  <label className="text-xs font-medium text-[#64748b] mb-2 block">
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
                      className="flex-1"
                    />
                    <span className="text-sm text-[#475569] dark:text-[#94a3b8]">to</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempFilters.scoreRange[1]}
                      onChange={(e) => updateFilters({ 
                        scoreRange: [tempFilters.scoreRange[0], parseInt(e.target.value)] 
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Severity - Grid layout for mobile */}
                <div>
                  <label className="text-xs font-medium text-[#64748b] mb-2 block">
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
                            ? option.color + ' ' + option.textColor
                            : ''
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
                  <label className="text-xs font-medium text-[#64748b] mb-2 block">
                    Issues
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={tempFilters.hasIssues === true ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilters({ hasIssues: true })}
                      className={tempFilters.hasIssues === true ? 'bg-[#2563eb] text-white' : ''}
                    >
                      Has Issues
                    </Button>
                    <Button
                      variant={tempFilters.hasIssues === false ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilters({ hasIssues: false })}
                      className={tempFilters.hasIssues === false ? 'bg-[#2563eb] text-white' : ''}
                    >
                      No Issues
                    </Button>
                  </div>
                </div>

                {/* Action Buttons - Stack on mobile */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setTempFilters(filters);
                      if (window.innerWidth < 768) setIsExpanded(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display - Responsive wrap */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-[#e2e8f0] dark:border-[#334155]">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500" 
                  onClick={() => {
                    const cleared = { ...filters, search: '' };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            )}
            {filters.dateRange !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {dateOptions.find(d => d.value === filters.dateRange)?.label}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    const cleared = { ...filters, dateRange: 'all' };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            )}
            {(filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) && (
              <Badge variant="secondary" className="gap-1">
                Score: {filters.scoreRange[0]}-{filters.scoreRange[1]}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    const cleared = { ...filters, scoreRange: [0, 100] };
                    setFilters(cleared);
                    onFilterChange(cleared);
                  }}
                />
              </Badge>
            )}
            {filters.severity.map(sev => (
              <Badge key={sev} variant="secondary" className="gap-1">
                {sev}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
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
              <Badge variant="secondary" className="gap-1">
                {filters.hasIssues ? 'Has Issues' : 'No Issues'}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
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
        <div className="mt-4 text-xs text-[#64748b] text-right">
          Showing {totalAudits} audits
        </div>
      </CardContent>
    </Card>
  );
}