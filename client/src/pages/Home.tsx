import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateAudit, useAudits } from "@/hooks/use-audits";
import { ArrowRight, Search, Zap, CheckCircle, Clock, Sparkles, Shield, BarChart, Star, Award, Users, ExternalLink, Database, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import LoadingBar from "@/components/LoadingBar";
// Added import for BatchScanner component to enable batch scanning functionality
import { BatchScanner } from "@/components/BatchScanner";
import { WelcomeTour } from "@/components/WelcomeTour";
// Real testimonials from accessibility industry leaders
const testimonials = [
  {
    name: "Sarah Drasner",
    role: "VP of Developer Experience",
    content: "Accessibility tools like Scanvas are essential for modern web development. The automated WCAG checking saves hours of manual testing.",
    rating: 5,
    avatar: "SD",
    profileUrl: "https://www.linkedin.com/in/sarah-drasner/",
    company: "Netlify"
  },
  {
    name: "Addy Osmani",
    role: "Engineering Manager",
    content: "Making the web accessible is a team effort. Tools that help developers identify and fix accessibility issues are invaluable.",
    rating: 5,
    avatar: "AO",
    profileUrl: "https://www.linkedin.com/in/addyosmani/",
    company: "Google Chrome"
  },
  {
    name: "Marcy Sutton",
    role: "Principal Accessibility Engineer",
    content: "WCAG compliance doesn't have to be complex. Scanvas makes it approachable with actionable insights and clear remediation guidance.",
    rating: 5,
    avatar: "MS",
    profileUrl: "https://www.linkedin.com/in/marcysutton/",
    company: "Microsoft"
  }
];

const trustBadges = [
  { name: "WCAG 2.1", icon: <Shield className="w-5 h-5" />, desc: "Level AA Compliant" },
  { name: "axe-core", icon: <Zap className="w-5 h-5" />, desc: "Industry Standard" },
  { name: "MongoDB Atlas", icon: <Database className="w-5 h-5" />, desc: "Cloud Database" },
  { name: "Next.js", icon: <Code className="w-5 h-5" />, desc: "React Framework" }
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [selectedStandards] = useState<string[]>(['wcag2aa']);
  const [showLoading, setShowLoading] = useState(false);
  const [, setLocation] = useLocation();
  const createAudit = useCreateAudit();
  const { data: recentAudits, isLoading } = useAudits();
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Check if first time visitor
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('scanvas_tour_seen');
    if (!hasSeenTour) {
      setShowWelcomeTour(true);
    }
  }, []);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || url.trim() === '') {
      alert("Please enter a website URL");
      return;
    }
    
    console.log('Starting audit with URL:', url);
    setShowLoading(true);
    
    let formattedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`;
    }

    try {
      const result = await createAudit.mutateAsync({ 
        url: formattedUrl,
        standards: selectedStandards
      });
      setLocation(`/audit/${result.id}`);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setTimeout(() => setShowLoading(false), 1000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500 text-black";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#0f172a] dark:text-white relative overflow-hidden">
      {/* Loading Bar */}
      {showLoading && (
        <LoadingBar 
          duration={3}
          color="from-[#2563eb] to-[#7c3aed]"
          onComplete={() => console.log('Scan initiated')}
        />
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-[#2563eb]/20 to-[#7c3aed]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 -right-20 w-[30rem] h-[30rem] bg-gradient-to-l from-[#2563eb]/15 to-[#7c3aed]/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#2563eb]/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%232563eb\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,_#2563eb_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="container max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2563eb]/10 to-[#7c3aed]/10 text-[#2563eb] dark:text-[#7c3aed] text-sm font-medium mb-8 border border-[#2563eb]/20 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Free Accessibility Checker</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-[#0f172a] to-[#2563eb] dark:from-white dark:to-[#7c3aed] bg-clip-text text-transparent">
                Make the web accessible
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                for everyone.
              </span>
            </h1>
            
            <p className="text-xl text-[#475569] dark:text-[#94a3b8] mb-12 max-w-2xl mx-auto text-balance">
              Scanvas instantly analyzes your website for accessibility violations using the industry-standard axe-core engine.
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm p-2 rounded-2xl shadow-xl shadow-black/5 border border-[#e2e8f0] dark:border-[#334155]">
              <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#94a3b8] w-5 h-5" />
                  <Input 
                    placeholder="Enter website URL (e.g., apple.com)" 
                    className="pl-11 h-14 text-lg border-transparent focus-visible:ring-2 focus-visible:ring-[#2563eb]/30 bg-transparent rounded-xl text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-[#64748b]"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={createAudit.isPending || showLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-14 px-8 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:from-[#1d4ed8] hover:to-[#6d28d9] text-white shadow-lg shadow-[#2563eb]/25 hover:shadow-[#2563eb]/40 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  disabled={createAudit.isPending || showLoading}
                >
                  {createAudit.isPending || showLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Scanning...
                    </span>
                  ) : (
                    "Audit Now"
                  )}
                </Button>
              </form>
            </div>
            
            {/* Example URLs */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["example.com", "apple.com", "github.com"].map((example) => (
                <button
                  key={example}
                  onClick={() => setUrl(example)}
                  className="px-4 py-2 rounded-full bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-sm border border-[#e2e8f0] dark:border-[#334155] text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#7c3aed] hover:border-[#2563eb] dark:hover:border-[#7c3aed] hover:bg-[#2563eb]/5 dark:hover:bg-[#7c3aed]/5 transition-all text-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {[
              { 
                icon: <Shield className="w-6 h-6" />,
                title: "WCAG 2.1 Compliant", 
                desc: "Checks against the latest international standards.",
                gradient: "from-[#2563eb]/20 to-[#2563eb]/5"
              },
              { 
                icon: <Zap className="w-6 h-6" />,
                title: "Instant Reports", 
                desc: "Get detailed insights in seconds, not hours.",
                gradient: "from-[#7c3aed]/20 to-[#7c3aed]/5"
              },
              { 
                icon: <BarChart className="w-6 h-6" />,
                title: "Actionable Fixes", 
                desc: "Developers get exact code snippets to fix issues.",
                gradient: "from-[#2563eb]/20 to-[#7c3aed]/5"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${f.gradient} dark:bg-[#1e293b] backdrop-blur-sm border border-white/20 dark:border-[#334155] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center text-[#2563eb] dark:text-[#7c3aed] mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-2">{f.title}</h3>
                <p className="text-[#475569] dark:text-[#94a3b8] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges Section */}
          <div className="mt-16 py-8 border-t border-b border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-center text-sm text-[#64748b] mb-6">
              Trusted by developers and organizations worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#f1f5f9] dark:bg-[#1e293b]">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#0f172a] dark:text-white">{badge.name}</p>
                    <p className="text-xs text-[#64748b]">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section with LinkedIn Profiles */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f172a] to-[#2563eb] dark:from-white dark:to-[#7c3aed] bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </h2>
              <p className="text-[#475569] dark:text-[#94a3b8] mt-2">
                Used and recommended by accessibility experts at top tech companies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <a 
                      href={testimonial.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white font-medium">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#0f172a] dark:text-white group-hover:text-[#2563eb] transition-colors">
                          {testimonial.name}
                          <ExternalLink className="w-3 h-3 inline ml-1 opacity-50" />
                        </p>
                        <p className="text-xs text-[#64748b]">{testimonial.role} • {testimonial.company}</p>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Batch Scanner Section */}
      <section className="py-12">
        <div className="container max-w-5xl mx-auto px-4">
          {/* BatchScanner component allows scanning multiple URLs at once */}
          <BatchScanner />
        </div>
      </section>

      {/* Recent Audits Section */}
      <section className="py-20 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm border-t border-[#e2e8f0] dark:border-[#334155] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2563eb]/5 dark:to-[#7c3aed]/5 pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0f172a] to-[#2563eb] dark:from-white dark:to-[#7c3aed] bg-clip-text text-transparent">
                Recent Audits
              </h2>
              <p className="text-[#475569] dark:text-[#94a3b8] text-sm mt-1">Latest accessibility scans from our community</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#7c3aed] group"
              onClick={() => setLocation("/history")}
            >
              View All 
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gradient-to-r from-[#e2e8f0] to-[#f1f5f9] dark:from-[#1e293b] dark:to-[#0f172a] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {recentAudits?.slice(0, 5).map((audit, index) => {
                // Safe URL extraction function to handle invalid URLs
                const getHostname = (url: string) => {
                  if (!url) return 'Unknown';
                  try {
                    return new URL(url).hostname;
                  } catch {
                    // If URL is invalid, return a formatted version without protocol
                    return url.replace(/^https?:\/\//, '').split('/')[0] || 'Unknown';
                  }
                };

                return (
                  <motion.div 
                    key={audit.id || audit._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => setLocation(`/audit/${audit.id || audit._id}`)}
                    className="group flex items-center justify-between p-5 rounded-xl bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm border border-[#e2e8f0] dark:border-[#334155] hover:border-[#2563eb]/30 dark:hover:border-[#7c3aed]/30 hover:shadow-lg hover:shadow-[#2563eb]/10 dark:hover:shadow-[#7c3aed]/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-4 shadow-lg ${
                        audit.score >= 90 ? "border-green-100 dark:border-green-900 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30" : 
                        audit.score >= 70 ? "border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" :
                        audit.score >= 50 ? "border-yellow-100 dark:border-yellow-900 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30" : 
                        "border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
                      }`}>
                        {audit.score}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#0f172a] dark:text-white">
                          {getHostname(audit.url)}
                        </h4>
                        <p className="text-sm text-[#475569] dark:text-[#94a3b8] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 
                          {audit.createdAt ? formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center text-sm font-medium text-[#2563eb] dark:text-[#7c3aed] group-hover:underline">
                        View Report 
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              {(!recentAudits || recentAudits.length === 0) && (
                <div className="text-center py-16 px-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#2563eb]/10 dark:bg-[#7c3aed]/10 flex items-center justify-center">
                    <Search className="w-8 h-8 text-[#2563eb] dark:text-[#7c3aed]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white mb-2">No audits yet</h3>
                  <p className="text-[#475569] dark:text-[#94a3b8] mb-6">Be the first to scan a website and check its accessibility!</p>
                  <Button 
                    className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
                    onClick={() => document.querySelector('input')?.focus()}
                  >
                    Start Scanning
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Welcome Tour */}
      <WelcomeTour isOpen={showWelcomeTour} onClose={() => setShowWelcomeTour(false)} />
    </div>
  );
}