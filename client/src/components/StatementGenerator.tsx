import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Download, FileText, Copy, Check, Eye } from "lucide-react";
import { generateStatement, standardOptions, getComplianceBadge } from "@/data/statement/statement-templates";

export function StatementGenerator() {
  const [formData, setFormData] = useState({
    organizationName: '',
    websiteUrl: '',
    contactEmail: '',
    contactPhone: '',
    complianceLevel: 'AA' as 'A' | 'AA' | 'AAA',
    standards: ['wcag21'],
    partialCompliance: false,
    knownIssues: ''
  });
  
  const [generatedStatement, setGeneratedStatement] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('form');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!formData.organizationName || !formData.websiteUrl || !formData.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const statement = generateStatement({
      ...formData,
      reviewDate: new Date(),
      lastUpdated: new Date(),
      standards: formData.standards.map(s => 
        standardOptions.find(opt => opt.id === s)?.name || s
      ),
      partialCompliance: formData.partialCompliance ? ['Some sections under development'] : undefined
    });

    setGeneratedStatement(statement);
    setActiveTab('preview');
    
    toast({
      title: "Statement Generated",
      description: "Your accessibility statement is ready"
    });
  };

  const handleCopy = () => {
    const text = generatedStatement.map(s => 
      `## ${s.title}\n\n${s.content}\n`
    ).join('\n---\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Statement copied to clipboard"
    });
  };

  const handleDownload = () => {
    const text = generatedStatement.map(s => 
      `## ${s.title}\n\n${s.content}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-statement-${formData.organizationName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Statement downloaded as text file"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2563eb]" />
            Accessibility Statement Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="form">Enter Details</TabsTrigger>
              <TabsTrigger value="preview" disabled={generatedStatement.length === 0}>
                Preview Statement
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    placeholder="e.g., Acme Corporation"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL *</Label>
                  <Input
                    id="websiteUrl"
                    placeholder="https://example.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="accessibility@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compliance">WCAG Compliance Level</Label>
                  <Select
                    value={formData.complianceLevel}
                    onValueChange={(value: 'A' | 'AA' | 'AAA') => 
                      setFormData({...formData, complianceLevel: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Level A (Basic)</SelectItem>
                      <SelectItem value="AA">Level AA (Standard) ✓</SelectItem>
                      <SelectItem value="AAA">Level AAA (Advanced)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Standards</Label>
                  <div className="space-y-2">
                    {standardOptions.map(standard => (
                      <div key={standard.id} className="flex items-center justify-between p-3 bg-[#f8fafc] dark:bg-[#1e293b] rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
                        <div>
                          <Label htmlFor={standard.id} className="text-xs md:text-sm font-medium">
                            {standard.name}
                          </Label>
                          <p className="text-[10px] md:text-xs text-[#64748b]">
                            {standard.description}
                          </p>
                        </div>
                        <Switch
                          id={standard.id}
                          checked={formData.standards.includes(standard.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                standards: [...formData.standards, standard.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                standards: formData.standards.filter(s => s !== standard.id)
                              });
                            }
                          }}
                          // Added custom colors for switch states
                          className="data-[state=checked]:bg-[#2563eb] data-[state=unchecked]:bg-[#e2e8f0] dark:data-[state=unchecked]:bg-[#334155]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[#f8fafc] dark:bg-[#1e293b] rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
                  <div className="space-y-0.5">
                    <Label htmlFor="partialCompliance" className="text-xs md:text-sm font-medium">
                      Partially Compliant
                    </Label>
                    <p className="text-[10px] md:text-xs text-[#64748b]">
                      Some areas under development
                    </p>
                  </div>
                  <Switch
                    id="partialCompliance"
                    checked={formData.partialCompliance}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, partialCompliance: checked})
                    }
                    // Added custom colors for switch states
                    className="data-[state=checked]:bg-[#2563eb] data-[state=unchecked]:bg-[#e2e8f0] dark:data-[state=unchecked]:bg-[#334155]"
                  />
                </div>
              </div>
              
              {formData.partialCompliance && (
                <div className="space-y-2">
                  <Label htmlFor="issues">Known Issues (Optional)</Label>
                  <Textarea
                    id="issues"
                    placeholder="List any known accessibility issues..."
                    value={formData.knownIssues}
                    onChange={(e) => setFormData({...formData, knownIssues: e.target.value})}
                    rows={3}
                  />
                </div>
              )}
              
              <Button
                className="w-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
                onClick={handleGenerate}
              >
                Generate Statement
              </Button>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              {generatedStatement.map((section, index) => (
                <div key={index} className="p-4 bg-[#f8fafc] dark:bg-[#1e293b] rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
                  <h3 className="font-semibold text-[#0f172a] dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-[#475569] dark:text-[#94a3b8] whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download as Text
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}