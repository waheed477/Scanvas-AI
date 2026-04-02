import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Mail, FileText, Database, Users } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "1. Information We Collect",
      content: "Scanvas collects website URLs you submit for accessibility auditing, along with the audit results and scores. We do not collect personal information unless you choose to share it via email or support requests."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "2. How We Use Your Information",
      content: "We use the URLs and audit data to provide accessibility analysis, generate reports, and improve our scanning engine. All data is stored securely and never shared with third parties."
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "3. Data Security",
      content: "Your audit data is stored in MongoDB Atlas with industry-standard encryption. We retain audit results for future reference and trend analysis."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "4. Your Rights",
      content: "You can request deletion of your audit data by contacting us. You are not required to create an account to use Scanvas."
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "5. Contact Us",
      content: "If you have questions about this Privacy Policy, contact us at:",
      isContact: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef2f6] py-12 md:py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#334155]/10 to-[#5b6e8c]/10 text-[#334155] text-sm font-medium mb-6 border border-[#e2e8f0] backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              <span>Legal & Privacy</span>
            </div>
          </div>

          <Card className="border-[#e2e8f0] shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] to-white pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#334155] to-[#5b6e8c] flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#111827] to-[#334155] bg-clip-text text-transparent">
                    Privacy Policy
                  </CardTitle>
                  <p className="text-[#64748b] mt-1">Last updated: March 26, 2026</p>
                </div>
              </div>
              <p className="text-[#475569] mt-4 pl-0 md:pl-16">
                At Scanvas, we take your privacy seriously. This policy describes how we collect, use, and protect your information.
              </p>
            </CardHeader>
            
            <CardContent className="p-6 md:p-8 space-y-6">
              {sections.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#334155]/10 to-[#5b6e8c]/10 flex items-center justify-center text-[#334155] group-hover:scale-110 transition-transform">
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[#111827] mb-2">
                        {section.title}
                      </h2>
                      <p className="text-[#475569] leading-relaxed">
                        {section.content}
                      </p>
                      {section.isContact && (
                        <a 
                          href="mailto:privacy@scanvas.com" 
                          className="inline-flex items-center gap-2 mt-3 text-[#334155] font-medium hover:text-[#5b6e8c] transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          privacy@scanvas.com
                          <span className="text-xs">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                  {idx < sections.length - 1 && (
                    <div className="border-b border-[#e2e8f0] my-6" />
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-xs text-[#64748b]">
              This Privacy Policy is effective as of March 26, 2026. We may update this policy from time to time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}