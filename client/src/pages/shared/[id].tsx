import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@shared/routes";
import { format } from "date-fns";
import { useState } from "react";
import { Lock, Eye, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { ScoreGauge } from "@/components/ScoreGauge";
import { IssueCard } from "@/components/IssueCard";
import { motion } from "framer-motion";

export default function SharedReport() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [submittedPassword, setSubmittedPassword] = useState<string>();
  const [authError, setAuthError] = useState(false);

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['shared', id, submittedPassword],
    queryFn: async () => {
      try {
        const url = submittedPassword 
          ? `/api/share/${id}?password=${encodeURIComponent(submittedPassword)}`
          : `/api/share/${id}`;
        const data = await api.get(url);
        return data;
      } catch (err: any) {
        if (err.message.includes('401') || err.message.includes('Invalid password')) {
          setAuthError(true);
        }
        throw err;
      }
    },
    enabled: !!id,
    retry: false
  });

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPassword(password);
    setAuthError(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563eb] mx-auto mb-4" />
          <p className="text-[#475569] dark:text-[#94a3b8]">Loading shared report...</p>
        </div>
      </div>
    );
  }

  if (error?.message?.includes('401') || authError) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-2">
                Password Protected
              </h2>
              <p className="text-[#475569] dark:text-[#94a3b8]">
                This report requires a password to view
              </p>
            </div>
            
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              {authError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Invalid password. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
              >
                View Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error?.message?.includes('404')) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-2">
              Report Not Found
            </h2>
            <p className="text-[#475569] dark:text-[#94a3b8]">
              This share link may have expired or been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  const violations = report.results?.violations || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Share Info Banner */}
        <div className="mb-6 p-4 bg-[#2563eb]/5 border border-[#2563eb]/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Eye className="w-5 h-5 text-[#2563eb]" />
            <div>
              <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
                Shared report • Viewed {report.shareInfo?.views || 1} times
              </p>
              <p className="text-xs text-[#64748b]">
                Created {format(new Date(report.shareInfo?.createdAt), "MMM d, yyyy")}
                {report.shareInfo?.expiresAt && ` • Expires ${format(new Date(report.shareInfo.expiresAt), "MMM d, yyyy")}`}
              </p>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Score */}
          <div className="space-y-6">
            <Card className="border-[#e2e8f0] dark:border-[#334155]">
              <CardContent className="p-6 flex flex-col items-center">
                <ScoreGauge score={report.score} size={160} />
                <div className="text-center mt-4">
                  <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
                    Accessibility Score
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Issues */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-[#0f172a] dark:text-white mb-4">
              Issues Found ({violations.length})
            </h2>
            <div className="space-y-4">
              {violations.map((violation: any, index: number) => (
                <IssueCard key={index} issue={violation} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}