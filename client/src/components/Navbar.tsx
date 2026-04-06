import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Eye } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Audit", path: "/audit" }, 
    { name: "History", path: "/history" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <Eye className="w-5 h-5 text-[#1e293b]" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm -z-10 group-hover:blur-md transition-all" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-white leading-tight">
                  Scanvas
                </span>
                <span className="text-[10px] text-white/50 -mt-1 tracking-wide">
                  Accessibility First
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`relative px-4 py-2 rounded-full transition-all ${
                    location === item.path
                      ? "text-white bg-white/10 font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                  {location === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-white to-white/60 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Sign In Button - Simple Link */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={() => window.location.href = '/auth/signin'}
              className="rounded-full bg-white text-[#1e293b] hover:bg-white/90 shadow-lg"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white/70" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-white/10 bg-black/50 backdrop-blur-xl"
          >
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start mb-1 ${
                    location === item.path
                      ? "text-white bg-white/10"
                      : "text-white/60"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {/* Mobile Sign In Button */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
              <Button
                onClick={() => window.location.href = '/auth/signin'}
                className="w-full bg-white text-[#1e293b] hover:bg-white/90"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}