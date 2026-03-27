import React from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreGauge({ score, size = 120, strokeWidth = 10 }: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Professional scoring ranges with appropriate colors
  let colorClass = "text-red-500";
  let bgClass = "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";

  // Professional scoring ranges for better visual representation
  if (score >= 95) {
    colorClass = "text-emerald-500"; // Excellent - top tier sites
    bgClass = "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400";
  } else if (score >= 85) {
    colorClass = "text-green-500"; // Good - most commercial sites
    bgClass = "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400";
  } else if (score >= 70) {
    colorClass = "text-blue-500"; // Needs improvement
    bgClass = "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
  } else if (score >= 50) {
    colorClass = "text-yellow-500"; // Poor - significant issues
    bgClass = "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400";
  } else {
    colorClass = "text-red-500"; // Critical - urgent fixes needed
    bgClass = "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-[#e2e8f0] dark:text-[#334155]"
          />
          {/* Progress Circle with animation */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={colorClass}
          />
        </svg>
        {/* Score display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colorClass}`}>
            {score}
          </span>
          <span className="text-xs font-medium text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">
            SCORE
          </span>
        </div>
      </div>
    </div>
  );
}