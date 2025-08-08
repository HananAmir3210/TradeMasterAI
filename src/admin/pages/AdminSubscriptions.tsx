import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AdminSubscriptions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions Management</h1>
        <p className="text-muted-foreground">
          Manage user subscriptions, plans, and billing information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscriptions Overview</CardTitle>
          <CardDescription>
            View and manage all user subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display subscription management features including:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• View all active subscriptions</li>
            <li>• Manage subscription plans</li>
            <li>• Handle cancellations and upgrades</li>
            <li>• Monitor subscription metrics</li>
            <li>• Export subscription data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSubscriptions 