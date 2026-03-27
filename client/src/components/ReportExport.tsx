import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { FileJson, FileText, Download, Check, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

interface ReportExportProps {
  auditId: string;
  auditData: any;
}

export function ReportExport({ auditId, auditData }: ReportExportProps) {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(auditData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `scanvas-audit-${auditId}-${format(new Date(), 'yyyy-MM-dd')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export Successful",
        description: "JSON report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the JSON report.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const element = document.querySelector('.audit-report-content');
      if (!element) {
        throw new Error('Report content not found');
      }

      // Clone and prepare for PDF
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Add style to override Tailwind v4 colors
      const style = document.createElement('style');
      style.innerHTML = `
        * { 
          color-scheme: light !important;
        }
        .bg-\\[#f8fafc\\] { background-color: #ffffff !important; }
        .dark\\:bg-\\[#0f172a\\] { background-color: #ffffff !important; }
        .dark\\:bg-\\[#1e293b\\] { background-color: #ffffff !important; }
        .text-\\[#0f172a\\] { color: #000000 !important; }
        .dark\\:text-white { color: #000000 !important; }
        .text-\\[#475569\\] { color: #4b5563 !important; }
        .dark\\:text-\\[#94a3b8\\] { color: #4b5563 !important; }
        .border-\\[#e2e8f0\\] { border-color: #e5e7eb !important; }
        .dark\\:border-\\[#334155\\] { border-color: #e5e7eb !important; }
        button, .gap-2, .flex { display: flex; }
        [class*="bg-"]:not(.bg-white) { background-color: #ffffff !important; }
      `;
      clone.prepend(style);
      
      clone.style.cssText = 'position:absolute; left:-9999px; top:-9999px; width:1200px; background:white; color:black;';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, { 
        scale: 2, 
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Ensure all elements have proper background
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            (el as HTMLElement).style.backgroundColor = 
              (el as HTMLElement).style.backgroundColor === 'transparent' ? '#ffffff' : 
              (el as HTMLElement).style.backgroundColor;
          });
        }
      });
      
      document.body.removeChild(clone);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`scanvas-audit-${auditId}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "PDF report has been downloaded.",
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/shared/${auditId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Share this link with your team.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-sm hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-lg rounded-lg p-1 z-50"
      >
        <DropdownMenuItem 
          onClick={handleExportJSON} 
          className="gap-2 cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] rounded-md px-3 py-2 transition-colors"
        >
          <FileJson className="w-4 h-4" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleExportPDF} 
          disabled={exporting} 
          className="gap-2 cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] rounded-md px-3 py-2 transition-colors"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{exporting ? "Generating PDF..." : "Export as PDF"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#e2e8f0] dark:bg-[#334155] my-1" />
        <DropdownMenuItem 
          onClick={handleCopyLink} 
          className="gap-2 cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] rounded-md px-3 py-2 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{copied ? "Copied!" : "Copy share link"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}