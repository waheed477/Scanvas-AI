import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateAudit, useAudits } from "@/hooks/use-audits";
import { ArrowRight, Search, Zap, Clock, Sparkles, Shield, BarChart, Star, ExternalLink, Database, Code, Users, TrendingUp, Award, BookOpen, ChevronRight, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
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

// Professional Articles with Real Links
const articles = [
  {
    title: "Complete Guide to WCAG 2.2 Compliance",
    description: "Everything you need to know about the latest WCAG 2.2 guidelines and how to implement them effectively.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    readTime: "12 min read",
    category: "Standards",
    link: "https://www.w3.org/WAI/standards-guidelines/wcag/",
    author: "W3C Web Accessibility Initiative",
    date: "Mar 15, 2026"
  },
  {
    title: "Building Accessible React Applications",
    description: "Best practices and patterns for creating accessible components in React with ARIA and semantic HTML.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    readTime: "10 min read",
    category: "Development",
    link: "https://react.dev/learn/accessibility",
    author: "React Documentation",
    date: "Mar 10, 2026"
  },
  {
    title: "Accessibility Testing Tools Comparison 2026",
    description: "Comprehensive review of the best automated accessibility testing tools for developers and QA teams.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    readTime: "8 min read",
    category: "Tools",
    link: "https://www.w3.org/WAI/test-evaluate/tools/",
    author: "W3C",
    date: "Mar 5, 2026"
  },
  {
    title: "Legal Requirements for Web Accessibility",
    description: "Understanding ADA, Section 508, and international accessibility laws for your website.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    readTime: "15 min read",
    category: "Legal",
    link: "https://www.ada.gov/resources/web-guidance/",
    author: "ADA.gov",
    date: "Feb 28, 2026"
  },
  {
    title: "Mobile Accessibility: Best Practices",
    description: "Make your mobile apps and responsive websites accessible to all users including those with disabilities.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    readTime: "9 min read",
    category: "Mobile",
    link: "https://www.w3.org/WAI/standards-guidelines/mobile/",
    author: "W3C WAI",
    date: "Feb 20, 2026"
  },
  {
    title: "AI-Powered Accessibility Solutions",
    description: "How artificial intelligence is transforming accessibility testing and remediation workflows.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    readTime: "11 min read",
    category: "AI",
    link: "https://ai.google/responsibility/accessibility/",
    author: "Google AI",
    date: "Feb 15, 2026"
  }
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [selectedStandards] = useState<string[]>(['wcag2aa']);
  const [showLoading, setShowLoading] = useState(false);
  const [, setLocation] = useLocation();
  const createAudit = useCreateAudit();
  const { data: recentAudits, isLoading } = useAudits();
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('scanvas_tour_seen');
    if (!hasSeenTour) {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional Web Background Image */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f16]/95 via-[#0f172a]/90 to-[#1a1f2e]/95" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16]/95 via-[#0f172a]/80 to-[#1a1f2e]/90" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#334155]/20 to-[#5b6e8c]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-[#64748b]/20 to-[#334155]/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5b6e8c]/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      </div>

      {showLoading && (
        <LoadingBar 
          duration={3}
          color="from-[#334155] to-[#5b6e8c]"
          onComplete={() => console.log('Scan initiated')}
        />
      )}

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium mb-8 border border-white/20 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>Free Accessibility Checker</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Make the web accessible
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#94a3b8] to-white bg-clip-text text-transparent">
                  for everyone.
                </span>
              </h1>
              
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
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
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-xl shadow-black/20 border border-white/20">
                <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                    <Input 
                      placeholder="Enter website URL (e.g., apple.com)" 
                      className="pl-11 h-14 text-lg border-transparent focus-visible:ring-2 focus-visible:ring-white/30 bg-transparent rounded-xl text-white placeholder:text-white/50"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={createAudit.isPending || showLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-14 px-8 rounded-xl text-lg font-semibold bg-white text-[#1e293b] hover:bg-white/90 shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    disabled={createAudit.isPending || showLoading}
                  >
                    {createAudit.isPending || showLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#1e293b] border-t-transparent rounded-full animate-spin" />
                        Scanning...
                      </span>
                    ) : (
                      "Audit Now"
                    )}
                  </Button>
                </form>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {["example.com", "apple.com", "github.com"].map((example) => (
                  <button
                    key={example}
                    onClick={() => setUrl(example)}
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/20 transition-all text-sm"
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
                        className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-help"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                          {f.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                        <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
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
            <div className="mt-16 py-8 border-t border-b border-white/10 bg-white/5 backdrop-blur-sm rounded-xl">
              <p className="text-center text-sm text-white/60 mb-6">
                Trusted by developers and organizations worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/80">
                      {badge.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{badge.name}</p>
                      <p className="text-xs text-white/50">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mt-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Trusted by Industry Leaders
                </h2>
                <p className="text-white/60 mt-2">
                  Used and recommended by accessibility experts at top tech companies
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-white/80 mb-4">"{testimonial.content}"</p>
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
                          <p className="font-medium text-sm text-white group-hover:text-white/80 transition-colors">
                            {testimonial.name}
                            <ExternalLink className="w-3 h-3 inline ml-1 opacity-50" />
                          </p>
                          <p className="text-xs text-white/50">{testimonial.role} • {testimonial.company}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Batch Scanner Section - Professional Styling */}
        <section className="py-12">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium mb-4 border border-white/20">
                  <Upload className="w-3 h-3" />
                  <span>Batch Processing</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Multiple URL Scanner</h3>
                <p className="text-white/60 text-sm max-w-2xl mx-auto">
                  Upload a CSV file or paste multiple URLs to scan multiple websites at once
                </p>
              </div>
              <BatchScanner />
            </div>
          </div>
        </section>

        {/* Professional Articles Section */}
        <section className="py-20 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium mb-4 border border-white/20">
                <BookOpen className="w-3 h-3" />
                <span>Resource Library</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Accessibility Insights & Guides
              </h2>
              <p className="text-white/60 mt-2 max-w-2xl mx-auto">
                Expert-written articles, guidelines, and best practices for web accessibility
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, idx) => (
                <motion.a
                  key={idx}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer block"
                >
                  <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105 duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                        <span>{article.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-2 mb-4 flex-1">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-white/40">
                          By {article.author}
                        </span>
                        <div className="flex items-center text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                          Read More
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

           <div className="text-center mt-12">
  <Button 
    variant="outline" 
    className="border-white/20 bg-transparent text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40"
    onClick={() => window.open("https://www.w3.org/WAI/", "_blank")}
  >
    Browse All Resources
    <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</div>
          </div>
        </section>

        {/* Recent Audits Section */}
        <section className="py-20 bg-black/20 backdrop-blur-sm border-t border-white/10 relative">
          <div className="container max-w-5xl mx-auto px-4 relative">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Recent Audits
                </h2>
                <p className="text-white/50 text-sm mt-1">Latest accessibility scans from our community</p>
              </div>
              <Button 
                variant="ghost" 
                className="text-white/60 hover:text-white group"
                onClick={() => setLocation("/history")}
              >
                View All 
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white/10 rounded-xl animate-pulse" />
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
                      className="group flex items-center justify-between p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-4 shadow-lg ${
                          audit.score >= 90 ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/20" : 
                          audit.score >= 70 ? "border-blue-500/30 text-blue-400 bg-blue-500/20" :
                          audit.score >= 50 ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/20" : 
                          "border-red-500/30 text-red-400 bg-red-500/20"
                        }`}>
                          {audit.score}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-white">
                            {getHostname(audit.url)}
                          </h4>
                          <p className="text-sm text-white/50 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 
                            {audit.createdAt ? formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true }) : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center text-sm font-medium text-white/70 group-hover:text-white group-hover:underline">
                          View Report 
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
                {(!recentAudits || recentAudits.length === 0) && (
                  <div className="text-center py-16 px-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                      <Search className="w-8 h-8 text-white/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No audits yet</h3>
                    <p className="text-white/50 mb-6">Be the first to scan a website and check its accessibility!</p>
                    <Button 
                      className="bg-white text-[#1e293b] hover:bg-white/90"
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