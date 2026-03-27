import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingBarProps {
  duration?: number;
  color?: string;
  onComplete?: () => void;
}

export default function LoadingBar({ 
  duration = 5, 
  color = "from-[#2563eb] to-[#7c3aed]",
  onComplete 
}: LoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration * 10));
        if (newProgress >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
          className={`h-full bg-gradient-to-r ${color}`}
        />
      </div>
      
      {/* Percentage Counter - Small and subtle */}
      <div className="flex justify-end mt-1">
        <span className="text-xs font-medium text-[#2563eb] dark:text-[#7c3aed]">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}