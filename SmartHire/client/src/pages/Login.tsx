import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Brain, CheckCircle, XCircle } from "lucide-react";

interface LoginProps {
  onLogin: (role: string) => void;
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  title: string;
  description: string;
}

// Test credentials mapping
const TEST_CREDENTIALS = {
  "superadmin@smarthire.com": {
    password: "password123",
    role: "Super Admin",
    company: "Platform Admin"
  },
  "admin@techcorp.com": {
    password: "password123",
    role: "Company Admin",
    company: "TechCorp Inc"
  },
  "admin@startupxyz.com": {
    password: "password123",
    role: "Company Admin",
    company: "StartupXYZ"
  },
  "hr1@techcorp.com": {
    password: "password123",
    role: "HR",
    company: "TechCorp Inc"
  },
  "hr2@techcorp.com": {
    password: "password123",
    role: "HR",
    company: "TechCorp Inc"
  },
  "hr@startupxyz.com": {
    password: "password123",
    role: "HR",
    company: "StartupXYZ"
  },
  "recruiter@innovatelabs.com": {
    password: "password123",
    role: "HR",
    company: "InnovateLabs"
  }
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["Super Admin", "Company Admin", "HR"], {
    required_error: "Please select a role",
  }),
  company: z.string().optional(),
}).refine((data) => {
  // Company is required for non-Super Admin roles
  if (data.role !== "Super Admin" && !data.company) {
    return false;
  }
  return true;
}, {
  message: "Company is required for Company Admin and HR roles",
  path: ["company"],
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
      company: "",
    },
  });

  const selectedRole = form.watch("role");
  const showCompanyField = selectedRole && selectedRole !== "Super Admin";

  // Simple toast function
  const showToast = (type: 'success' | 'error', title: string, description: string) => {
    const id = Date.now();
    const newToast = { id, type, title, description };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Demo authentication using test credentials
      const user = TEST_CREDENTIALS[data.email as keyof typeof TEST_CREDENTIALS];
      
      if (!user) {
        throw new Error("User not found. Please use test credentials.");
      }
      
      if (user.password !== data.password) {
        throw new Error("Invalid password");
      }
      
      if (user.role !== data.role) {
        throw new Error("Invalid role for this user");
      }
      
      if (data.role !== "Super Admin" && user.company !== data.company) {
        throw new Error("Invalid company for this user");
      }
      
      // Set demo mode and user in localStorage
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoUserEmail', data.email);
      
      showToast('success', 'Login successful', `Welcome back, ${data.role}!`);

      // Call the login handler with a small delay to show the success message
      setTimeout(() => {
        console.log('Login - Calling onLogin with role:', data.role);
        onLogin(data.role);
      }, 500);
      
    } catch (error: any) {
      showToast('error', 'Login failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = (role: string) => {
    const demoUsers = Object.entries(TEST_CREDENTIALS).filter(([_, user]) => user.role === role);
    if (demoUsers.length > 0) {
      const [email, user] = demoUsers[0];
      form.setValue("email", email);
      form.setValue("password", user.password);
      form.setValue("role", user.role as any);
      if (user.role !== "Super Admin") {
        form.setValue("company", user.company);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center p-4">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <div className="font-medium">{toast.title}</div>
              <div className="text-sm opacity-90">{toast.description}</div>
            </div>
          </div>
        ))}
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl">Smart Hiring</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Credential Buttons */}
          <div className="mb-6 space-y-2">
            <p className="text-sm font-medium text-gray-700">Quick Demo Login:</p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("Super Admin")}
                className="text-xs"
              >
                Super Admin Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("Company Admin")}
                className="text-xs"
              >
                Company Admin Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("HR")}
                className="text-xs"
              >
                HR Demo
              </Button>
            </div>
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-gray-500">Or login manually:</p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                data-testid="email-input"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={form.watch("role") || ""}
                onValueChange={(value) => form.setValue("role", value as any)}
              >
                <SelectTrigger data-testid="role-select">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Company Admin">Company Admin</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            {/* Company (conditional) */}
            {showCompanyField && (
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Enter your company name"
                  {...form.register("company")}
                  data-testid="company-input"
                />
                {form.formState.errors.company && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.company.message}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...form.register("password")}
                data-testid="password-input"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="login-button"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
              <p className="font-medium">Demo Credentials:</p>
              <p>Super Admin: superadmin@smarthire.com / password123</p>
              <p>Company Admin: admin@techcorp.com / password123</p>
              <p>HR: hr1@techcorp.com / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}