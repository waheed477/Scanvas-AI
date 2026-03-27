import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Keyboard, 
  Ear, 
  Search, 
  Palette, 
  FormInput, 
  Film, 
  Layout,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle
} from "lucide-react";
import { manualChecklist, categories, ManualTestItem } from "@/data/manual-testing/checklist-data";

export function ManualTesting() {
  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const toggleTest = (testId: string) => {
    setCompletedTests(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };
  
  const filteredTests = activeCategory === 'all'
    ? manualChecklist
    : manualChecklist.filter(test => test.category === activeCategory);
  
  const progress = (completedTests.length / manualChecklist.length) * 100;
  
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'keyboard': return <Keyboard className="w-4 h-4" />;
      case 'screen-reader': return <Ear className="w-4 h-4" />;
      case 'zoom': return <Search className="w-4 h-4" />;
      case 'color': return <Palette className="w-4 h-4" />;
      case 'forms': return <FormInput className="w-4 h-4" />;
      case 'media': return <Film className="w-4 h-4" />;
      case 'structure': return <Layout className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Total Tests</p>
            <p className="text-2xl font-bold text-[#0f172a] dark:text-white">{manualChecklist.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedTests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Remaining</p>
            <p className="text-2xl font-bold text-amber-600">{manualChecklist.length - completedTests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-[#64748b]">Critical Tests</p>
            <p className="text-2xl font-bold text-red-600">
              {manualChecklist.filter(t => t.priority === 'critical').length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Manual Testing Progress</span>
            <span className="text-sm text-[#64748b]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
      
      {/* Category Tabs */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#2563eb] data-[state=active]:text-white">
            All Tests
          </TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="data-[state=active]:bg-[#2563eb] data-[state=active]:text-white gap-2"
            >
              {getCategoryIcon(cat.id)}
              <span className="hidden sm:inline">{cat.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-4">
          <div className="space-y-3">
            {filteredTests.map((test) => (
              <Card key={test.id} className={`border ${
                completedTests.includes(test.id)
                  ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20'
                  : 'border-[#e2e8f0] dark:border-[#334155]'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={test.id}
                      checked={completedTests.includes(test.id)}
                      onCheckedChange={() => toggleTest(test.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-[#0f172a] dark:text-white">
                          {test.title}
                        </h4>
                        <Badge className={getPriorityColor(test.priority)}>
                          {test.priority}
                        </Badge>
                        <Badge variant="outline" className="bg-[#f1f5f9] dark:bg-[#334155]">
                          <Clock className="w-3 h-3 mr-1" />
                          {test.timeEstimate}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-3">
                        {test.description}
                      </p>
                      
                      {/* Instructions */}
                      <div className="bg-[#f8fafc] dark:bg-[#0f172a] p-3 rounded-lg mb-3">
                        <p className="text-xs font-medium text-[#64748b] mb-2">How to test:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {test.instructions.map((instruction, idx) => (
                            <li key={idx} className="text-xs text-[#475569] dark:text-[#94a3b8]">
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Expected Result */}
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-[#64748b]">Expected:</span>
                          <p className="text-xs text-[#475569] dark:text-[#94a3b8]">
                            {test.expectedResult}
                          </p>
                        </div>
                      </div>
                      
                      {/* WCAG Reference */}
                      <div className="mt-2 text-xs text-[#2563eb] dark:text-[#7c3aed]">
                        WCAG: {test.wcagRef}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTests.length === 0 && (
              <div className="text-center py-8 text-[#475569] dark:text-[#94a3b8]">
                No tests in this category
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}