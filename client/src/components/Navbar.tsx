import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; // Removed Sparkles import
import { useState } from "react";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navItems = [
    { name: "Audit", path: "/audit" }, 
    { name: "History", path: "/history" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#334155] flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-[#334155]">
                Scanvas
              </span>
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
                      ? "text-[#334155] bg-[#334155]/10 font-medium"
                      : "text-[#64748b] hover:text-[#334155] hover:bg-[#334155]/5"
                  }`}
                >
                  {item.name}
                  {location === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#334155] rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side buttons - Auth */}
          <div className="hidden md:flex items-center gap-2">
            {status === "loading" ? (
              <div className="w-20 h-9 animate-pulse bg-[#f1f5f9] rounded-full" />
            ) : session ? (
              <>
                <span className="text-sm text-[#64748b]">
                  {session.user?.email?.split('@')[0]}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="rounded-full border-[#334155]/20 text-[#334155] hover:bg-[#334155] hover:text-white"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })}
                className="rounded-full bg-[#334155] hover:bg-[#5b6e8c] text-white"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-[#334155]/10 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-[#334155]" />
              ) : (
                <Menu className="w-6 h-6 text-[#64748b]" />
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
            className="md:hidden py-4 border-t border-[#e2e8f0] bg-white/90 backdrop-blur-md"
          >
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start mb-1 ${
                    location === item.path
                      ? "text-[#334155] bg-[#334155]/10"
                      : "text-[#64748b]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {/* Mobile auth buttons */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#e2e8f0]">
              {status === "loading" ? (
                <div className="w-full h-9 animate-pulse bg-[#f1f5f9] rounded-full" />
              ) : session ? (
                <>
                  <p className="text-sm text-[#64748b] px-2">Signed in as {session.user?.email}</p>
                  <Button variant="outline" onClick={() => signOut()} className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })}
                  className="w-full bg-[#334155] hover:bg-[#5b6e8c] text-white"
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}