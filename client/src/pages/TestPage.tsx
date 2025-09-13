import { useAuth } from "../hooks/useAuth";

export default function TestPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Test Page</h1>
        
        <div className="bg-card rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            {user && (
              <>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>User Email:</strong> {user.email}</p>
                <p><strong>User Name:</strong> {user.name}</p>
                <p><strong>User Role:</strong> {user.role}</p>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Debug Actions</h2>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground py-2 px-4 rounded hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('demoUserEmail');
                localStorage.removeItem('demoMode');
                window.location.href = '/login';
              }}
              className="bg-destructive text-destructive-foreground py-2 px-4 rounded hover:opacity-90 transition-opacity"
            >
              Clear Auth & Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}