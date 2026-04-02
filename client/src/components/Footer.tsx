import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/80 backdrop-blur-sm border-t border-[#e2e8f0] py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-3">
            <Link 
              href="/legal/privacy" 
              className="hover:text-[#334155] transition-colors text-[#64748b] font-medium"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/legal/terms" 
              className="hover:text-[#334155] transition-colors text-[#64748b] font-medium"
            >
              Terms of Service
            </Link>
          </div>
          
          {/* Developer Credit */}
          <p className="text-[#475569] text-sm flex items-center gap-2">
            <span>Developed with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <span className="font-semibold bg-gradient-to-r from-[#334155] to-[#5b6e8c] bg-clip-text text-transparent">
              Waheed Aslam
            </span>
          </p>
          
          {/* Copyright */}
          <p className="text-xs text-[#64748b] mt-1">
            © {currentYear} Scanvas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}