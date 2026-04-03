import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black/30 backdrop-blur-xl border-t border-white/10 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-3">
            <Link 
              href="/legal/privacy" 
              className="hover:text-white transition-colors text-white/50 font-medium"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/legal/terms" 
              className="hover:text-white transition-colors text-white/50 font-medium"
            >
              Terms of Service
            </Link>
          </div>
          
          {/* Developer Credit */}
          <p className="text-white/60 text-sm flex items-center gap-2">
            <span>Developed with</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span>by</span>
            <span className="font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Waheed Aslam
            </span>
          </p>
          
          {/* Copyright */}
          <p className="text-xs text-white/40 mt-1">
            © {currentYear} Scanvas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}