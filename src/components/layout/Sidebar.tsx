
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Upload,
  Music2,
  DollarSign,
  Settings,
  Users,
  FileCheck,
  CreditCard,
  GanttChart,
  BookText,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

const Sidebar = ({ className, isCollapsed = false }: SidebarProps) => {
  const { user } = useAuth();
  
  const isAdmin = user?.isAdmin;

  const navItems = isAdmin
    ? [
        { href: "/admin", label: "Overview", icon: BarChart3 },
        { href: "/admin/artists", label: "Artists", icon: Users },
        { href: "/admin/releases", label: "Releases", icon: FileCheck },
        { href: "/admin/withdrawals", label: "Withdrawals", icon: CreditCard },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", icon: GanttChart },
        { href: "/upload", label: "Upload", icon: Upload },
        { href: "/releases", label: "Releases", icon: Music2 },
        { href: "/earnings", label: "Earnings", icon: DollarSign },
        { href: "/settings", label: "Settings", icon: Settings },
      ];
  
  // Add legal links at the bottom for all users
  const legalItems = [
    { href: "/legal", label: "Legal", icon: BookText },
  ];

  return (
    <div
      className={cn(
        "bg-background pb-12 border-r flex flex-col h-screen sticky top-0",
        isCollapsed ? "w-[80px]" : "w-[240px]",
        className
      )}
    >
      <div className="flex-1">
        <div className="px-3 py-2 mb-8">
          <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight", 
            isCollapsed && "sr-only"
          )}>
            Navigation
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                      isCollapsed && "justify-center px-2"
                    )
                  }
                >
                  <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legal links section */}
      <div className="px-3 py-2 mt-auto">
        <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight", 
          isCollapsed && "sr-only"
        )}>
          Resources
        </h2>
        <div className="space-y-1">
          {legalItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )
                }
              >
                <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
