import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "./contexts/AppContext";
import Index from "./pages/Index";
import MvpSchedulePage from "./pages/MvpSchedulePage";
import MvpStatsPage from "./pages/MvpStatsPage";
import MvpSettingsPage from "./pages/MvpSettingsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Core Student MVP */}
              <Route path="/" element={<Index />} />
              <Route path="/stats" element={<MvpStatsPage />} />
              <Route path="/schedule" element={<MvpSchedulePage />} />
              <Route path="/settings" element={<MvpSettingsPage />} />

              {/* Legal */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
