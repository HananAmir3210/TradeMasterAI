import type { User, Subscription, Payment, APIKey, FeedbackLog, AdminSettings, DashboardStats } from '@/types'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock admin data
const mockAdmin = {
  id: '1',
  email: 'admin@trademaster.ai',
  name: 'Admin User',
  role: 'super_admin' as const,
  lastLogin: new Date().toISOString()
}

// Mock dashboard stats
const mockDashboardStats: DashboardStats = {
  users: {
    total: 1250,
    active: 890,
    new: 45,
    growth: 12.5
  },
  subscriptions: {
    free: 450,
    premium: 600,
    professional: 200,
    revenue: 45000,
    growth: 8.3
  },
  payments: {
    total: 1200,
    succeeded: 1150,
    failed: 50,
    revenue: 45000
  },
  apiUsage: {
    totalRequests: 125000,
    activeKeys: 750,
    topUsers: [
      { userId: '1', email: 'user1@example.com', requests: 5000 },
      { userId: '2', email: 'user2@example.com', requests: 3500 },
      { userId: '3', email: 'user3@example.com', requests: 2800 }
    ]
  }
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    status: 'active',
    subscription: {
      plan: 'premium',
      status: 'active',
      currentPeriodEnd: '2024-02-01T00:00:00Z'
    },
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    metadata: {
      totalTrades: 150,
      aiAnalysisCount: 75,
      lastActivity: '2024-01-15T10:30:00Z'
    }
  },
  {
    id: '2',
    email: 'user2@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    displayName: 'Jane Smith',
    status: 'active',
    subscription: {
      plan: 'free',
      status: 'active'
    },
    lastLogin: '2024-01-14T15:45:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
    metadata: {
      totalTrades: 25,
      aiAnalysisCount: 10,
      lastActivity: '2024-01-14T15:45:00Z'
    }
  }
]

// Mock subscriptions data
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: '1',
    plan: 'premium',
    status: 'active',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    cancelAtPeriodEnd: false,
    user: {
      email: 'user1@example.com',
      displayName: 'John Doe'
    }
  }
]

// Mock payments data
const mockPayments: Payment[] = [
  {
    id: '1',
    userId: '1',
    amount: 29.99,
    currency: 'USD',
    status: 'succeeded',
    description: 'Premium subscription',
    createdAt: '2024-01-01T00:00:00Z',
    user: {
      email: 'user1@example.com',
      displayName: 'John Doe'
    }
  }
]

// Mock API keys data
const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    userId: '1',
    keyId: 'sk-1234567890abcdef',
    name: 'Production API Key',
    lastUsed: '2024-01-15T10:30:00Z',
    usageCount: 5000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    user: {
      email: 'user1@example.com',
      displayName: 'John Doe'
    }
  }
]

// Mock feedback logs data
const mockFeedbackLogs: FeedbackLog[] = [
  {
    id: '1',
    userId: '1',
    tradeId: 'trade-123',
    type: 'ai_analysis',
    content: 'AI analysis provided accurate insights for the trade',
    confidence: 0.85,
    status: 'processed',
    createdAt: '2024-01-15T10:30:00Z',
    user: {
      email: 'user1@example.com',
      displayName: 'John Doe'
    }
  }
]

export const mockAdminApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(1000) // Simulate network delay
    
    // Mock validation - accept any email/password for testing
    if (email && password) {
      const token = 'mock-jwt-token-' + Date.now()
      return {
        admin: mockAdmin,
        token
      }
    } else {
      throw new Error('Email and password are required')
    }
  },

  getProfile: async () => {
    await delay(500)
    return mockAdmin
  },

  forgotPassword: async (email: string) => {
    await delay(1000)
    return { message: 'Password reset email sent' }
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(800)
    return mockDashboardStats
  },

  getUserGrowthData: async (period: '7d' | '30d' | '90d' = '30d') => {
    await delay(600)
    // Return array directly for charts
    return [
      { date: '2024-01-01', users: 100 },
      { date: '2024-01-02', users: 105 },
      { date: '2024-01-03', users: 110 },
      { date: '2024-01-04', users: 115 },
      { date: '2024-01-05', users: 120 },
      { date: '2024-01-06', users: 125 },
      { date: '2024-01-07', users: 130 },
      { date: '2024-01-08', users: 135 },
      { date: '2024-01-09', users: 140 },
      { date: '2024-01-10', users: 145 },
      { date: '2024-01-11', users: 150 },
      { date: '2024-01-12', users: 155 },
      { date: '2024-01-13', users: 160 },
      { date: '2024-01-14', users: 165 },
      { date: '2024-01-15', users: 170 }
    ]
  },

  getRevenueData: async (period: '7d' | '30d' | '90d' = '30d') => {
    await delay(600)
    // Return array directly for charts
    return [
      { date: '2024-01-01', revenue: 1000 },
      { date: '2024-01-02', revenue: 1200 },
      { date: '2024-01-03', revenue: 1100 },
      { date: '2024-01-04', revenue: 1300 },
      { date: '2024-01-05', revenue: 1400 },
      { date: '2024-01-06', revenue: 1350 },
      { date: '2024-01-07', revenue: 1500 },
      { date: '2024-01-08', revenue: 1600 },
      { date: '2024-01-09', revenue: 1550 },
      { date: '2024-01-10', revenue: 1700 },
      { date: '2024-01-11', revenue: 1800 },
      { date: '2024-01-12', revenue: 1750 },
      { date: '2024-01-13', revenue: 1900 },
      { date: '2024-01-14', revenue: 2000 },
      { date: '2024-01-15', revenue: 1950 }
    ]
  },

  // Users
  getUsers: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    plan?: string
  }) => {
    await delay(800)
    let filteredUsers = [...mockUsers]
    
    if (params?.search) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(params.search!.toLowerCase()) ||
        user.displayName.toLowerCase().includes(params.search!.toLowerCase())
      )
    }
    
    if (params?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status)
    }
    
    if (params?.plan) {
      filteredUsers = filteredUsers.filter(user => user.subscription.plan === params.plan)
    }
    
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      pagination: {
        totalPages: Math.ceil(filteredUsers.length / limit),
        currentPage: page,
        hasNextPage: endIndex < filteredUsers.length,
        hasPrevPage: page > 1
      }
    }
  },

  getUser: async (userId: string): Promise<User> => {
    await delay(500)
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    await delay(800)
    return { message: 'User updated successfully' }
  },

  suspendUser: async (userId: string, reason?: string) => {
    await delay(800)
    return { message: 'User suspended successfully' }
  },

  activateUser: async (userId: string) => {
    await delay(800)
    return { message: 'User activated successfully' }
  },

  resetUserPassword: async (userId: string) => {
    await delay(800)
    return { message: 'Password reset email sent' }
  },

  getUserActivity: async (userId: string) => {
    await delay(600)
    return {
      activities: [
        {
          id: '1',
          type: 'login',
          timestamp: '2024-01-15T10:30:00Z',
          details: 'User logged in from Chrome on Windows'
        }
      ]
    }
  },

  // Subscriptions
  getSubscriptions: async (params?: {
    page?: number
    limit?: number
    status?: string
    plan?: string
  }) => {
    await delay(800)
    let filteredSubscriptions = [...mockSubscriptions]
    
    if (params?.status) {
      filteredSubscriptions = filteredSubscriptions.filter(sub => sub.status === params.status)
    }
    
    if (params?.plan) {
      filteredSubscriptions = filteredSubscriptions.filter(sub => sub.plan === params.plan)
    }
    
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, endIndex)
    
    return {
      subscriptions: paginatedSubscriptions,
      total: filteredSubscriptions.length,
      page,
      limit,
      pagination: {
        totalPages: Math.ceil(filteredSubscriptions.length / limit),
        currentPage: page,
        hasNextPage: endIndex < filteredSubscriptions.length,
        hasPrevPage: page > 1
      }
    }
  },

  updateSubscription: async (subscriptionId: string, data: {
    plan?: string
    status?: string
  }) => {
    await delay(800)
    return { message: 'Subscription updated successfully' }
  },

  cancelSubscription: async (subscriptionId: string, immediate = false) => {
    await delay(800)
    return { message: 'Subscription cancelled successfully' }
  },

  // Payments
  getPayments: async (params?: {
    page?: number
    limit?: number
    status?: string
    dateFrom?: string
    dateTo?: string
    userId?: string
  }) => {
    await delay(800)
    let filteredPayments = [...mockPayments]
    
    if (params?.status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === params.status)
    }
    
    if (params?.userId) {
      filteredPayments = filteredPayments.filter(payment => payment.userId === params.userId)
    }
    
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex)
    
    return {
      payments: paginatedPayments,
      total: filteredPayments.length,
      page,
      limit,
      pagination: {
        totalPages: Math.ceil(filteredPayments.length / limit),
        currentPage: page,
        hasNextPage: endIndex < filteredPayments.length,
        hasPrevPage: page > 1
      }
    }
  },

  refundPayment: async (paymentId: string, amount?: number, reason?: string) => {
    await delay(800)
    return { message: 'Payment refunded successfully' }
  },

  // API Keys
  getAPIKeys: async (params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
  }) => {
    await delay(800)
    let filteredKeys = [...mockAPIKeys]
    
    if (params?.status) {
      filteredKeys = filteredKeys.filter(key => 
        params.status === 'active' ? key.isActive : !key.isActive
      )
    }
    
    if (params?.userId) {
      filteredKeys = filteredKeys.filter(key => key.userId === params.userId)
    }
    
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedKeys = filteredKeys.slice(startIndex, endIndex)
    
    return {
      apiKeys: paginatedKeys,
      total: filteredKeys.length,
      page,
      limit,
      pagination: {
        totalPages: Math.ceil(filteredKeys.length / limit),
        currentPage: page,
        hasNextPage: endIndex < filteredKeys.length,
        hasPrevPage: page > 1
      }
    }
  },

  revokeAPIKey: async (keyId: string) => {
    await delay(800)
    return { message: 'API key revoked successfully' }
  },

  getAPIUsageStats: async (keyId: string) => {
    await delay(600)
    return {
      totalRequests: 1000,
      successfulRequests: 950,
      failedRequests: 50,
      averageResponseTime: 150
    }
  },

  // Feedback & AI Logs
  getFeedbackLogs: async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    userId?: string
  }) => {
    await delay(800)
    let filteredFeedback = [...mockFeedbackLogs]
    
    if (params?.type) {
      filteredFeedback = filteredFeedback.filter(feedback => feedback.type === params.type)
    }
    
    if (params?.status) {
      filteredFeedback = filteredFeedback.filter(feedback => feedback.status === params.status)
    }
    
    if (params?.userId) {
      filteredFeedback = filteredFeedback.filter(feedback => feedback.userId === params.userId)
    }
    
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex)
    
    return {
      feedback: paginatedFeedback,
      total: filteredFeedback.length,
      page,
      limit,
      pagination: {
        totalPages: Math.ceil(filteredFeedback.length / limit),
        currentPage: page,
        hasNextPage: endIndex < filteredFeedback.length,
        hasPrevPage: page > 1
      }
    }
  },

  flagFeedback: async (feedbackId: string, reason: string) => {
    await delay(800)
    return { message: 'Feedback flagged successfully' }
  },

  deleteFeedback: async (feedbackId: string) => {
    await delay(800)
    return { message: 'Feedback deleted successfully' }
  },

  // Settings
  getSettings: async (): Promise<AdminSettings> => {
    await delay(600)
    return {
      allowNewRegistrations: true,
      maintenanceMode: false,
      maxFreeTrialDays: 14,
      emailNotifications: {
        newUsers: true,
        failedPayments: true,
        systemAlerts: true
      },
      apiLimits: {
        free: 100,
        premium: 1000,
        professional: 10000
      }
    }
  },

  updateSettings: async (settings: Partial<AdminSettings>) => {
    await delay(800)
    return { message: 'Settings updated successfully' }
  },

  // System
  getSystemHealth: async () => {
    await delay(500)
    return {
      status: 'healthy',
      uptime: 99.9,
      responseTime: 150,
      database: 'connected',
      cache: 'connected'
    }
  },

  exportData: async (type: 'users' | 'payments' | 'subscriptions', format: 'csv' | 'json' = 'csv') => {
    await delay(2000)
    return new Blob(['mock data'], { type: 'text/csv' })
  },

  // Global API Keys
  getGlobalAPIKeys: async () => {
    await delay(600)
    return [
      {
        id: '1',
        service: 'OpenAI',
        name: 'GPT-4 Production Key',
        key: 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz',
        isActive: true,
        lastUsed: '2024-01-15T10:30:00Z',
        usageCount: 15420,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        status: 'active'
      },
      {
        id: '2',
        service: 'Qwen',
        name: 'Qwen-Turbo Key',
        key: 'qwen-1234567890abcdefghijklmnopqrstuvwxyz',
        isActive: true,
        lastUsed: '2024-01-15T09:15:00Z',
        usageCount: 8920,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        status: 'active'
      },
      {
        id: '3',
        service: 'Anthropic',
        name: 'Claude-3 Key',
        key: 'sk-ant-1234567890abcdefghijklmnopqrstuvwxyz',
        isActive: false,
        lastUsed: '2024-01-10T14:20:00Z',
        usageCount: 3200,
        createdAt: '2024-01-08T00:00:00Z',
        updatedAt: '2024-01-10T14:20:00Z',
        status: 'inactive'
      }
    ]
  },

  updateGlobalAPIKey: async (data: { id: string; name?: string; key?: string; isActive?: boolean }) => {
    await delay(800)
    return { message: 'API key updated successfully' }
  },

  testGlobalAPIKey: async (keyId: string) => {
    await delay(1200)
    return { message: 'API key is valid and working correctly' }
  },

  rotateGlobalAPIKey: async (keyId: string) => {
    await delay(1500)
    return { message: 'API key rotated successfully' }
  },
} 