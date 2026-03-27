export interface FixEffort {
  level: 'quick' | 'medium' | 'complex';
  timeMinutes: number;
  timeDisplay: string;
  icon: string;
  color: string;
}

export interface RemediationStep {
  id: string;
  title: string;
  description: string;
  effort: FixEffort;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
  category: 'content' | 'structure' | 'aria' | 'contrast' | 'forms';
  wcagRef: string;
}

export interface RemediationRoadmap {
  steps: RemediationStep[];
  summary: {
    totalSteps: number;
    totalTimeMinutes: number;
    totalTimeDisplay: string;
    quickFixes: number;
    mediumFixes: number;
    complexFixes: number;
    criticalIssues: number;
  };
  phases: {
    phase1: RemediationStep[];
    phase2: RemediationStep[];
    phase3: RemediationStep[];
    phase4: RemediationStep[];
  };
}

// Effort mapping based on rule type and complexity
const effortMap: Record<string, FixEffort> = {
  // Quick fixes (5-15 minutes)
  'image-alt': { level: 'quick', timeMinutes: 10, timeDisplay: '10 min', icon: '⚡', color: 'green' },
  'link-name': { level: 'quick', timeMinutes: 15, timeDisplay: '15 min', icon: '⚡', color: 'green' },
  'button-name': { level: 'quick', timeMinutes: 15, timeDisplay: '15 min', icon: '⚡', color: 'green' },
  'html-has-lang': { level: 'quick', timeMinutes: 5, timeDisplay: '5 min', icon: '⚡', color: 'green' },
  'duplicate-id': { level: 'quick', timeMinutes: 15, timeDisplay: '15 min', icon: '⚡', color: 'green' },
  
  // Medium fixes (30-60 minutes)
  'color-contrast': { level: 'medium', timeMinutes: 45, timeDisplay: '45 min', icon: '⏱️', color: 'yellow' },
  'heading-order': { level: 'medium', timeMinutes: 60, timeDisplay: '1 hour', icon: '⏱️', color: 'yellow' },
  'form-label': { level: 'medium', timeMinutes: 45, timeDisplay: '45 min', icon: '⏱️', color: 'yellow' },
  'aria-required-attr': { level: 'medium', timeMinutes: 60, timeDisplay: '1 hour', icon: '⏱️', color: 'yellow' },
  'meta-viewport': { level: 'medium', timeMinutes: 30, timeDisplay: '30 min', icon: '⏱️', color: 'yellow' },
  
  // Complex fixes (2-4 hours)
  'aria-roles': { level: 'complex', timeMinutes: 180, timeDisplay: '3 hours', icon: '🚧', color: 'red' },
  'aria-valid-attr': { level: 'complex', timeMinutes: 120, timeDisplay: '2 hours', icon: '🚧', color: 'red' },
  'landmark': { level: 'complex', timeMinutes: 240, timeDisplay: '4 hours', icon: '🚧', color: 'red' },
  'region': { level: 'complex', timeMinutes: 180, timeDisplay: '3 hours', icon: '🚧', color: 'red' },
  'tabindex': { level: 'complex', timeMinutes: 120, timeDisplay: '2 hours', icon: '🚧', color: 'red' },
};

// Default effort if not found
const defaultEffort: FixEffort = { 
  level: 'medium', 
  timeMinutes: 60, 
  timeDisplay: '1 hour', 
  icon: '⏱️', 
  color: 'yellow' 
};

// Get effort for a rule
export function getEffortForRule(ruleId: string): FixEffort {
  // Extract base rule ID without index
  const baseRuleId = ruleId.split('-')[0];
  
  // Try exact match first
  if (effortMap[ruleId]) return effortMap[ruleId];
  
  // Try base rule match
  for (const key of Object.keys(effortMap)) {
    if (ruleId.includes(key)) return effortMap[key];
  }
  
  return defaultEffort;
}

// Calculate total time with dependencies
export function calculateTotalTime(steps: RemediationStep[]): number {
  // Group by dependencies
  const dependencyGroups = new Map<string, RemediationStep[]>();
  
  steps.forEach(step => {
    const depKey = step.dependencies.join(',') || 'independent';
    if (!dependencyGroups.has(depKey)) {
      dependencyGroups.set(depKey, []);
    }
    dependencyGroups.get(depKey)?.push(step);
  });
  
  // Calculate parallel vs sequential time
  let totalTime = 0;
  dependencyGroups.forEach(group => {
    // Within a dependency group, steps are sequential
    const groupTime = group.reduce((sum, step) => sum + step.effort.timeMinutes, 0);
    totalTime += groupTime;
  });
  
  return totalTime;
}

// Format time display
export function formatTimeDisplay(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
}

// Generate remediation roadmap with effort estimates
export function generateRemediationRoadmap(violations: any[]): RemediationRoadmap {
  const steps: RemediationStep[] = [];
  
  violations.forEach((violation, index) => {
    const impact = violation.impact || 'minor';
    const ruleId = violation.id;
    
    // Get effort estimate
    const effort = getEffortForRule(ruleId);
    
    // Determine priority based on impact
    let priority: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    if (impact === 'critical') priority = 'critical';
    else if (impact === 'serious') priority = 'high';
    else if (impact === 'moderate') priority = 'medium';
    else priority = 'low';
    
    // Determine category
    let category: 'content' | 'structure' | 'aria' | 'contrast' | 'forms' = 'content';
    if (ruleId.includes('color')) category = 'contrast';
    else if (ruleId.includes('aria')) category = 'aria';
    else if (ruleId.includes('heading') || ruleId.includes('landmark')) category = 'structure';
    else if (ruleId.includes('form') || ruleId.includes('label')) category = 'forms';
    
    // Dependencies
    let dependencies: string[] = [];
    if (category === 'aria' && steps.some(s => s.category === 'structure')) {
      dependencies = ['structure-first'];
    }
    
    steps.push({
      id: `${ruleId}-${index}`,
      title: violation.help || 'Accessibility issue',
      description: violation.description,
      effort,
      priority,
      dependencies,
      category,
      wcagRef: violation.tags?.filter((t: string) => t.startsWith('wcag')).join(', ') || 'WCAG 2.1'
    });
  });
  
  // Sort by priority
  steps.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Group into phases
  const phases = {
    phase1: steps.filter(s => s.priority === 'critical' || s.priority === 'high'),
    phase2: steps.filter(s => s.priority === 'medium' && s.effort.level !== 'complex'),
    phase3: steps.filter(s => s.priority === 'medium' && s.effort.level === 'complex'),
    phase4: steps.filter(s => s.priority === 'low')
  };
  
  // Calculate summary
  const totalTimeMinutes = calculateTotalTime(steps);
  const summary = {
    totalSteps: steps.length,
    totalTimeMinutes,
    totalTimeDisplay: formatTimeDisplay(totalTimeMinutes),
    quickFixes: steps.filter(s => s.effort.level === 'quick').length,
    mediumFixes: steps.filter(s => s.effort.level === 'medium').length,
    complexFixes: steps.filter(s => s.effort.level === 'complex').length,
    criticalIssues: steps.filter(s => s.priority === 'critical').length
  };
  
  return { steps, summary, phases };
}