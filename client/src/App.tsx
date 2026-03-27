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
import PrivacyPolicy from "@/pages/legal/privacy";
import TermsOfService from "@/pages/legal/terms";
import { CookieConsent } from "@/components/CookieConsent";
import { ProfessionalBackground } from "@/components/ProfessionalBackground";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/audit" component={AuditPage} />
      <Route path="/audit/:id" component={AuditDetails} />
      <Route path="/history" component={HistoryPage} />
      <Route path="/about" component={About} />
      <Route path="/legal/privacy" component={PrivacyPolicy} />
      <Route path="/legal/terms" component={TermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <SessionProvider basePath="/api/auth">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-white relative">
            <ProfessionalBackground />
            <Navbar />
            <main className="relative flex-grow">
              <Router />
            </main>
            <Footer />
            <Toaster />
            <CookieConsent />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;