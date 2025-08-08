import { supabase } from '@/integrations/supabase/client'

export interface DashboardStats {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  subscriptions: {
    free: number
    premium: number
    professional: number
    revenue: number
    growth: number
  }
  payments: {
    total: number
    succeeded: number
    failed: number
    revenue: number
  }
  aiUsage: {
    totalRequests: number
    activeKeys: number
    topUsers: Array<{
      userId: string
      email: string
      requests: number
    }>
  }
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  status: string
  subscription?: {
    plan: string
    status: string
    currentPeriodEnd?: string
  }
  lastLogin?: string
  createdAt: string
  updatedAt: string
  metadata?: {
    totalTrades?: number
    aiAnalysisCount?: number
    lastActivity?: string
  }
}

export interface Subscription {
  id: string
  userId: string
  plan: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  user?: {
    email: string
    displayName?: string
  }
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: string
  description: string
  createdAt: string
  user?: {
    email: string
    displayName?: string
  }
}

export interface APIKey {
  id: string
  userId: string
  keyId: string
  name: string
  lastUsed?: string
  usageCount: number
  isActive: boolean
  createdAt: string
  user?: {
    email: string
    displayName?: string
  }
}

export interface FeedbackLog {
  id: string
  userId: string
  tradeId?: string
  type: string
  content: string
  confidence?: number
  status: string
  createdAt: string
  user?: {
    email: string
    displayName?: string
  }
}

class AdminDataService {
  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get active users (users who logged in within last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', thirtyDaysAgo.toISOString())

      // Get new users (users created in last 30 days)
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Get subscription stats
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')

      const subscriptionStats = {
        free: 0,
        premium: 0,
        professional: 0,
        revenue: 0
      }

      subscriptions?.forEach(sub => {
        if (sub.plan === 'free') subscriptionStats.free++
        else if (sub.plan === 'premium') {
          subscriptionStats.premium++
          subscriptionStats.revenue += 29.99 // Mock premium price
        }
        else if (sub.plan === 'professional') {
          subscriptionStats.professional++
          subscriptionStats.revenue += 99.99 // Mock professional price
        }
      })

      // Get payment stats
      const { data: payments } = await supabase
        .from('payments')
        .select('*')

      const paymentStats = {
        total: payments?.length || 0,
        succeeded: payments?.filter(p => p.status === 'succeeded').length || 0,
        failed: payments?.filter(p => p.status === 'failed').length || 0,
        revenue: payments?.reduce((sum, p) => sum + (p.status === 'succeeded' ? p.amount : 0), 0) || 0
      }

      // Get API usage stats (mock data for now)
      const apiUsageStats = {
        totalRequests: 125000,
        activeKeys: 750,
        topUsers: [
          { userId: '1', email: 'user1@example.com', requests: 5000 },
          { userId: '2', email: 'user2@example.com', requests: 3500 },
          { userId: '3', email: 'user3@example.com', requests: 2800 }
        ]
      }

      return {
        users: {
          total: totalUsers || 0,
          active: activeUsers || 0,
          new: newUsers || 0,
          growth: 12.5 // Mock growth percentage
        },
        subscriptions: {
          ...subscriptionStats,
          growth: 8.3 // Mock growth percentage
        },
        payments: paymentStats,
        aiUsage: apiUsageStats
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // Users
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    plan?: string
  }) {
    try {
      let query = supabase
        .from('profiles')
        .select('*')

      if (params?.search) {
        query = query.or(`display_name.ilike.%${params.search}%,user_id.ilike.%${params.search}%`)
      }

      const page = params?.page || 1
      const limit = params?.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: users, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get subscription data for each user
      const usersWithSubscriptions = await Promise.all(
        (users || []).map(async (user) => {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.user_id)
            .single()

          return {
            id: user.user_id,
            email: user.user_id, // We'll need to get email from auth.users
            displayName: user.display_name,
            status: 'active', // Mock status
            subscription: subscription ? {
              plan: subscription.plan,
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end
            } : undefined,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            metadata: {
              totalTrades: 0, // Mock data
              aiAnalysisCount: 0, // Mock data
              lastActivity: user.updated_at
            }
          }
        })
      )

      return {
        users: usersWithSubscriptions,
        total: count || 0,
        page,
        limit,
        pagination: {
          totalPages: Math.ceil((count || 0) / limit),
          currentPage: page,
          hasNextPage: (page * limit) < (count || 0),
          hasPrevPage: page > 1
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  // Subscriptions
  async getSubscriptions(params?: {
    page?: number
    limit?: number
    status?: string
    plan?: string
  }) {
    try {
      let query = supabase
        .from('subscriptions')
        .select('*')

      if (params?.status) {
        query = query.eq('status', params.status)
      }

      if (params?.plan) {
        query = query.eq('plan', params.plan)
      }

      const page = params?.page || 1
      const limit = params?.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: subscriptions, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user data for each subscription
      const subscriptionsWithUsers = await Promise.all(
        (subscriptions || []).map(async (sub) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', sub.user_id)
            .single()

          return {
            id: sub.id,
            userId: sub.user_id,
            plan: sub.plan,
            status: sub.status,
            currentPeriodStart: sub.current_period_start,
            currentPeriodEnd: sub.current_period_end,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            user: {
              email: sub.user_id, // We'll need to get email from auth.users
              displayName: profile?.display_name
            }
          }
        })
      )

      return {
        subscriptions: subscriptionsWithUsers,
        total: count || 0,
        page,
        limit,
        pagination: {
          totalPages: Math.ceil((count || 0) / limit),
          currentPage: page,
          hasNextPage: (page * limit) < (count || 0),
          hasPrevPage: page > 1
        }
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      throw error
    }
  }

  // Payments
  async getPayments(params?: {
    page?: number
    limit?: number
    status?: string
    dateFrom?: string
    dateTo?: string
    userId?: string
  }) {
    try {
      let query = supabase
        .from('payments')
        .select('*')

      if (params?.status) {
        query = query.eq('status', params.status)
      }

      if (params?.userId) {
        query = query.eq('user_id', params.userId)
      }

      if (params?.dateFrom) {
        query = query.gte('created_at', params.dateFrom)
      }

      if (params?.dateTo) {
        query = query.lte('created_at', params.dateTo)
      }

      const page = params?.page || 1
      const limit = params?.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: payments, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user data for each payment
      const paymentsWithUsers = await Promise.all(
        (payments || []).map(async (payment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', payment.user_id)
            .single()

          return {
            id: payment.id,
            userId: payment.user_id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            description: payment.description,
            createdAt: payment.created_at,
            user: {
              email: payment.user_id, // We'll need to get email from auth.users
              displayName: profile?.display_name
            }
          }
        })
      )

      return {
        payments: paymentsWithUsers,
        total: count || 0,
        page,
        limit,
        pagination: {
          totalPages: Math.ceil((count || 0) / limit),
          currentPage: page,
          hasNextPage: (page * limit) < (count || 0),
          hasPrevPage: page > 1
        }
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      throw error
    }
  }

  // API Keys
  async getAPIKeys(params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
  }) {
    try {
      let query = supabase
        .from('api_keys')
        .select('*')

      if (params?.status) {
        query = query.eq('is_active', params.status === 'active')
      }

      if (params?.userId) {
        query = query.eq('user_id', params.userId)
      }

      const page = params?.page || 1
      const limit = params?.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: apiKeys, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user data for each API key
      const apiKeysWithUsers = await Promise.all(
        (apiKeys || []).map(async (key) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', key.user_id)
            .single()

          return {
            id: key.id,
            userId: key.user_id,
            keyId: key.key_hash.substring(0, 20) + '...', // Show partial key
            name: key.name,
            lastUsed: key.last_used,
            usageCount: key.usage_count,
            isActive: key.is_active,
            createdAt: key.created_at,
            user: {
              email: key.user_id, // We'll need to get email from auth.users
              displayName: profile?.display_name
            }
          }
        })
      )

      return {
        apiKeys: apiKeysWithUsers,
        total: count || 0,
        page,
        limit,
        pagination: {
          totalPages: Math.ceil((count || 0) / limit),
          currentPage: page,
          hasNextPage: (page * limit) < (count || 0),
          hasPrevPage: page > 1
        }
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      throw error
    }
  }

  // Feedback Logs
  async getFeedbackLogs(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    userId?: string
  }) {
    try {
      let query = supabase
        .from('feedback_logs')
        .select('*')

      if (params?.type) {
        query = query.eq('type', params.type)
      }

      if (params?.status) {
        query = query.eq('status', params.status)
      }

      if (params?.userId) {
        query = query.eq('user_id', params.userId)
      }

      const page = params?.page || 1
      const limit = params?.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: feedbackLogs, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user data for each feedback log
      const feedbackLogsWithUsers = await Promise.all(
        (feedbackLogs || []).map(async (log) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', log.user_id)
            .single()

          return {
            id: log.id,
            userId: log.user_id,
            tradeId: log.trade_id,
            type: log.type,
            content: log.content,
            confidence: log.confidence,
            status: log.status,
            createdAt: log.created_at,
            user: {
              email: log.user_id, // We'll need to get email from auth.users
              displayName: profile?.display_name
            }
          }
        })
      )

      return {
        feedback: feedbackLogsWithUsers,
        total: count || 0,
        page,
        limit,
        pagination: {
          totalPages: Math.ceil((count || 0) / limit),
          currentPage: page,
          hasNextPage: (page * limit) < (count || 0),
          hasPrevPage: page > 1
        }
      }
    } catch (error) {
      console.error('Error fetching feedback logs:', error)
      throw error
    }
  }
}

export const adminDataService = new AdminDataService()
