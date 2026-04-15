import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Assets from "@/pages/Assets";
import AssetDetail from "@/pages/AssetDetail";
import SubmitAsset from "@/pages/SubmitAsset";
import Markets from "@/pages/Markets";
import TradePage from "@/pages/Trade";
import Portfolio from "@/pages/Portfolio";
import StakeRT from "@/pages/StakeRT";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth pages — no sidebar */}
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Main app — with sidebar */}
            <Route element={<AppLayout />}>
              <Route path="/"              element={<Dashboard />} />
              <Route path="/assets"        element={<Assets />} />
              <Route path="/assets/submit" element={<SubmitAsset />} />
              <Route path="/assets/:id"    element={<AssetDetail />} />
              <Route path="/markets"       element={<Markets />} />
              <Route path="/trade"         element={<TradePage />} />
              <Route path="/portfolio"     element={<Portfolio />} />
              <Route path="/stake"         element={<StakeRT />} />
              <Route path="/settings"      element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;