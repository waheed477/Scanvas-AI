import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAudit } from "@/hooks/use-audits";
import { ScoreGauge } from "@/components/ScoreGauge";
import { IssueCard } from "@/components/IssueCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, Download, Share2, ArrowLeft, Eye } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { AuditResult, AuditSummary } from "@shared/schema";

export default function AuditDetails() {
  const [, params] = useRoute("/audit/:id");
  const id = parseInt(params?.id || "0");
  const { data: audit, isLoading, error } = useAudit(id);

  if (isLoading) {
    return <AuditSkeleton />;
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="p-4 rounded-full bg-red-100 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Audit Not Found</h2>
        <p className="text-muted-foreground">The requested audit could not be loaded.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  // Type assertion since Zod schema for JSONB is generic
  const results = audit.results as unknown as AuditResult;
  const summary = audit.summary as unknown as AuditSummary;

  const groupedIssues = {
    critical: results.violations.filter(v => v.impact === 'critical'),
    serious: results.violations.filter(v => v.impact === 'serious'),
    moderate: results.violations.filter(v => v.impact === 'moderate'),
    minor: results.violations.filter(v => v.impact === 'minor'),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-md">{audit.url}</h1>
              <div className="text-xs text-muted-foreground">
                Audited {new Date(audit.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Score Card */}
          <Card className="col-span-1 p-8 flex flex-col items-center justify-center text-center bg-card shadow-sm border-border">
            <ScoreGauge score={audit.score} />
            <div className="mt-6 space-y-1">
              <h3 className="font-semibold text-lg">Overall Accessibility Score</h3>
              <p className="text-sm text-muted-foreground">Based on WCAG 2.1 Level AA Rules</p>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Critical", count: summary.critical, color: "text-red-600 bg-red-50 border-red-100" },
              { label: "Serious", count: summary.serious, color: "text-orange-600 bg-orange-50 border-orange-100" },
              { label: "Moderate", count: summary.moderate, color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
              { label: "Minor", count: summary.minor, color: "text-blue-600 bg-blue-50 border-blue-100" },
            ].map((stat) => (
              <Card key={stat.label} className={`flex flex-col justify-between p-6 border ${stat.color.split(' ')[2]}`}>
                <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${stat.color.split(' ')[0]}`}>
                  {stat.label}
                </span>
                <span className={`text-4xl font-bold ${stat.color.split(' ')[0]}`}>
                  {stat.count}
                </span>
                <span className="text-xs text-muted-foreground mt-2">Issues found</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="issues" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8 mb-8">
            <TabsTrigger 
              value="issues" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-base"
            >
              <FileText className="w-4 h-4 mr-2" /> All Issues ({summary.total})
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-base"
            >
              <Eye className="w-4 h-4 mr-2" /> Visual Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.entries(groupedIssues).map(([severity, issues]) => {
              if (issues.length === 0) return null;
              
              return (
                <div key={severity} className="space-y-4">
                  <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                    {severity} Priority
                    <Badge variant="secondary" className="ml-2">{issues.length}</Badge>
                  </h3>
                  <div className="grid gap-4">
                    {issues.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {summary.total === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No Issues Found!</h3>
                <p className="text-muted-foreground mt-2">Great job! Your site passed all automated checks.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="min-h-[500px]">
            <Card className="p-10 text-center border-dashed">
              <div className="max-w-md mx-auto space-y-4">
                <h3 className="text-xl font-semibold">Visual Preview Unavailable</h3>
                <p className="text-muted-foreground">
                  Due to browser security restrictions (X-Frame-Options), we cannot display 
                  <span className="font-mono text-xs mx-1 bg-muted px-1 py-0.5 rounded">{audit.url}</span> 
                  directly in this dashboard.
                </p>
                <Button asChild>
                  <a href={audit.url} target="_blank" rel="noopener noreferrer">
                    Open Website in New Tab <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function AuditSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="col-span-1 h-64 rounded-xl" />
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

import { ExternalLink, CheckCircle } from "lucide-react";
