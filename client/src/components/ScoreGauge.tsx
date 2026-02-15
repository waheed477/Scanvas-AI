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

  let colorClass = "text-red-500";
  let bgClass = "bg-red-50 text-red-700";
  
  if (score >= 90) {
    colorClass = "text-green-500";
    bgClass = "bg-green-50 text-green-700";
  } else if (score >= 50) {
    colorClass = "text-yellow-500";
    bgClass = "bg-yellow-50 text-yellow-700";
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
            className="text-muted/20"
          />
          {/* Progress Circle */}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colorClass.replace("text-", "text-")}`}>
            {score}
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</span>
        </div>
      </div>
    </div>
  );
}
