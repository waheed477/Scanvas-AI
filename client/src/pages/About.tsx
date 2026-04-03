import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatementGenerator } from "@/components/StatementGenerator";
import { 
  ShieldCheck, 
  Zap, 
  History, 
  Globe, 
  Sparkles, 
  Target, 
  Users, 
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function About() {
  const [, setLocation] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const features = [
    {
      icon: <Zap className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Lightning Fast",
      desc: "Get comprehensive accessibility reports in seconds, not hours.",
      gradient: "from-yellow-500 to-orange-500",
      delay: 0.1
    },
    {
      icon: <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />,
      title: "WCAG 2.1+ Compliant",
      desc: "Tests against the latest international accessibility standards.",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.2
    },
    {
      icon: <History className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Track Progress",
      desc: "Monitor your accessibility improvements with detailed history.",
      gradient: "from-blue-500 to-indigo-500",
      delay: 0.3
    },
    {
      icon: <Globe className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Universal Access",
      desc: "Help build a web that's accessible to everyone, everywhere.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.4
    }
  ];

  const stats = [
    { value: "10K+", label: "Websites Scanned", icon: <Globe className="w-4 h-4 md:w-5 md:h-5" /> },
    { value: "50K+", label: "Issues Detected", icon: <Target className="w-4 h-4 md:w-5 md:h-5" /> },
    { value: "5K+", label: "Happy Developers", icon: <Users className="w-4 h-4 md:w-5 md:h-5" /> },
    { value: "100%", label: "Free Forever", icon: <Heart className="w-4 h-4 md:w-5 md:h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f16] via-[#0f172a] to-[#1a1f2e] relative">
      {/* Animated Background - Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-40 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className="container mx-auto py-8 md:py-16 px-3 md:px-4 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-8 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs md:text-sm font-medium mb-4 md:mb-6 border border-white/20">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>About Scanvas</span>
          </div>
          
          <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Building a more
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#94a3b8] to-white bg-clip-text text-transparent">
              inclusive web, together
            </span>
          </h1>
          
          <p className="text-sm md:text-xl text-white/60 max-w-2xl mx-auto px-3">
            Empowering developers and organizations to create accessible experiences 
            for everyone, regardless of ability.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-white/20 shadow-sm hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-white mx-auto mb-2 md:mb-3">
                {stat.icon}
              </div>
              <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs md:text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full max-w-xs md:max-w-md mx-auto grid grid-cols-2 mb-6 md:mb-8 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="about" className="text-xs md:text-sm px-2 md:px-4 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
              About Scanvas
            </TabsTrigger>
            <TabsTrigger value="statement" className="text-xs md:text-sm px-2 md:px-4 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
              Statement Generator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto mb-8 md:mb-16"
            >
              <Card className="border-white/20 shadow-md bg-white/10 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 text-sm md:text-lg">
                  <p className="text-white/70 leading-relaxed">
                    <span className="text-white font-semibold">Scanvas</span> was built to simplify the process of identifying and fixing web accessibility issues. 
                    We believe that <span className="text-white font-semibold">accessibility should be a foundational part of the development process</span>, not an afterthought.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    By providing instant, actionable feedback based on industry-standard testing rules (Axe-core), 
                    we help developers and site owners create experiences that work for everyone.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + feature.delay }}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all hover:scale-105 h-full">
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-white/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center max-w-2xl mx-auto px-3"
            >
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden border border-white/20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
                
                <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 relative z-10">
                  Ready to make your website accessible?
                </h2>
                <p className="text-sm md:text-lg text-white/70 mb-6 md:mb-8 relative z-10">
                  Join thousands of developers who are building a more inclusive web.
                </p>
                <Button 
                  size={isMobile ? "default" : "lg"}
                  className="bg-white text-[#1e293b] hover:bg-white/90 hover:scale-105 transition-all px-4 md:px-8 py-2 md:py-6 text-sm md:text-lg rounded-xl shadow-md relative z-10"
                  onClick={() => setLocation("/")}
                >
                  Start Scanning Now
                  <span className="ml-2">→</span>
                </Button>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="statement">
            <StatementGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}