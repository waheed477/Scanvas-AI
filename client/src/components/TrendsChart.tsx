import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Audit } from "@shared/routes";
import { format } from "date-fns";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface TrendsChartProps {
  audits: Audit[];
}

export function TrendsChart({ audits }: TrendsChartProps) {
  if (!audits || audits.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-[#475569] dark:text-[#94a3b8]">
          No audit data available for trends
        </CardContent>
      </Card>
    );
  }

  // Sort audits by date
  const sortedAudits = [...audits].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Prepare timeline data (last 10 audits)
  const timelineData = sortedAudits.slice(-10).map(audit => ({
    date: format(new Date(audit.createdAt), 'MMM d'),
    score: audit.score || 0,
    url: audit.url ? new URL(audit.url).hostname : 'Unknown'
  }));

  // Prepare severity distribution
  const severityData = [
    { name: 'Critical', value: audits.reduce((sum, a) => sum + (a.summary?.critical || 0), 0), color: '#dc2626' },
    { name: 'Serious', value: audits.reduce((sum, a) => sum + (a.summary?.serious || 0), 0), color: '#f97316' },
    { name: 'Moderate', value: audits.reduce((sum, a) => sum + (a.summary?.moderate || 0), 0), color: '#eab308' },
    { name: 'Minor', value: audits.reduce((sum, a) => sum + (a.summary?.minor || 0), 0), color: '#3b82f6' }
  ].filter(item => item.value > 0);

  // Calculate stats
  const averageScore = Math.round(sortedAudits.reduce((sum, a) => sum + (a.score || 0), 0) / sortedAudits.length);
  const bestScore = Math.max(...sortedAudits.map(a => a.score || 0));
  const worstScore = Math.min(...sortedAudits.map(a => a.score || 0));
  const totalIssues = severityData.reduce((sum, item) => sum + item.value, 0);

  // Calculate trend
  const firstScore = sortedAudits[0]?.score || 0;
  const lastScore = sortedAudits[sortedAudits.length - 1]?.score || 0;
  const scoreChange = lastScore - firstScore;
  const trend = scoreChange > 0 ? 'up' : scoreChange < 0 ? 'down' : 'stable';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Total Audits</p>
            <p className="text-2xl font-bold text-[#0f172a] dark:text-white">{sortedAudits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Average Score</p>
            <p className={`text-2xl font-bold ${
              averageScore >= 90 ? 'text-emerald-600' :
              averageScore >= 70 ? 'text-blue-600' :
              averageScore >= 50 ? 'text-yellow-600' :
              'text-red-600'
            }`}>{averageScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Best Score</p>
            <p className="text-2xl font-bold text-emerald-600">{bestScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Total Issues</p>
            <p className="text-2xl font-bold text-[#0f172a] dark:text-white">{totalIssues}</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${
                trend === 'up' ? 'text-emerald-500' : 
                trend === 'down' ? 'text-red-500' : 
                'text-yellow-500'
              }`} />
              <span className="font-medium">Score Trend</span>
            </div>
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-emerald-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-yellow-600'
            }`}>
              {scoreChange > 0 ? `+${scoreChange}` : scoreChange} points
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Score Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2563eb]" />
            Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a'
                  }}
                  labelStyle={{ color: '#475569' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  name="Accessibility Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      {severityData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#2563eb]" />
                Issues by Severity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="#2563eb">
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#2563eb]" />
                Issue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}