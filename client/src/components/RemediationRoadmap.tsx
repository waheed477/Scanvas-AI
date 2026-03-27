import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Calendar,
  Zap,
  TrendingUp,
  ListChecks,
  Target
} from "lucide-react";
import { generateRemediationRoadmap, RemediationStep, FixEffort } from "@/data/remediation/remediation-data";
import { motion, AnimatePresence } from "framer-motion";

interface RemediationRoadmapProps {
  violations: any[];
}

export function RemediationRoadmap({ violations }: RemediationRoadmapProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>('phase1');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const roadmap = generateRemediationRoadmap(violations);
  
  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };
  
  // Function to get color based on effort level for visual indication
  const getEffortColor = (effort: FixEffort) => {
    switch (effort.level) {
      case 'quick': return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };
  
  const progress = (completedSteps.length / roadmap.steps.length) * 100;
  
  if (violations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">
            No Issues Found!
          </h3>
          <p className="text-[#475569] dark:text-[#94a3b8]">
            Your website already meets accessibility standards.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2563eb]/10 rounded-lg">
                <ListChecks className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-sm text-[#64748b]">Total Issues</p>
                <p className="text-2xl font-bold text-[#0f172a] dark:text-white">
                  {roadmap.summary.totalSteps}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-[#64748b]">Critical Issues</p>
                <p className="text-2xl font-bold text-orange-500">
                  {roadmap.summary.criticalIssues}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-[#64748b]">Quick Fixes</p>
                <p className="text-2xl font-bold text-green-500">
                  {roadmap.summary.quickFixes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total time estimate card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-[#64748b]">Total Time</p>
                <p className="text-lg font-bold text-[#0f172a] dark:text-white">
                  {roadmap.summary.totalTimeDisplay}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0f172a] dark:text-white">
              Overall Progress
            </span>
            <span className="text-sm text-[#64748b]">
              {completedSteps.length}/{roadmap.steps.length} completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
      
      {/* Phases Tabs - Mobile responsive grid layout */}
      <Tabs defaultValue="phase1" value={selectedPhase} onValueChange={setSelectedPhase}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-1 bg-[#f1f5f9] dark:bg-[#1e293b]">
          <TabsTrigger 
            value="phase1" 
            className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-1.5 md:px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0f172a]"
          >
            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span className="truncate">Phase 1</span>
            <Badge className="ml-0.5 md:ml-1 bg-red-500 text-white text-[10px] md:text-xs px-1">
              {roadmap.phases.phase1.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="phase2" 
            className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-1.5 md:px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0f172a]"
          >
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span className="truncate">Phase 2</span>
            <Badge className="ml-0.5 md:ml-1 bg-orange-500 text-white text-[10px] md:text-xs px-1">
              {roadmap.phases.phase2.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="phase3" 
            className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-1.5 md:px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0f172a]"
          >
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span className="truncate">Phase 3</span>
            <Badge className="ml-0.5 md:ml-1 bg-yellow-500 text-white text-[10px] md:text-xs px-1">
              {roadmap.phases.phase3.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="phase4" 
            className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-1.5 md:px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0f172a]"
          >
            <Target className="w-3 h-3 md:w-4 md:h-4" />
            <span className="truncate">Phase 4</span>
            <Badge className="ml-0.5 md:ml-1 bg-blue-500 text-white text-[10px] md:text-xs px-1">
              {roadmap.phases.phase4.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        {['phase1', 'phase2', 'phase3', 'phase4'].map((phase) => (
          <TabsContent key={phase} value={phase} className="space-y-4 mt-4">
            <AnimatePresence>
              {roadmap.phases[phase as keyof typeof roadmap.phases].map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-[#1e293b] border-[#e2e8f0] dark:border-[#334155]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className={`mt-1 w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                        completedSteps.includes(step.id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-[#e2e8f0] dark:border-[#334155]'
                      }`}
                      onClick={() => toggleStep(step.id)}
                    >
                      {completedSteps.includes(step.id) && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#0f172a] dark:text-white">
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {/* Effort badge with color based on effort level */}
                          <Badge variant="outline" className={getEffortColor(step.effort)}>
                            {step.effort.icon} {step.effort.timeDisplay}
                          </Badge>
                          <Badge variant="outline" className="bg-[#f1f5f9] dark:bg-[#334155]">
                            {step.timeEstimate}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-3">
                        {step.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-[#64748b]">
                          {getPriorityIcon(step.priority)}
                          {step.priority.charAt(0).toUpperCase() + step.priority.slice(1)} Priority
                        </span>
                        <span className="text-[#2563eb] dark:text-[#7c3aed]">
                          WCAG: {step.wcagRef}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {roadmap.phases[phase as keyof typeof roadmap.phases].length === 0 && (
              <div className="text-center py-8 text-[#64748b]">
                No issues in this phase
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Phase Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-[#64748b]">Phase 1</div>
              <div className="flex-1">
                <div className="h-2 bg-red-500 rounded-full" style={{ width: '25%' }} />
              </div>
              <div className="text-sm text-[#0f172a] dark:text-white">Days 1-2</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-[#64748b]">Phase 2</div>
              <div className="flex-1">
                <div className="h-2 bg-orange-500 rounded-full" style={{ width: '35%' }} />
              </div>
              <div className="text-sm text-[#0f172a] dark:text-white">Week 1</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-[#64748b]">Phase 3</div>
              <div className="flex-1">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '25%' }} />
              </div>
              <div className="text-sm text-[#0f172a] dark:text-white">Weeks 2-3</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-[#64748b]">Phase 4</div>
              <div className="flex-1">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '15%' }} />
              </div>
              <div className="text-sm text-[#0f172a] dark:text-white">Month+</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}