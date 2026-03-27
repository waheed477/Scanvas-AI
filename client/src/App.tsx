import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import AuditPage from "@/pages/AuditPage";
import AuditDetails from "@/pages/AuditDetails";
import HistoryPage from "@/pages/History";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/audit" component={AuditPage} />
      <Route path="/audit/:id" component={AuditDetails} />
      <Route path="/history" component={HistoryPage} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <SessionProvider basePath="/api/auth">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] relative flex flex-col">
            <div className="fixed inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#2563eb]/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#7c3aed]/10 to-transparent rounded-full blur-3xl" />
            </div>
            <Navbar />
            <main className="relative flex-grow">
              <Router />
            </main>
            <Footer />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;