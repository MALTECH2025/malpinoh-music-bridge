
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Calendar, DollarSign, Music, Settings, Upload } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

const SidebarItem = ({ href, icon, title, isActive = false }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const isAdmin = user?.isAdmin;
  const isActive = (path: string) => pathname === path;

  const artistLinks = [
    {
      href: "/dashboard",
      icon: <Music className="h-4 w-4" />,
      title: "Dashboard",
    },
    {
      href: "/releases",
      icon: <Calendar className="h-4 w-4" />,
      title: "Releases",
    },
    {
      href: "/upload",
      icon: <Upload className="h-4 w-4" />,
      title: "Upload Music",
    },
    {
      href: "/earnings",
      icon: <DollarSign className="h-4 w-4" />,
      title: "Earnings & Withdrawals",
    },
    {
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
      title: "Settings",
    },
  ];

  const adminLinks = [
    {
      href: "/admin",
      icon: <Music className="h-4 w-4" />,
      title: "Admin Dashboard",
    },
    {
      href: "/admin/releases",
      icon: <Calendar className="h-4 w-4" />,
      title: "Manage Releases",
    },
    {
      href: "/admin/withdrawals",
      icon: <DollarSign className="h-4 w-4" />,
      title: "Manage Withdrawals",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
      title: "Settings",
    },
  ];

  const links = isAdmin ? adminLinks : artistLinks;

  return (
    <aside className="sticky top-16 z-30 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        {links.map((link) => (
          <SidebarItem
            key={link.href}
            href={link.href}
            icon={link.icon}
            title={link.title}
            isActive={isActive(link.href)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
