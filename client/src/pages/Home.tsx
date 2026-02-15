import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateAudit, useAudits } from "@/hooks/use-audits";
import { ArrowRight, Search, Zap, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();
  const createAudit = useCreateAudit();
  const { data: recentAudits, isLoading } = useAudits();

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Simple URL validation/formatting
    let formattedUrl = url;
    if (!url.startsWith("http")) {
      formattedUrl = `https://${url}`;
    }

    try {
      const result = await createAudit.mutateAsync(formattedUrl);
      setLocation(`/audit/${result.id}`);
    } catch (err) {
      // Error is handled by the hook's toast
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60 animate-in fade-in duration-1000" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl opacity-60 animate-in fade-in duration-1000 delay-300" />
        </div>

        <div className="container max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Free Accessibility Checker</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Make the web accessible <br /> for everyone.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
              Scanvas instantly analyzes your website for accessibility violations using the industry-standard axe-core engine.
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800"
          >
            <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Enter website URL (e.g., apple.com)" 
                  className="pl-11 h-14 text-lg border-transparent focus-visible:ring-0 bg-transparent rounded-xl"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={createAudit.isPending}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-14 px-8 rounded-xl text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                disabled={createAudit.isPending}
              >
                {createAudit.isPending ? "Scanning..." : "Audit Now"}
              </Button>
            </form>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
            {[
              { title: "WCAG 2.1 Compliant", desc: "Checks against the latest international standards." },
              { title: "Instant Reports", desc: "Get detailed insights in seconds, not hours." },
              { title: "Actionable Fixes", desc: "Developers get exact code snippets to fix issues." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Audits Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold">Recent Audits</h2>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoading ? (
             <div className="grid gap-4">
               {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
             </div>
          ) : (
            <div className="grid gap-4">
              {recentAudits?.slice(0, 5).map((audit) => (
                <motion.div 
                  key={audit.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onClick={() => setLocation(`/audit/${audit.id}`)}
                  className="group flex items-center justify-between p-5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 bg-slate-50/50 dark:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 ${
                      audit.score >= 90 ? "border-green-100 text-green-700 bg-green-50" : 
                      audit.score >= 50 ? "border-yellow-100 text-yellow-700 bg-yellow-50" : 
                      "border-red-100 text-red-700 bg-red-50"
                    }`}>
                      {audit.score}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{new URL(audit.url).hostname}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                      View Report <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              ))}
              {recentAudits?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200">
                  No audits yet. Be the first to scan a website!
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
