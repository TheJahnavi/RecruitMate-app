import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CompanyAdminDashboard from "./pages/CompanyAdminDashboard";
import CompanyAdminSubscription from "./pages/CompanyAdminSubscription";
import HRDashboard from "./pages/HRDashboard";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Upload from "./pages/Upload";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/NotificationsPage";
import TestPage from "./pages/TestPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import HealthCheck from "./pages/HealthCheck";

function Router() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  console.log('App Router - Render started', { 
    isAuthenticated, 
    user, 
    isLoading, 
    initialCheckDone,
    location: window.location.href
  });

  // Handle login
  const handleLogin = (role: string) => {
    console.log('App Router - Handle login', { role });
    // Redirect to the appropriate dashboard after login
    if (role === "Super Admin") {
      setLocation("/super-admin/dashboard");
    } else if (role === "Company Admin") {
      setLocation("/company-admin/dashboard");
    } else if (role === "HR") {
      console.log('App Router - Redirecting HR user to dashboard');
      setLocation("/hr/dashboard");
    } else {
      // Default fallback
      setLocation("/");
    }
  };

  // Check initial auth state
  useEffect(() => {
    console.log('App Router - Initial auth check effect', { isLoading, isAuthenticated, user });
    if (!isLoading) {
      setInitialCheckDone(true);
      
      // If user is already authenticated and trying to access login page, redirect to dashboard
      const currentPath = window.location.pathname;
      if (isAuthenticated && (currentPath === "/login" || currentPath === "/signin")) {
        console.log('App Router - Already authenticated, redirecting to dashboard', { role: user?.role });
        if (user?.role === "Super Admin") {
          setLocation("/super-admin/dashboard");
        } else if (user?.role === "Company Admin") {
          setLocation("/company-admin/dashboard");
        } else if (user?.role === "HR") {
          setLocation("/hr/dashboard");
        } else {
          setLocation("/");
        }
      }
      
      // If user is authenticated and on the root path, redirect to their dashboard
      if (isAuthenticated && currentPath === "/") {
        console.log('App Router - Authenticated user on root path, redirecting to dashboard', { role: user?.role });
        if (user?.role === "Super Admin") {
          setLocation("/super-admin/dashboard");
        } else if (user?.role === "Company Admin") {
          setLocation("/company-admin/dashboard");
        } else if (user?.role === "HR") {
          setLocation("/hr/dashboard");
        } else {
          setLocation("/hr/dashboard"); // Default to HR dashboard if role is unclear
        }
      }
      
      // If user is not authenticated and trying to access protected routes, redirect to login
      if (!isAuthenticated && currentPath.startsWith("/hr/")) {
        console.log('App Router - Not authenticated, redirecting to login');
        setLocation("/login");
      }
    }
  }, [isAuthenticated, user, isLoading, setLocation]);

  // Show loading state while checking auth
  if (!initialCheckDone && isLoading) {
    console.log('App Router - Loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  console.log('App Router - Rendering routes');

  // Simple fallback route for debugging
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login">
        <Login onLogin={handleLogin} />
      </Route>
      <Route path="/signin">
        <Login onLogin={handleLogin} />
      </Route>
      <Route path="/signup" component={Signup} />
      <Route path="/register" component={Signup} />
      
      {/* Protected routes - Super Admin */}
      <Route path="/super-admin/dashboard" component={() => {
        console.log('Rendering Super Admin Dashboard route');
        return (
          <Layout>
            <SuperAdminDashboard />
          </Layout>
        );
      }} />
      <Route path="/super-admin/subscriptions" component={() => (
        <Layout>
          <CompanyAdminSubscription />
        </Layout>
      )} />
      <Route path="/super-admin/jobs" component={() => (
        <Layout>
          <Jobs />
        </Layout>
      )} />
      <Route path="/super-admin/candidates" component={() => (
        <Layout>
          <Candidates />
        </Layout>
      )} />
      <Route path="/super-admin/upload" component={() => (
        <Layout>
          <Upload />
        </Layout>
      )} />
      <Route path="/super-admin/profile" component={() => (
        <Layout>
          <Profile />
        </Layout>
      )} />
      <Route path="/super-admin/notifications" component={() => (
        <Layout>
          <NotificationsPage />
        </Layout>
      )} />
      
      {/* Protected routes - Company Admin */}
      <Route path="/company-admin/dashboard" component={() => {
        console.log('Rendering Company Admin Dashboard route');
        return (
          <Layout>
            <CompanyAdminDashboard />
          </Layout>
        );
      }} />
      <Route path="/company-admin/subscription" component={() => (
        <Layout>
          <CompanyAdminSubscription />
        </Layout>
      )} />
      <Route path="/company-admin/jobs" component={() => (
        <Layout>
          <Jobs />
        </Layout>
      )} />
      <Route path="/company-admin/candidates" component={() => (
        <Layout>
          <Candidates />
        </Layout>
      )} />
      <Route path="/company-admin/upload" component={() => (
        <Layout>
          <Upload />
        </Layout>
      )} />
      <Route path="/company-admin/profile" component={() => (
        <Layout>
          <Profile />
        </Layout>
      )} />
      <Route path="/company-admin/notifications" component={() => (
        <Layout>
          <NotificationsPage />
        </Layout>
      )} />
      
      {/* Protected routes - HR */}
      <Route path="/hr/dashboard" component={() => {
        console.log('Rendering HR Dashboard route');
        return (
          <Layout>
            <HRDashboard />
          </Layout>
        );
      }} />
      <Route path="/hr/jobs" component={() => (
        <Layout>
          <Jobs />
        </Layout>
      )} />
      <Route path="/hr/candidates" component={() => (
        <Layout>
          <Candidates />
        </Layout>
      )} />
      <Route path="/hr/upload" component={() => (
        <Layout>
          <Upload />
        </Layout>
      )} />
      <Route path="/hr/settings" component={() => (
        <Layout>
          <div className="min-h-screen bg-background p-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">HR Settings</h1>
            <p className="text-muted-foreground mb-4">Settings page for HR users</p>
          </div>
        </Layout>
      )} />
      <Route path="/hr/profile" component={() => (
        <Layout>
          <Profile />
        </Layout>
      )} />
      <Route path="/hr/notifications" component={() => (
        <Layout>
          <NotificationsPage />
        </Layout>
      )} />
      
      {/* Test route */}
      <Route path="/test" component={() => (
        <Layout>
          <TestPage />
        </Layout>
      )} />
      
      {/* Health check route */}
      <Route path="/health" component={HealthCheck} />
      
      {/* Redirect all other routes to landing page */}
      <Route>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-primary text-primary-foreground py-2 px-4 rounded hover:opacity-90 transition-opacity"
            >
              Go to Home
            </button>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  console.log('App - Render started');
  return (
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-foreground mb-2">Application Error</h2>
            <p className="text-muted-foreground mb-4">
              Something went wrong with the application. Please try refreshing the page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('demoUserEmail');
                  localStorage.removeItem('demoMode');
                  window.location.href = '/login';
                }}
                className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded hover:opacity-90 transition-opacity"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="smart-hire-ui-theme">
          <div className="min-h-screen bg-background">
            <Router />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;