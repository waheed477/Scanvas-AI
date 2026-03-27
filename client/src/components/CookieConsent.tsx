import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
    // Initialize Google Analytics if accepted
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-[#e2e8f0] dark:border-[#334155] p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-[#2563eb]/10">
                    <Cookie className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0f172a] dark:text-white mb-1">
                      We value your privacy
                    </h4>
                    <p className="text-sm text-[#475569] dark:text-[#94a3b8] max-w-2xl">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
                    </p>
                    <div className="flex gap-4 mt-3">
                      <a href="/legal/privacy" className="text-xs text-[#2563eb] hover:underline">
                        Privacy Policy
                      </a>
                      <a href="/legal/terms" className="text-xs text-[#2563eb] hover:underline">
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    onClick={declineCookies}
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={acceptCookies}
                    size="sm"
                    className="flex-1 md:flex-none bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}