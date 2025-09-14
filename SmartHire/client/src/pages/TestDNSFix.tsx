import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

export default function TestDNSFix() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testApiConnection = async () => {
    setIsTesting(true);
    setApiTestResult(null);
    try {
      // Test a simple API call to check if DNS resolution works
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        setApiTestResult('API connection successful!');
      } else {
        setApiTestResult(`API connection failed with status: ${response.status}`);
      }
    } catch (error: any) {
      setApiTestResult(`API connection error: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">DNS Fix Test</CardTitle>
          <CardDescription>Testing API connectivity and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Authentication Status:</h3>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>{isAuthenticated ? `Authenticated as ${user?.name}` : 'Not authenticated'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">API Connection Test:</h3>
            {apiTestResult ? (
              <p className={apiTestResult.includes('successful') ? 'text-green-600' : 'text-red-600'}>
                {apiTestResult}
              </p>
            ) : (
              <p>Click the button below to test API connectivity</p>
            )}
          </div>
          
          <Button 
            onClick={testApiConnection} 
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? 'Testing...' : 'Test API Connection'}
          </Button>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              This page tests whether the DNS resolution issue has been fixed. 
              If you can see this page and the API test works, the fix was successful.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}