import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AdminGlobalAPIKeys: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Global API Keys Management</h1>
        <p className="text-muted-foreground">
          Manage global API keys for AI services and external integrations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global API Keys</CardTitle>
          <CardDescription>
            Manage API keys for OpenAI, Anthropic, and other AI services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display global API key management features including:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Add and manage OpenAI API keys</li>
            <li>• Configure Anthropic Claude keys</li>
            <li>• Monitor API usage and costs</li>
            <li>• Rotate keys securely</li>
            <li>• Test API connectivity</li>
            <li>• Usage analytics and reporting</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminGlobalAPIKeys 