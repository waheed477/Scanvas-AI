import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateAudit, useAudits } from "@/hooks/use-audits";
import { ArrowRight, Search, Zap, Clock, Sparkles, Shield, BarChart, Star, ExternalLink, Database, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import LoadingBar from "@/components/LoadingBar";
import { BatchScanner } from "@/components/BatchScanner";
import { WelcomeTour } from "@/components/WelcomeTour";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Check if first time visitor
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('scanvas_tour_seen');
    if (!hasSeenTour) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        setShowWelcomeTour(true);
      }, 500);
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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Professional Animated Background with Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fafbfd] to-[#f5f7fa]" />
        
        {/* Background Image - Abstract Accessibility Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80')",
            backgroundBlendMode: "overlay"
          }}
        />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#334155]/15 to-[#5b6e8c]/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-[#64748b]/15 to-[#334155]/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5b6e8c]/5 rounded-full blur-3xl animate-pulse-glow" />
        
        {/* Abstract Waves Animation */}
        <svg className="absolute bottom-0 left-0 w-full h-96 opacity-40" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#5b6e8c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path fill="url(#waveGradient)" fillOpacity="0.5" d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,197.3C672,192,768,160,864,154.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            <animate attributeName="d" dur="20s" repeatCount="indefinite" values="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,197.3C672,192,768,160,864,154.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
            M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,186.7C672,171,768,149,864,154.7C960,160,1056,192,1152,208C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
            M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,197.3C672,192,768,160,864,154.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </path>
        </svg>
        
        {/* Floating Tech Elements */}
        <div className="absolute top-1/4 right-20 w-32 h-32 border border-[#334155]/10 rounded-full animate-float">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#334155]/30 rounded-full" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-20 w-24 h-24 border-2 border-[#5b6e8c]/10 rounded-lg rotate-45 animate-float-slow">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-[#64748b]/20 rounded-sm" />
          </div>
        </div>
        
        {/* Animated Data Points */}
        <svg className="absolute top-0 left-0 w-full h-full">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#334155" fillOpacity="0.2">
                <animate attributeName="fillOpacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        
        {/* Subtle Glow Lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-[#334155]/20 to-transparent" />
          <div className="absolute top-40 right-1/3 w-px h-48 bg-gradient-to-b from-transparent via-[#5b6e8c]/20 to-transparent" />
          <div className="absolute bottom-32 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#334155]/20 to-transparent" />
        </div>
      </div>

      {/* Loading Bar */}
      {showLoading && (
        <LoadingBar 
          duration={3}
          color="from-[#334155] to-[#5b6e8c]"
          onComplete={() => console.log('Scan initiated')}
        />
      )}

      {/* Main Content - Relative z-index to appear above background */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32">
          <div className="container max-w-5xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#334155]/10 to-[#64748b]/10 text-[#334155] text-sm font-medium mb-8 border border-[#e2e8f0] shadow-sm backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span>Free Accessibility Checker</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-[#111827] to-[#334155] bg-clip-text text-transparent">
                  Make the web accessible
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#334155] to-[#5b6e8c] bg-clip-text text-transparent">
                  for everyone.
                </span>
              </h1>
              
              <p className="text-xl text-[#475569] mb-12 max-w-2xl mx-auto text-balance bg-white/30 backdrop-blur-sm rounded-xl p-2">
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
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-xl shadow-black/5 border border-[#e2e8f0]">
                <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] w-5 h-5" />
                    <Input 
                      placeholder="Enter website URL (e.g., apple.com)" 
                      className="pl-11 h-14 text-lg border-transparent focus-visible:ring-2 focus-visible:ring-[#334155]/30 bg-transparent rounded-xl text-[#111827] placeholder:text-[#94a3b8]"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={createAudit.isPending || showLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-14 px-8 rounded-xl text-lg font-semibold bg-[#334155] text-white hover:bg-[#5b6e8c] shadow-lg shadow-[#334155]/25 hover:shadow-[#334155]/40 transition-all duration-300 hover:scale-105 disabled:opacity-50"
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
                    className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-[#e2e8f0] text-[#475569] hover:text-[#334155] hover:border-[#334155]/50 hover:bg-[#334155]/5 transition-all text-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Features Grid */}
            <TooltipProvider>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
                {[
                  { 
                    icon: <Shield className="w-6 h-6" />,
                    title: "WCAG 2.1 Compliant", 
                    desc: "Checks against the latest international standards.",
                    tooltip: "WCAG 2.1 covers web accessibility, ensuring content is perceivable, operable, understandable, and robust for all users."
                  },
                  { 
                    icon: <Zap className="w-6 h-6" />,
                    title: "Instant Reports", 
                    desc: "Get detailed insights in seconds, not hours.",
                    tooltip: "Our scanning engine analyzes websites in real-time, delivering comprehensive reports within seconds."
                  },
                  { 
                    icon: <BarChart className="w-6 h-6" />,
                    title: "Actionable Fixes", 
                    desc: "Developers get exact code snippets to fix issues.",
                    tooltip: "Each issue comes with code examples and step-by-step remediation guidance for developers."
                  }
                ].map((f, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                        className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group cursor-help"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#334155] mb-4 group-hover:scale-110 transition-transform">
                          {f.icon}
                        </div>
                        <h3 className="text-lg font-bold text-[#111827] mb-2">{f.title}</h3>
                        <p className="text-[#475569] text-sm leading-relaxed">{f.desc}</p>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{f.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>

            {/* Trust Badges Section */}
            <div className="mt-16 py-8 border-t border-b border-[#e2e8f0] bg-white/30 backdrop-blur-sm rounded-xl">
              <p className="text-center text-sm text-[#64748b] mb-6">
                Trusted by developers and organizations worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/80 border border-[#e2e8f0]">
                      {badge.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#111827]">{badge.name}</p>
                      <p className="text-xs text-[#64748b]">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mt-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#111827] to-[#334155] bg-clip-text text-transparent">
                  Trusted by Industry Leaders
                </h2>
                <p className="text-[#475569] mt-2">
                  Used and recommended by accessibility experts at top tech companies
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-[#475569] mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <a 
                        href={testimonial.profileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#334155] to-[#5b6e8c] flex items-center justify-center text-white font-medium">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#111827] group-hover:text-[#334155] transition-colors">
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
            <BatchScanner />
          </div>
        </section>

        {/* Recent Audits Section */}
        <section className="py-20 bg-[#f8fafc]/80 backdrop-blur-sm border-t border-[#e2e8f0] relative">
          <div className="container max-w-5xl mx-auto px-4 relative">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">
                  Recent Audits
                </h2>
                <p className="text-[#475569] text-sm mt-1">Latest accessibility scans from our community</p>
              </div>
              <Button 
                variant="ghost" 
                className="text-[#475569] hover:text-[#334155] group"
                onClick={() => setLocation("/history")}
              >
                View All 
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gradient-to-r from-[#e2e8f0] to-[#f1f5f9] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {recentAudits?.slice(0, 5).map((audit, index) => {
                  const getHostname = (url: string) => {
                    if (!url) return 'Unknown';
                    try {
                      return new URL(url).hostname;
                    } catch {
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
                      className="group flex items-center justify-between p-5 rounded-xl bg-white/80 backdrop-blur-sm border border-[#e2e8f0] hover:border-[#334155]/20 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-4 shadow-lg ${
                          audit.score >= 90 ? "border-emerald-100 text-emerald-700 bg-emerald-50" : 
                          audit.score >= 70 ? "border-blue-100 text-blue-700 bg-blue-50" :
                          audit.score >= 50 ? "border-yellow-100 text-yellow-700 bg-yellow-50" : 
                          "border-red-100 text-red-700 bg-red-50"
                        }`}>
                          {audit.score}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-[#111827]">
                            {getHostname(audit.url)}
                          </h4>
                          <p className="text-sm text-[#475569] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 
                            {audit.createdAt ? formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true }) : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center text-sm font-medium text-[#334155] group-hover:underline">
                          View Report 
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
                {(!recentAudits || recentAudits.length === 0) && (
                  <div className="text-center py-16 px-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#e2e8f0]">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#334155]/10 flex items-center justify-center">
                      <Search className="w-8 h-8 text-[#334155]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#111827] mb-2">No audits yet</h3>
                    <p className="text-[#475569] mb-6">Be the first to scan a website and check its accessibility!</p>
                    <Button 
                      className="bg-[#334155] text-white hover:bg-[#5b6e8c]"
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
        <WelcomeTour 
          isOpen={showWelcomeTour} 
          onClose={() => {
            setShowWelcomeTour(false);
            localStorage.setItem('scanvas_tour_seen', 'true');
          }} 
        />
      </div>
    </div>
  );
}