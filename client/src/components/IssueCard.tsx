import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, HelpCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function IssueCard({ issue }: { issue: Issue }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const impactColors = {
    critical: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
    serious: "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200",
    moderate: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
    minor: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  };

  const ImpactIcon = {
    critical: AlertCircle,
    serious: AlertTriangle,
    moderate: HelpCircle,
    minor: Info,
  }[issue.impact as keyof typeof impactColors] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group rounded-xl border bg-card transition-all duration-200 ${
        isExpanded ? "ring-2 ring-primary/5 shadow-lg" : "hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div 
        className="p-4 cursor-pointer flex items-start gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`mt-1 p-2 rounded-full ${impactColors[issue.impact as keyof typeof impactColors]}`}>
          <ImpactIcon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground text-lg leading-tight">{issue.help}</h4>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`capitalize font-medium ${impactColors[issue.impact as keyof typeof impactColors]}`}>
                {issue.impact}
              </Badge>
              <Badge variant="secondary" className="text-muted-foreground">
                {issue.nodes.length} {issue.nodes.length === 1 ? 'Element' : 'Elements'}
              </Badge>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-1 group-hover:line-clamp-none transition-all">
            {issue.description}
          </p>
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
            <div className="px-6 pb-6 pt-0 space-y-6">
              <div className="h-px w-full bg-border" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About this issue</h5>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {issue.description}. This violation affects accessibility by preventing users from properly perceiving or interacting with the content.
                  </p>
                  <Button variant="link" className="px-0 text-primary h-auto" asChild>
                    <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Learn how to fix this on Deque University <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
                
                <div className="space-y-3">
                   <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Affected Elements</h5>
                   <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                     {issue.nodes.slice(0, 5).map((node, i) => (
                       <div key={i} className="p-3 border-b border-border last:border-0 text-xs font-mono break-all hover:bg-muted/50 transition-colors">
                         {node.html}
                       </div>
                     ))}
                     {issue.nodes.length > 5 && (
                       <div className="p-2 text-center text-xs text-muted-foreground bg-muted/50">
                         And {issue.nodes.length - 5} more elements...
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
