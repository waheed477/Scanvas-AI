import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, BarChart3, Award } from "lucide-react";
import { getBenchmarkForUrl, industryBenchmarks } from "@/data/benchmark-data";

interface BenchmarkComparisonProps {
  url: string;
  score: number;
}

export function BenchmarkComparison({ url, score }: BenchmarkComparisonProps) {
  const benchmark = getBenchmarkForUrl(url);
  const difference = score - benchmark.averageScore;
  const isAboveAverage = difference > 0;
  
  const getPercentile = (score: number, benchmark: any) => {
    if (score >= benchmark.topPercentile) return "Top 25%";
    if (score >= benchmark.averageScore) return "Above Average";
    if (score >= benchmark.bottomPercentile) return "Below Average";
    return "Bottom 25%";
  };
  
  const percentile = getPercentile(score, benchmark);
  
  const getPercentileColor = () => {
    if (percentile === "Top 25%") return "text-emerald-600 dark:text-emerald-400";
    if (percentile === "Above Average") return "text-green-600 dark:text-green-400";
    if (percentile === "Below Average") return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
  
  return (
    <Card className="border-[#e2e8f0] dark:border-[#334155]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#2563eb]" />
          Industry Benchmark
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#64748b]">Category</p>
            <p className="font-semibold text-[#0f172a] dark:text-white">{benchmark.category}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#64748b]">Sample Size</p>
            <p className="font-semibold text-[#0f172a] dark:text-white">{benchmark.sampleSize.toLocaleString()} sites</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">Your Score</span>
            <span className="font-bold text-[#0f172a] dark:text-white">{score}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">Industry Average</span>
            <span className="text-[#475569]">{benchmark.averageScore}</span>
          </div>
          <Progress value={(score / 100) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-[#64748b]">
            <span>0</span>
            <span>Top 25% ({benchmark.topPercentile}+)</span>
            <span>100</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] dark:bg-[#0f172a]">
          <div className="flex items-center gap-2">
            {isAboveAverage ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isAboveAverage ? `+${difference} points above average` : `${Math.abs(difference)} points below average`}
              </p>
              <p className="text-xs text-[#64748b]">Compared to {benchmark.category} industry</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${getPercentileColor()}`}>
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">{percentile}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div>
            <p className="text-xs text-[#64748b]">Top 25%</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{benchmark.topPercentile}+</p>
          </div>
          <div>
            <p className="text-xs text-[#64748b]">Average</p>
            <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{benchmark.averageScore}</p>
          </div>
          <div>
            <p className="text-xs text-[#64748b]">Bottom 25%</p>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">≤{benchmark.bottomPercentile}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}