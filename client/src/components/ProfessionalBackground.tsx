import { motion } from "framer-motion";

export function ProfessionalBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base - Pure White */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Subtle Gray Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fafbfc] to-[#f8fafc]" />
      
      {/* Minimalist Grid - Light Gray */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="minimal-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#minimal-grid)" />
      </svg>
      
      {/* Soft Gray Orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-[#334155]/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-[#64748b]/3 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5b6e8c]/2 rounded-full blur-3xl" />
      
      {/* Floating Particles - Soft Gray */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-[#334155]/15 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -40, 40, -40],
            x: [null, 30, -30, 30],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Top Gradient Edge - Soft White */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent" />
      
      {/* Bottom Gradient Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  );
}