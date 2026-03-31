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
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `scanvas-audit-${auditId}-${format(new Date(), 'yyyy-MM-dd')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export Successful",
        description: "JSON report downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Error generating JSON report.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      let y = 20;
      
      // Title
      doc.setFontSize(24);
      doc.setTextColor(51, 65, 85);
      doc.text('Accessibility Audit Report', 20, y);
      y += 15;
      
      // URL
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text(`URL: ${auditData.url}`, 20, y);
      y += 10;
      
      // Date
      doc.text(`Date: ${format(new Date(auditData.createdAt), 'MMMM d, yyyy')}`, 20, y);
      y += 15;
      
      // Score
      doc.setFontSize(18);
      doc.setTextColor(51, 65, 85);
      doc.text(`Score: ${auditData.score}`, 20, y);
      y += 12;
      
      // Summary
      if (auditData.summary) {
        doc.setFontSize(14);
        doc.setTextColor(51, 65, 85);
        doc.text('Issues Summary', 20, y);
        y += 10;
        
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.text(`Critical: ${auditData.summary.critical || 0}`, 30, y);
        y += 7;
        doc.text(`Serious: ${auditData.summary.serious || 0}`, 30, y);
        y += 7;
        doc.text(`Moderate: ${auditData.summary.moderate || 0}`, 30, y);
        y += 7;
        doc.text(`Minor: ${auditData.summary.minor || 0}`, 30, y);
        y += 15;
      }
      
      // Violations
      const violations = auditData.results?.violations || [];
      if (violations.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(51, 65, 85);
        doc.text('Issues Found', 20, y);
        y += 10;
        
        doc.setFontSize(10);
        violations.slice(0, 10).forEach((v: any) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setTextColor(100, 116, 139);
          doc.text(`• ${v.help || v.id}`, 25, y);
          y += 6;
          if (v.impact) {
            doc.setTextColor(139, 92, 246);
            doc.text(`  Impact: ${v.impact}`, 30, y);
            y += 5;
          }
        });
      }
      
      doc.save(`scanvas-audit-${auditId}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "PDF report downloaded.",
      });
    } catch (error: any) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Error generating PDF.",
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
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportJSON} className="gap-2">
          <FileJson className="w-4 h-4" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleExportPDF} 
          disabled={exporting} 
          className="gap-2"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{exporting ? "Generating PDF..." : "Export as PDF"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
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