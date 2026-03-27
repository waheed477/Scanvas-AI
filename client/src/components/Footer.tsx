import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm border-t border-[#e2e8f0] dark:border-[#334155] py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-[#475569] dark:text-[#94a3b8] text-sm flex items-center gap-2">
            <span>Developed</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <span className="font-semibold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
              Waheed Aslam
            </span>
          </p>
          <p className="text-xs text-[#64748b] dark:text-[#64748b] mt-1">
            © {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}