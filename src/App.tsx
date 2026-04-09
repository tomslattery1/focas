import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "./contexts/AppContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import Index from "./pages/Index";
import MvpSchedulePage from "./pages/MvpSchedulePage";
import MvpStatsPage from "./pages/MvpStatsPage";
import MvpSettingsPage from "./pages/MvpSettingsPage";
import AchievementsPage from "./pages/AchievementsPage";
import BlockedCategoriesPage from "./pages/BlockedCategoriesPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import GuardianDashboard from "./pages/GuardianDashboard";
import GuardianSettingsPage from "./pages/GuardianSettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AppProvider>
          <GamificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Core Student MVP */}
              <Route path="/" element={<Index />} />
              <Route path="/stats" element={<MvpStatsPage />} />
              <Route path="/schedule" element={<MvpSchedulePage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/settings" element={<MvpSettingsPage />} />
              <Route path="/settings/blocked-categories" element={<BlockedCategoriesPage />} />

              {/* Guardian */}
              <Route path="/guardian" element={<GuardianDashboard />} />
              <Route path="/guardian/unlock" element={<GuardianDashboard />} />
              <Route path="/guardian/encourage" element={<GuardianDashboard />} />
              <Route path="/guardian/activity" element={<GuardianDashboard />} />
              <Route path="/guardian/settings" element={<GuardianSettingsPage />} />

              {/* Legal */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </GamificationProvider>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
