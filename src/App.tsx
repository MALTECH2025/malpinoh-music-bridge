
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Upload from "./pages/dashboard/Upload";
import Releases from "./pages/dashboard/Releases";
import Earnings from "./pages/dashboard/Earnings";
import Settings from "./pages/dashboard/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReleases from "./pages/admin/AdminReleases";
import ManageArtists from "./pages/admin/ManageArtists";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./contexts/AuthContext";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Copyright from "./pages/legal/Copyright";
import Legal from "./pages/legal/Legal";
import ResetPassword from "./pages/settings/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Legal Pages */}
            <Route path="/legal" element={<Legal />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/copyright" element={<Copyright />} />

            {/* Artist Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/reset-password" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/artists" element={<ManageArtists />} />
            <Route path="/admin/releases" element={<AdminReleases />} />
            <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
