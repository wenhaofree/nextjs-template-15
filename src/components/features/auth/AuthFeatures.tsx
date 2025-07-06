'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn, signOut } from 'next-auth/react';

/**
 * 认证功能组件
 */
const AuthFeatures = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>
          Current user authentication information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Welcome back!</h3>
              <p className="text-sm text-muted-foreground">
                {user?.name || user?.email}
              </p>
            </div>
            <Button onClick={() => signOut()} variant="outline">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Not signed in</h3>
              <p className="text-sm text-muted-foreground">
                Sign in to access your account
              </p>
            </div>
            <Button onClick={() => signIn()}>
              Sign In
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthFeatures;
