import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@shared/routes";
import { Scale, ArrowRight, X } from "lucide-react";
import { Audit, AuditSummary } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface CompareAuditsProps {
  currentAuditId: number;
  onClose: () => void;
}

export function CompareAudits({ currentAuditId, onClose }: CompareAuditsProps) {
  const [selectedAuditId, setSelectedAuditId] = useState<string>("");
  const [showComparison, setShowComparison] = useState(false);

  const { data: audits } = useQuery<Audit[]>({
    queryKey: ['audits'],
    queryFn: () => api.get(api.audits.list.path),
  });

  const currentAudit = audits?.find(a => a.id === currentAuditId);
  const selectedAudit = audits?.find(a => a.id === Number(selectedAuditId));

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 border-green-300";
    if (score >= 70) return "text-blue-600 bg-blue-100 border-blue-300";
    if (score >= 50) return "text-yellow-600 bg-yellow-100 border-yellow-300";
    return "text-red-600 bg-red-100 border-red-300";
  };

  const getIssueSummary = (audit: Audit): AuditSummary => {
    return audit.summary as AuditSummary;
  };

  const calculateScoreChange = () => {
    if (!currentAudit || !selectedAudit) return null;
    const diff = currentAudit.score - selectedAudit.score;
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
    };
  };

  const scoreChange = calculateScoreChange();

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowComparison(true)}
        className="gap-2"
      >
        <Scale className="w-4 h-4" />
        Compare
      </Button>

      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#2563eb]" />
              Compare Audits
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Audit Selector */}
            <div className="flex items-center gap-4">
              <Select value={selectedAuditId} onValueChange={setSelectedAuditId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select an audit to compare" />
                </SelectTrigger>
                <SelectContent>
                  {audits
                    ?.filter(a => a.id !== currentAuditId)
                    .map((audit) => (
                      <SelectItem key={audit.id} value={audit.id.toString()}>
                        {new URL(audit.url).hostname} - {new Date(audit.createdAt).toLocaleDateString()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              {selectedAudit && currentAudit && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Score Comparison */}
                  <div className="grid grid-cols-2 gap-8">
                    {/* Current Audit */}
                    <Card className="border-2 border-[#2563eb] shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 text-[#2563eb]">Current Audit</h3>
                        <div className="text-center mb-4">
                          <div className={`text-5xl font-bold mb-2 ${getScoreColor(currentAudit.score)}`}>
                            {currentAudit.score}
                          </div>
                          <p className="text-sm text-[#475569]">
                            {new Date(currentAudit.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#64748b] truncate mt-2">
                            {currentAudit.url}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Selected Audit */}
                    <Card className="border-2 border-[#7c3aed] shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 text-[#7c3aed]">Selected Audit</h3>
                        <div className="text-center mb-4">
                          <div className={`text-5xl font-bold mb-2 ${getScoreColor(selectedAudit.score)}`}>
                            {selectedAudit.score}
                          </div>
                          <p className="text-sm text-[#475569]">
                            {new Date(selectedAudit.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#64748b] truncate mt-2">
                            {selectedAudit.url}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Score Change Indicator */}
                  {scoreChange && scoreChange.value > 0 && (
                    <div className="text-center p-4 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-xl">
                      <span className="text-lg">
                        {scoreChange.direction === 'up' ? (
                          <span className="text-green-600">↑ Improved by {scoreChange.value} points</span>
                        ) : scoreChange.direction === 'down' ? (
                          <span className="text-red-600">↓ Decreased by {scoreChange.value} points</span>
                        ) : (
                          <span className="text-[#475569]">No change in score</span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Issue Breakdown Comparison */}
                  <div className="grid grid-cols-2 gap-8">
                    {[currentAudit, selectedAudit].map((audit, index) => {
                      const summary = getIssueSummary(audit);
                      return (
                        <div key={index} className="space-y-3">
                          <h4 className="font-medium text-[#0f172a]">Issue Breakdown</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#475569]">Critical</span>
                              <Badge className="bg-red-500 text-white">{summary.critical}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#475569]">Serious</span>
                              <Badge className="bg-orange-500 text-white">{summary.serious}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#475569]">Moderate</span>
                              <Badge className="bg-yellow-500 text-white">{summary.moderate}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#475569]">Minor</span>
                              <Badge className="bg-blue-500 text-white">{summary.minor}</Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowComparison(false)}>
                      Close
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
                      onClick={() => {
                        setShowComparison(false);
                        onClose();
                      }}
                    >
                      View Full Report
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedAudit && (
              <div className="text-center py-12 text-[#475569]">
                <Scale className="w-12 h-12 mx-auto mb-3 text-[#2563eb]/30" />
                <p>Select another audit to compare with the current report</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}