import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/AdminLogin'
import AdminOverview from './pages/AdminOverview'
import AdminUsers from './pages/AdminUsers'
import AdminSubscriptions from './pages/AdminSubscriptions'
import AdminPayments from './pages/AdminPayments'
import AdminAPIKeys from './pages/AdminAPIKeys'
import AdminGlobalAPIKeys from './pages/AdminGlobalAPIKeys'
import AdminFeedback from './pages/AdminFeedback'
import AdminSettings from './pages/AdminSettings'
import AdminForgotPassword from './pages/AdminForgotPassword'

interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin'
}

const AdminWrapper: React.FC = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const location = useLocation()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      console.log('Checking admin auth...')
      
      // Check localStorage for admin status
      const isAdmin = localStorage.getItem('isAdmin') === 'true'
      
      if (isAdmin) {
        console.log('Admin user found in localStorage')
        setAdminUser({
          id: 'admin-1',
          email: 'admin@trademaster.ai',
          role: 'super_admin'
        })
        setError(null)
      } else {
        console.log('No admin user found')
        setAdminUser(null)
      }
    } catch (error) {
      console.error('Error checking admin auth:', error)
      setError('Authentication error. Please try again.')
      setAdminUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Remove admin status from localStorage
      localStorage.removeItem('isAdmin')
      setAdminUser(null)
      setError(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error('Error logging out:', error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Show error if there's a critical error
  if (error && !adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Admin Panel Error
            </h2>
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-500"
            >
              Try again
            </button>
            <br />
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              ← Back to main site
            </a>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated, show login page
  if (!adminUser) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin onLogin={checkAdminAuth} />} />
        <Route path="/forgot-password" element={<AdminForgotPassword />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    )
  }

  // If authenticated, show admin dashboard
  return (
    <AdminLayout adminUser={adminUser} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/overview" element={<AdminOverview />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/subscriptions" element={<AdminSubscriptions />} />
        <Route path="/payments" element={<AdminPayments />} />
        <Route path="/api-keys" element={<AdminAPIKeys />} />
        <Route path="/global-api-keys" element={<AdminGlobalAPIKeys />} />
        <Route path="/feedback" element={<AdminFeedback />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminWrapper 