
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LoadingSpinner from "../LoadingSpinner";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const MainLayout = ({ 
  children, 
  requireAuth = false,
  adminOnly = false
}: MainLayoutProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  // Handle authentication requirements
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle admin-only pages
  if (adminOnly && (!user || !user.isAdmin)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // For dashboard/admin pages with sidebar
  if (requireAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    );
  }

  // For public pages without sidebar
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
