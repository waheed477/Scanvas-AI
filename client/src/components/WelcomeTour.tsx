import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Sparkles, Search, FileText, Share2, BarChart } from "lucide-react";

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    title: "Welcome to Scanvas! 👋",
    description: "Let's take a quick tour of how to check your website's accessibility.",
    icon: <Sparkles className="w-8 h-8 text-[#334155]" />,
    target: "hero"
  },
  {
    title: "Enter a URL",
    description: "Type or paste any website URL here. We'll analyze it for accessibility issues.",
    icon: <Search className="w-8 h-8 text-[#334155]" />,
    target: "url-input"
  },
  {
    title: "View Your Results",
    description: "Get a detailed accessibility score, issue breakdown, and fix suggestions.",
    icon: <FileText className="w-8 h-8 text-[#334155]" />,
    target: "score-section"
  },
  {
    title: "Share & Export",
    description: "Share reports with your team or export as PDF for documentation.",
    icon: <Share2 className="w-8 h-8 text-[#334155]" />,
    target: "share-section"
  },
  {
    title: "Track Progress",
    description: "View your audit history and see how your scores improve over time.",
    icon: <BarChart className="w-8 h-8 text-[#334155]" />,
    target: "history-section"
  }
];

export function WelcomeTour({ isOpen, onClose }: WelcomeTourProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('scanvas_tour_seen', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('scanvas_tour_seen', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-5 h-5 text-[#64748b]" />
          </button>

          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              {tourSteps[step].icon}
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">
              {tourSteps[step].title}
            </h3>
            <p className="text-[#475569] mb-6">
              {tourSteps[step].description}
            </p>
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={step === 0}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex gap-1">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === step ? 'bg-[#334155] w-4' : 'bg-[#e2e8f0]'
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={handleNext}
                className="bg-[#334155] text-white hover:bg-[#5b6e8c] gap-1"
              >
                {step === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}