import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, HelpCircle, AlertTriangle, AlertCircle, Info, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeSnippet } from "./CodeSnippet";
import { getEffortForRule } from "@/data/remediation/remediation-data";
// ✅ Changed: AIAgentButton removed, AIFixButton added
import { AIFixButton } from "./AIFixButton";

interface IssueNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

interface Issue {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: IssueNode[];
}

interface IssueCardProps {
  issue: Issue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);
  
  const effort = getEffortForRule(issue.id);

  const impactColors = {
    critical: "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800",
    serious: "bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 border-orange-200 dark:border-orange-800",
    moderate: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800",
    minor: "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800",
  };

  const ImpactIcon = {
    critical: AlertCircle,
    serious: AlertTriangle,
    moderate: HelpCircle,
    minor: Info,
  }[issue.impact as keyof typeof impactColors] || Info;

  const getEffortColor = (effortLevel: string) => {
    switch (effortLevel) {
      case 'quick': return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group rounded-xl border bg-white dark:bg-[#1e293b] transition-all duration-200 ${
        isExpanded ? "ring-2 ring-[#2563eb]/10 dark:ring-[#7c3aed]/10 shadow-lg" : "hover:border-[#2563eb]/30 dark:hover:border-[#7c3aed]/30 hover:shadow-md"
      }`}
    >
      <div 
        className="p-3 md:p-4 cursor-pointer flex items-start gap-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`mt-1 p-1.5 md:p-2 rounded-full flex-shrink-0 ${impactColors[issue.impact as keyof typeof impactColors]}`}>
          <ImpactIcon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="font-semibold text-[#0f172a] dark:text-white text-sm md:text-base leading-tight">
            {issue.help}
          </h4>
          
          <p className="text-[#475569] dark:text-[#94a3b8] text-xs md:text-sm line-clamp-1 group-hover:line-clamp-none transition-all">
            {issue.description}
          </p>
          
          {/* Badges Row - Responsive - AIAgentButton replaced with AIFixButton */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* ✅ Changed: AIAgentButton removed, AIFixButton added */}
            <AIFixButton issue={issue} />
            
            <Badge variant="outline" className={`capitalize font-medium text-xs ${impactColors[issue.impact as keyof typeof impactColors]}`}>
              {issue.impact}
            </Badge>
            
            <Badge variant="outline" className={`text-xs ${getEffortColor(effort.level)}`}>
              {effort.icon} {effort.timeDisplay}
            </Badge>
            
            <Badge variant="secondary" className="text-xs text-[#475569] dark:text-[#94a3b8] bg-[#f1f5f9] dark:bg-[#334155]">
              {issue.nodes.length} {issue.nodes.length === 1 ? 'Elem' : 'Elems'}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowCode(!showCode);
              }}
              className="text-xs gap-1 text-[#2563eb] dark:text-[#7c3aed] hover:bg-[#2563eb]/10 dark:hover:bg-[#7c3aed]/10 h-7 px-2"
            >
              <Code className="w-3 h-3" />
              {showCode ? 'Hide' : 'Show'} Fix
            </Button>
            
            {isExpanded ? 
              <ChevronUp className="w-4 h-4 text-[#64748b] ml-auto" /> : 
              <ChevronDown className="w-4 h-4 text-[#64748b] ml-auto" />
            }
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 md:px-6 pb-4 md:pb-6 pt-0 space-y-4 md:space-y-6">
              <div className="h-px w-full bg-[#e2e8f0] dark:bg-[#334155]" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <h5 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                    About this issue
                  </h5>
                  <p className="text-xs md:text-sm text-[#0f172a] dark:text-white/80 leading-relaxed">
                    {issue.description}
                  </p>
                  <Button variant="outline" className="px-0 text-[#2563eb] dark:text-[#7c3aed] h-auto border-none hover:bg-transparent text-xs md:text-sm" asChild>
                    <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Learn more
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <h5 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                    Affected Elements
                  </h5>
                  <div className="bg-[#f8fafc] dark:bg-[#0f172a] rounded-lg border border-[#e2e8f0] dark:border-[#334155] overflow-hidden">
                    {issue.nodes.slice(0, 3).map((node, i) => (
                      <div key={i} className="p-2 md:p-3 border-b border-[#e2e8f0] dark:border-[#334155] last:border-0 text-xs font-mono break-all hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] transition-colors text-[#0f172a] dark:text-white">
                        {node.html}
                      </div>
                    ))}
                    {issue.nodes.length > 3 && (
                      <div className="p-2 text-center text-xs text-[#64748b] dark:text-[#94a3b8] bg-[#f1f5f9] dark:bg-[#1e293b]">
                        + {issue.nodes.length - 3} more elements
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Code Snippet Section */}
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CodeSnippet 
                    ruleId={issue.id} 
                    violation={issue}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}