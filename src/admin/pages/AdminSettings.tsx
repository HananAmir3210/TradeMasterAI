import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and manage admin preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure global system settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display system configuration features including:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Enable/disable user registrations</li>
            <li>• Set maintenance mode</li>
            <li>• Configure email notifications</li>
            <li>• Set API usage limits</li>
            <li>• Manage admin user permissions</li>
            <li>• System health monitoring</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSettings 