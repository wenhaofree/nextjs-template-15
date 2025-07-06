'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * 仪表板功能组件
 */
const DashboardFeatures = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Features</CardTitle>
        <CardDescription>
          Dashboard functionality and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              View your analytics and insights
            </p>
          </div>
          <div>
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage users and permissions
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your dashboard settings
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFeatures;
