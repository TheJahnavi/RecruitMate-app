import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../components/ThemeProvider";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { Bell, CheckSquare, Moon, Sun, Brain } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Notifications from "../pages/Notifications";
import { apiRequest } from "../lib/queryClient";
import { ErrorBoundary } from "./ErrorBoundary";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  console.log('Layout - Render started', { isAuthenticated, user, location });

  const { data: notifications = [], error: notificationsError } = useQuery<any[]>({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const response = await apiRequest("/api/notifications", { method: "GET" });
      return response;
    },
    enabled: isAuthenticated,
  });

  if (notificationsError) {
    console.error('Notifications error:', notificationsError);
  }

  const unreadCount = notifications?.filter((n: any) => !n.readStatus).length || 0;

  const getNavigationItems = () => {
    if (!user?.role) return [];

    switch (user.role) {
      case "Super Admin":
        return [
          { href: "/super-admin/dashboard", label: "Dashboard", testId: "nav-dashboard" },
          { href: "/super-admin/subscriptions", label: "Subscriptions", testId: "nav-subscriptions" },
        ];
      case "Company Admin":
        return [
          { href: "/company-admin/dashboard", label: "Dashboard", testId: "nav-dashboard" },
          { href: "/company-admin/jobs", label: "Jobs", testId: "nav-jobs" },
          { href: "/company-admin/candidates", label: "Candidates", testId: "nav-candidates" },
          { href: "/company-admin/upload", label: "Upload & Add", testId: "nav-upload" },
        ];
      case "HR":
        return [
          { href: "/hr/dashboard", label: "Dashboard", testId: "nav-dashboard" },
          { href: "/hr/jobs", label: "Jobs", testId: "nav-jobs" },
          { href: "/hr/candidates", label: "Candidates", testId: "nav-candidates" },
          { href: "/hr/upload", label: "Upload & Add", testId: "nav-upload" },
        ];
      default:
        return [];
    }
  };

  const getDefaultHref = () => {
    if (!user?.role) return "/";
    switch (user.role) {
      case "Super Admin": return "/super-admin/dashboard";
      case "Company Admin": return "/company-admin/dashboard";
      case "HR": return "/hr/dashboard";
      default: return "/";
    }
  };

  const getProfileHref = () => {
    if (!user?.role) return "/profile";
    switch (user.role) {
      case "Super Admin": return "/super-admin/profile";
      case "Company Admin": return "/company-admin/profile";
      case "HR": return "/hr/profile";
      default: return "/profile";
    }
  };

  const getNotificationsHref = () => {
    if (!user?.role) return "/notifications";
    switch (user.role) {
      case "Super Admin": return "/super-admin/notifications";
      case "Company Admin": return "/company-admin/notifications";
      case "HR": return "/hr/notifications";
      default: return "/notifications";
    }
  };

  const navigationItems = getNavigationItems();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = (path: string) => location === path;

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Layout - Not authenticated, redirecting to login');
    setLocation("/login");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  console.log('Layout - Rendering children', { children });

  // If children is null or undefined, show a fallback
  if (!children) {
    console.log('Layout - No children, showing fallback');
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-foreground">Loading content...</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary text-primary-foreground py-2 px-4 rounded hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-card shadow-sm z-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href={getDefaultHref()}>
                <div className="flex items-center space-x-3 cursor-pointer" data-testid="nav-logo">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Brain className="text-primary-foreground" size={20} />
                  </div>
                  <span className="text-xl font-bold text-foreground">Smart Hiring</span>
                </div>
              </Link>

              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href} data-testid={item.testId}>
                    <span
                      className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                        isActive(item.href) ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Right Side Items */}
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  data-testid="theme-toggle"
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(true)}
                  className="relative"
                  data-testid="notifications-button"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* User Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.name || ""} />
                        <AvatarFallback>
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href={getProfileHref()}>
                        <span className="w-full cursor-pointer" data-testid="profile-link">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={getNotificationsHref()}>
                        <span className="w-full cursor-pointer" data-testid="notifications-link">Notifications</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={async () => {
                        try {
                          // Check if we're in demo mode
                          const isDemoMode = localStorage.getItem('demoMode') === 'true';
                          
                          if (isDemoMode) {
                            // In demo mode, just clear the demo user data
                            localStorage.removeItem('demoUserEmail');
                            localStorage.removeItem('demoMode');
                          } else {
                            // In normal mode, make the API call to logout
                            await fetch('/api/auth/logout', { method: 'POST' });
                          }
                          setLocation('/login');
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                      }}
                      data-testid="logout-button"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-16">
          {children || (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg text-foreground">Loading content...</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-primary text-primary-foreground py-2 px-4 rounded hover:opacity-90 transition-opacity"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Modal */}
        {showNotifications && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <Notifications onClose={() => setShowNotifications(false)} />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}