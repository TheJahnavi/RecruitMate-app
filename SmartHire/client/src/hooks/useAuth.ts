import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";

// Demo user data
const DEMO_USERS = {
  "superadmin@smarthire.com": {
    id: "sa-001",
    email: "superadmin@smarthire.com",
    name: "Super Admin User",
    role: "Super Admin",
    accountStatus: "active",
  },
  "admin@techcorp.com": {
    id: "ca-001",
    email: "admin@techcorp.com",
    name: "Company Admin User",
    role: "Company Admin",
    companyId: 1,
    accountStatus: "active",
  },
  "hr1@techcorp.com": {
    id: "hr-001",
    email: "hr1@techcorp.com",
    name: "HR User 1",
    role: "HR",
    companyId: 1,
    accountStatus: "active",
  },
  "hr2@techcorp.com": {
    id: "hr-002",
    email: "hr2@techcorp.com",
    name: "HR User 2",
    role: "HR",
    companyId: 1,
    accountStatus: "active",
  },
  "hr3@techcorp.com": {
    id: "hr-003",
    email: "hr3@techcorp.com",
    name: "HR User 3",
    role: "HR",
    companyId: 1,
    accountStatus: "active",
  },
} as Record<string, any>;

export function useAuth() {
  // Check if we're in demo mode by looking for a special header or environment variable
  const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
  
  console.log('useAuth - Checking auth state', { isDemoMode });
  
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      console.log('Fetching user data...');
      
      // In demo mode, check if we have a demo user stored
      if (isDemoMode) {
        const demoUserEmail = localStorage.getItem('demoUserEmail');
        console.log('Demo mode: Checking demo user', { demoUserEmail });
        if (demoUserEmail && DEMO_USERS[demoUserEmail]) {
          console.log('Demo mode: Returning demo user data');
          return DEMO_USERS[demoUserEmail] as User;
        }
        // If no demo user is set, return null (not authenticated)
        console.log('Demo mode: No valid demo user found');
        return null;
      }
      
      // In normal mode, make the API request
      console.log('Normal mode: Making API request');
      const response = await apiRequest("/api/auth/user", { method: "GET" });
      console.log('User data response:', response);
      return response;
    },
    retry: false,
  });

  // Log any errors
  if (error) {
    console.error('Auth error:', error);
  }

  console.log('useAuth - Returning auth state', { user, isLoading, isAuthenticated: !!user });
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}