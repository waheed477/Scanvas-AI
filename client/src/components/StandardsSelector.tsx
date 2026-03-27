import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, FileText, Globe, Shield, Gavel, Accessibility } from "lucide-react";

export interface Standard {
  id: string;
  name: string;
  description: string;
  icon: any;
  tags: string[];
}

export const AVAILABLE_STANDARDS: Standard[] = [
  {
    id: 'wcag2a',
    name: 'WCAG 2.1 Level A',
    description: 'Basic accessibility requirements. Minimum level for some legal frameworks.',
    icon: Accessibility,
    tags: ['wcag2a']
  },
  {
    id: 'wcag2aa',
    name: 'WCAG 2.1 Level AA',
    description: 'Standard compliance level. Most common legal requirement worldwide.',
    icon: FileText,
    tags: ['wcag2aa']
  },
  {
    id: 'wcag2aaa',
    name: 'WCAG 2.1 Level AAA',
    description: 'Highest conformance level. Enhanced accessibility for specialized needs.',
    icon: Shield,
    tags: ['wcag21aaa']
  },
  {
    id: 'section508',
    name: 'Section 508',
    description: 'US federal procurement standard. Required for government websites.',
    icon: Gavel,
    tags: ['section508']
  },
  {
    id: 'ada',
    name: 'ADA Standards',
    description: 'Americans with Disabilities Act requirements for public accommodations.',
    icon: Globe,
    tags: ['wcag2a', 'wcag2aa']
  }
];

interface StandardsSelectorProps {
  selectedStandards: string[];
  onStandardsChange: (standards: string[]) => void;
  disabled?: boolean;
}

export function StandardsSelector({ 
  selectedStandards, 
  onStandardsChange, 
  disabled = false 
}: StandardsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStandard = (standardId: string) => {
    if (selectedStandards.includes(standardId)) {
      onStandardsChange(selectedStandards.filter(id => id !== standardId));
    } else {
      onStandardsChange([...selectedStandards, standardId]);
    }
  };

  const selectAll = () => {
    onStandardsChange(AVAILABLE_STANDARDS.map(s => s.id));
  };

  const clearAll = () => {
    onStandardsChange([]);
  };

  const getSelectedNames = () => {
    if (selectedStandards.length === 0) return 'No standards selected';
    if (selectedStandards.length === AVAILABLE_STANDARDS.length) return 'All standards';
    
    const names = AVAILABLE_STANDARDS
      .filter(s => selectedStandards.includes(s.id))
      .map(s => s.name.replace('WCAG 2.1 ', ''))
      .join(', ');
    
    return names.length > 30 ? `${selectedStandards.length} standards selected` : names;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" className="gap-2 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155]">
          <FileText className="w-4 h-4" />
          <span className="max-w-[200px] truncate">{getSelectedNames()}</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {selectedStandards.length}
          </Badge>
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-lg rounded-lg p-2 z-50">
        <div className="px-2 py-1.5 text-sm font-medium text-[#475569] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] mb-2">
          Compliance Standards
        </div>
        
        {AVAILABLE_STANDARDS.map((standard) => {
          const Icon = standard.icon;
          const isSelected = selectedStandards.includes(standard.id);
          
          return (
            <DropdownMenuItem
              key={standard.id}
              onClick={() => toggleStandard(standard.id)}
              className="flex items-start gap-3 px-2 py-3 cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] rounded-md transition-colors"
            >
              <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${
                isSelected 
                  ? 'bg-[#2563eb] border-[#2563eb] text-white' 
                  : 'border-[#e2e8f0] dark:border-[#334155]'
              }`}>
                {isSelected && <Check className="w-3 h-3" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#475569] dark:text-[#94a3b8]" />
                  <span className="text-sm font-medium text-[#0f172a] dark:text-white">
                    {standard.name}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1">
                  {standard.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator className="bg-[#e2e8f0] dark:bg-[#334155] my-2" />
        
        <div className="flex gap-2 px-2 py-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={selectAll}
            className="flex-1 text-xs"
          >
            Select All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="flex-1 text-xs"
          >
            Clear All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}