import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-[#e2e8f0] dark:border-[#334155]">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              <p className="text-[#475569] dark:text-[#94a3b8]">Last updated: March 26, 2026</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-[#475569] dark:text-[#94a3b8]">
                  Scanvas collects website URLs you submit for accessibility auditing, along with the audit results and scores. We do not collect personal information unless you choose to share it via email or support requests.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-[#475569] dark:text-[#94a3b8]">
                  We use the URLs and audit data to provide accessibility analysis, generate reports, and improve our scanning engine. All data is stored securely and never shared with third parties.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
                <p className="text-[#475569] dark:text-[#94a3b8]">
                  Your audit data is stored in MongoDB Atlas with industry-standard encryption. We retain audit results for future reference and trend analysis.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
                <p className="text-[#475569] dark:text-[#94a3b8]">
                  You can request deletion of your audit data by contacting us. You are not required to create an account to use Scanvas.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
                <p className="text-[#475569] dark:text-[#94a3b8]">
                  If you have questions about this Privacy Policy, contact us at: <a href="mailto:privacy@scanvas.com" className="text-[#2563eb] hover:underline">privacy@scanvas.com</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}