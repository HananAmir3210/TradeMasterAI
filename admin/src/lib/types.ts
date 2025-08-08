export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // Existing tables
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          trade_pair: string
          entry_price: number
          exit_price: number | null
          lot_size: number
          timeframe: string
          trade_type: string
          status: string
          chart_screenshot_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trade_pair: string
          entry_price: number
          exit_price?: number | null
          lot_size: number
          timeframe: string
          trade_type: string
          status?: string
          chart_screenshot_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trade_pair?: string
          entry_price?: number
          exit_price?: number | null
          lot_size?: number
          timeframe?: string
          trade_type?: string
          status?: string
          chart_screenshot_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_analysis: {
        Row: {
          id: string
          trade_id: string
          analysis_text: string
          insights: Json | null
          recommendations: string[] | null
          confidence_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          trade_id: string
          analysis_text: string
          insights?: Json | null
          recommendations?: string[] | null
          confidence_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          trade_id?: string
          analysis_text?: string
          insights?: Json | null
          recommendations?: string[] | null
          confidence_score?: number | null
          created_at?: string
        }
      }
      // Admin-specific tables
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'premium' | 'professional'
          status: 'active' | 'cancelled' | 'past_due' | 'incomplete'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'free' | 'premium' | 'professional'
          status?: 'active' | 'cancelled' | 'past_due' | 'incomplete'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'free' | 'premium' | 'professional'
          status?: 'active' | 'cancelled' | 'past_due' | 'incomplete'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          amount: number
          currency: string
          status: 'succeeded' | 'failed' | 'pending' | 'refunded'
          description: string
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          amount: number
          currency?: string
          status?: 'succeeded' | 'failed' | 'pending' | 'refunded'
          description: string
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          amount?: number
          currency?: string
          status?: 'succeeded' | 'failed' | 'pending' | 'refunded'
          description?: string
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          is_active: boolean
          last_used: string | null
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_hash: string
          is_active?: boolean
          last_used?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key_hash?: string
          is_active?: boolean
          last_used?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      global_api_keys: {
        Row: {
          id: string
          service: string
          name: string
          key_encrypted: string
          is_active: boolean
          last_used: string | null
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service: string
          name: string
          key_encrypted: string
          is_active?: boolean
          last_used?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service?: string
          name?: string
          key_encrypted?: string
          is_active?: boolean
          last_used?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          role: 'super_admin' | 'admin'
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'super_admin' | 'admin'
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'super_admin' | 'admin'
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      feedback_logs: {
        Row: {
          id: string
          user_id: string
          trade_id: string | null
          type: 'ai_analysis' | 'feature_request' | 'bug_report' | 'general'
          content: string
          confidence: number | null
          status: 'pending' | 'processed' | 'flagged' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trade_id?: string | null
          type: 'ai_analysis' | 'feature_request' | 'bug_report' | 'general'
          content: string
          confidence?: number | null
          status?: 'pending' | 'processed' | 'flagged' | 'deleted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trade_id?: string | null
          type?: 'ai_analysis' | 'feature_request' | 'bug_report' | 'general'
          content?: string
          confidence?: number | null
          status?: 'pending' | 'processed' | 'flagged' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Admin-specific types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  lastLogin?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  status: 'active' | 'suspended' | 'inactive'
  subscription: {
    plan: 'free' | 'premium' | 'professional'
    status: 'active' | 'cancelled' | 'past_due' | 'incomplete'
    currentPeriodEnd?: string
  }
  lastLogin: string
  createdAt: string
  updatedAt: string
  metadata: {
    totalTrades: number
    aiAnalysisCount: number
    lastActivity: string
  }
}

export interface Subscription {
  id: string
  userId: string
  plan: 'free' | 'premium' | 'professional'
  status: 'active' | 'cancelled' | 'past_due' | 'incomplete'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  user: {
    email: string
    displayName: string
  }
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending' | 'refunded'
  description: string
  createdAt: string
  user: {
    email: string
    displayName: string
  }
}

export interface APIKey {
  id: string
  userId: string
  keyId: string
  name: string
  lastUsed: string
  usageCount: number
  isActive: boolean
  createdAt: string
  user: {
    email: string
    displayName: string
  }
}

export interface GlobalAPIKey {
  id: string
  service: string
  name: string
  key: string
  isActive: boolean
  lastUsed: string
  usageCount: number
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive'
}

export interface FeedbackLog {
  id: string
  userId: string
  tradeId: string | null
  type: 'ai_analysis' | 'feature_request' | 'bug_report' | 'general'
  content: string
  confidence: number | null
  status: 'pending' | 'processed' | 'flagged' | 'deleted'
  createdAt: string
  user: {
    email: string
    displayName: string
  }
}

export interface AdminSettings {
  allowNewRegistrations: boolean
  maintenanceMode: boolean
  maxFreeTrialDays: number
  emailNotifications: {
    newUsers: boolean
    failedPayments: boolean
    systemAlerts: boolean
  }
  apiLimits: {
    free: number
    premium: number
    professional: number
  }
}

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
  apiUsage: {
    totalRequests: number
    activeKeys: number
    topUsers: Array<{
      userId: string
      email: string
      requests: number
    }>
  }
} 