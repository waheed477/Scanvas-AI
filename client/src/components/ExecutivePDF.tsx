import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ExecutivePDFProps {
  auditId: string;
  auditData: any;
}

export function ExecutivePDF({ auditId, auditData }: ExecutivePDFProps) {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      let yPos = margin;

      // Helper function for text wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return lines.length * fontSize * 0.35; // Return height used
      };

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(37, 99, 235); // #2563eb
      pdf.text('Accessibility Audit Report', margin, yPos);
      yPos += 40;

      // Subtitle
      pdf.setFontSize(14);
      pdf.setTextColor(100, 116, 139); // #64748b
      pdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, margin, yPos);
      yPos += 30;

      // Separator line
      pdf.setDrawColor(226, 232, 240); // #e2e8f0
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 20;

      // Executive Summary Header
      pdf.setFontSize(18);
      pdf.setTextColor(15, 23, 42); // #0f172a
      pdf.text('Executive Summary', margin, yPos);
      yPos += 25;

      // Score Card
      pdf.setFillColor(248, 250, 252); // #f8fafc
      pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 100, 5, 5, 'F');
      
      // Score
      pdf.setFontSize(36);
      pdf.setTextColor(auditData.score >= 90 ? 34 : auditData.score >= 70 ? 37 : auditData.score >= 50 ? 245 : 220, 
                      auditData.score >= 90 ? 197 : auditData.score >= 70 ? 99 : auditData.score >= 50 ? 158 : 38, 
                      auditData.score >= 90 ? 94 : auditData.score >= 70 ? 235 : auditData.score >= 50 ? 11 : 38);
      pdf.text(auditData.score.toString(), margin + 20, yPos + 40);

      // Score Label
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Overall Score', margin + 20, yPos + 60);

      // Grade
      const grade = auditData.score >= 90 ? 'A' : auditData.score >= 70 ? 'B' : auditData.score >= 50 ? 'C' : 'F';
      pdf.setFontSize(24);
      pdf.setTextColor(100, 116, 139);
      pdf.text(grade, pageWidth - margin - 60, yPos + 40);

      yPos += 120;

      // Summary Stats
      const summary = auditData.summary || { critical: 0, serious: 0, moderate: 0, minor: 0 };
      
      const stats = [
        { label: 'Critical', value: summary.critical, color: [220, 38, 38] },
        { label: 'Serious', value: summary.serious, color: [249, 115, 22] },
        { label: 'Moderate', value: summary.moderate, color: [234, 179, 8] },
        { label: 'Minor', value: summary.minor, color: [59, 130, 246] }
      ];

      stats.forEach((stat, index) => {
        const x = margin + (index * ((pageWidth - (margin * 2)) / 4));
        pdf.setFillColor(stat.color[0], stat.color[1], stat.color[2], 0.1);
        pdf.roundedRect(x, yPos, (pageWidth - (margin * 2)) / 4 - 10, 60, 3, 3, 'F');
        
        pdf.setFontSize(20);
        pdf.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
        pdf.text(stat.value.toString(), x + 10, yPos + 25);
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text(stat.label, x + 10, yPos + 40);
      });

      yPos += 80;

      // Compliance Standards
      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Compliance Checked', margin, yPos);
      yPos += 20;

      const standards = auditData.standards || ['wcag2aa'];
      standards.forEach((std: string, index: number) => {
        const stdName = std.replace('wcag2', 'WCAG ').replace('aa', 'AA').replace('aaa', 'AAA').toUpperCase();
        pdf.setFontSize(12);
        pdf.setTextColor(37, 99, 235);
        pdf.text('✓', margin + 10, yPos + (index * 15));
        pdf.setTextColor(15, 23, 42);
        pdf.text(stdName, margin + 25, yPos + (index * 15));
      });

      yPos += standards.length * 15 + 20;

      // Key Findings
      if (auditData.results?.violations?.length > 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(15, 23, 42);
        pdf.text('Key Findings', margin, yPos);
        yPos += 20;

        const topViolations = auditData.results.violations.slice(0, 5);
        topViolations.forEach((v: any, index: number) => {
          pdf.setFontSize(12);
          pdf.setTextColor(37, 99, 235);
          pdf.text('•', margin + 10, yPos + (index * 25));
          
          pdf.setTextColor(15, 23, 42);
          const title = v.help.length > 50 ? v.help.substring(0, 50) + '...' : v.help;
          pdf.text(title, margin + 25, yPos + (index * 25));
          
          pdf.setFontSize(10);
          pdf.setTextColor(100, 116, 139);
          const desc = v.description.length > 80 ? v.description.substring(0, 80) + '...' : v.description;
          pdf.text(desc, margin + 25, yPos + (index * 25) + 12);
        });
      }

      // Save PDF
      pdf.save(`Scanvas-Executive-Report-${auditId}.pdf`);

      toast({
        title: "✅ Executive Report Generated",
        description: "PDF has been downloaded successfully.",
      });

    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        title: "❌ Generation Failed",
        description: "There was an error generating the PDF.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={generatePDF}
      disabled={generating}
      className="gap-2"
    >
      {generating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileText className="w-4 h-4" />
      )}
      {generating ? "Generating..." : "Executive Summary PDF"}
    </Button>
  );
}