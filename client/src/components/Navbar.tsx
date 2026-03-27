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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#334155] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo with gradient - removed icon */}
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              {/* Icon removed as requested */}
              <span className="text-xl font-bold bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
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
                      ? "text-[#2563eb] bg-[#2563eb]/10 dark:text-[#7c3aed] dark:bg-[#7c3aed]/10 font-medium"
                      : "text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#7c3aed] hover:bg-[#2563eb]/5 dark:hover:bg-[#7c3aed]/10"
                  }`}
                >
                  {item.name}
                  {location === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full"
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
            {/* ThemeToggle component would go here if available */}
            {status === "loading" ? (
              <div className="w-20 h-9 animate-pulse bg-[#f1f5f9] dark:bg-[#334155] rounded-full" />
            ) : session ? (
              <>
                <span className="text-sm text-[#475569] dark:text-[#94a3b8]">
                  {session.user?.email?.split('@')[0]}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="rounded-full border-[#2563eb]/20 hover:bg-red-50 hover:text-red-600"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })}
                className="rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button - ONLY menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-[#2563eb]/10 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-[#2563eb]" />
              ) : (
                <Menu className="w-6 h-6 text-[#475569] dark:text-[#94a3b8]" />
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
            className="md:hidden py-4 border-t border-[#e2e8f0] dark:border-[#334155] bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md"
          >
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start mb-1 ${
                    location === item.path
                      ? "text-[#2563eb] bg-[#2563eb]/10 dark:text-[#7c3aed] dark:bg-[#7c3aed]/10"
                      : "text-[#475569] dark:text-[#94a3b8]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {/* Mobile auth buttons */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#e2e8f0] dark:border-[#334155]">
              {status === "loading" ? (
                <div className="w-full h-9 animate-pulse bg-[#f1f5f9] dark:bg-[#334155] rounded-full" />
              ) : session ? (
                <>
                  <p className="text-sm text-[#475569] px-2">Signed in as {session.user?.email}</p>
                  <Button variant="outline" onClick={() => signOut()} className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })}
                  className="w-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
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