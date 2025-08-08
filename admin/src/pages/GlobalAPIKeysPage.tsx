import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockAdminApi } from '@/lib/mockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Brain,
  Zap,
  Shield,
  Lock
} from 'lucide-react'

interface GlobalAPIKey {
  id: string
  service: string
  name: string
  key: string
  isActive: boolean
  lastUsed?: string
  usageCount: number
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'error'
}

export default function GlobalAPIKeysPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<GlobalAPIKey>>({})

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['global-api-keys'],
    queryFn: mockAdminApi.getGlobalAPIKeys,
  })

  const updateKeyMutation = useMutation({
    mutationFn: mockAdminApi.updateGlobalAPIKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-api-keys'] })
      toast({
        title: 'API Key Updated',
        description: 'The API key has been successfully updated.',
      })
      setEditingKey(null)
      setFormData({})
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update API key',
        variant: 'destructive',
      })
    },
  })

  const testKeyMutation = useMutation({
    mutationFn: mockAdminApi.testGlobalAPIKey,
    onSuccess: (data) => {
      toast({
        title: 'Test Successful',
        description: `API key is working correctly. ${data.message}`,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Test Failed',
        description: error.response?.data?.message || 'API key test failed',
        variant: 'destructive',
      })
    },
  })

  const rotateKeyMutation = useMutation({
    mutationFn: mockAdminApi.rotateGlobalAPIKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-api-keys'] })
      toast({
        title: 'Key Rotated',
        description: 'API key has been successfully rotated.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to rotate API key',
        variant: 'destructive',
      })
    },
  })

  const handleEdit = (key: GlobalAPIKey) => {
    setEditingKey(key.id)
    setFormData({
      name: key.name,
      key: key.key,
      isActive: key.isActive,
    })
  }

  const handleSave = () => {
    if (editingKey && formData.key) {
      updateKeyMutation.mutate({ id: editingKey, ...formData })
    }
  }

  const handleTest = (keyId: string) => {
    testKeyMutation.mutate(keyId)
  }

  const handleRotate = (keyId: string) => {
    if (confirm('Are you sure you want to rotate this API key? This will invalidate the current key.')) {
      rotateKeyMutation.mutate(keyId)
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'inactive':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'openai':
        return <Brain className="h-4 w-4" />
      case 'qwen':
        return <Zap className="h-4 w-4" />
      case 'anthropic':
        return <Shield className="h-4 w-4" />
      default:
        return <Key className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2 animate-fade-in ml-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Global API Keys</h1>
          <p className="text-muted-foreground">Manage AI service API keys for the platform</p>
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="w-32 h-6 bg-muted rounded animate-pulse" />
                <div className="w-48 h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="w-full h-10 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 animate-fade-in ml-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Global API Keys</h1>
          <p className="text-muted-foreground">Manage AI service API keys for the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowKeys({})}
            className="gap-2"
          >
            {Object.values(showKeys).some(Boolean) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {Object.values(showKeys).some(Boolean) ? 'Hide All' : 'Show All'}
          </Button>
        </div>
      </div>

      {/* API Keys Grid */}
      <div className="grid gap-3">
        {apiKeys?.map((apiKey) => (
          <Card key={apiKey.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getServiceIcon(apiKey.service)}
                  <div>
                    <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {apiKey.service} • {getStatusBadge(apiKey.status)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={apiKey.isActive}
                    onCheckedChange={(checked) => {
                      updateKeyMutation.mutate({ 
                        id: apiKey.id, 
                        isActive: checked 
                      })
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingKey === apiKey.id ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Name</Label>
                    <Input
                      id="keyName"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter key name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showKeys[apiKey.id] ? 'text' : 'password'}
                        value={formData.key || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                        placeholder="Enter API key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={updateKeyMutation.isPending}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {updateKeyMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingKey(null)
                        setFormData({})
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="relative">
                      <Input
                        type={showKeys[apiKey.id] ? 'text' : 'password'}
                        value={apiKey.key}
                        readOnly
                        className="pr-10 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Last Used:</span>
                      <p>{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Usage Count:</span>
                      <p>{apiKey.usageCount.toLocaleString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(apiKey)}
                      className="gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleTest(apiKey.id)}
                      disabled={testKeyMutation.isPending}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {testKeyMutation.isPending ? 'Testing...' : 'Test'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRotate(apiKey.id)}
                      disabled={rotateKeyMutation.isPending}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {rotateKeyMutation.isPending ? 'Rotating...' : 'Rotate'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Lock className="h-5 w-5" />
            Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-orange-700">
            <p>• API keys are encrypted and stored securely in the database</p>
            <p>• Keys are only accessible to authorized backend services</p>
            <p>• Regular key rotation is recommended for enhanced security</p>
            <p>• Monitor usage patterns and rotate keys if suspicious activity is detected</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 