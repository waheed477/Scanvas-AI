import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIChatPanel } from "./AIChatPanel";

interface AIFixButtonProps {
  issue: any;
}

export function AIFixButton({ issue }: AIFixButtonProps) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPanelOpen(true)}
        className="gap-2 text-xs"
      >
        <Sparkles className="w-3 h-3" />
        AI Fix
      </Button>

      <AIChatPanel 
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        initialIssue={issue}
      />
    </>
  );
}