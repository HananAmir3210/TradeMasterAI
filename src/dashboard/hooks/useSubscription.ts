import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Subscription = Tables<'subscriptions'>;

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }

        if (!user) {
          setSubscription(null);
          return;
        }

        // Fetch subscription data
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subscriptionError) {
          if (subscriptionError.code === 'PGRST116') {
            // No subscription found, create a default free subscription
            const now = new Date();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            
            const { data: newSubscription, error: createError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: user.id,
                plan: 'free',
                status: 'active',
                current_period_start: now.toISOString(),
                current_period_end: nextMonth.toISOString(),
                cancel_at_period_end: false
              })
              .select()
              .single();

            if (createError) {
              console.warn('Failed to create default subscription:', createError);
              setSubscription(null);
            } else {
              setSubscription(newSubscription);
            }
          } else {
            console.warn('Error fetching subscription:', subscriptionError);
            setSubscription(null);
          }
        } else {
          setSubscription(subscriptionData);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchSubscription();
        } else if (event === 'SIGNED_OUT') {
          setSubscription(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateSubscription = async (newPlan: string): Promise<{ success: boolean; error?: string }> => {
    if (!subscription) {
      return { success: false, error: 'No subscription found' };
    }

    try {
      setUpdating(true);
      
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          plan: newPlan,
          current_period_start: now.toISOString(),
          current_period_end: nextMonth.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', subscription.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        return { success: false, error: error.message };
      }

      setSubscription(data);
      return { success: true };
    } catch (err) {
      console.error('Error updating subscription:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An unexpected error occurred' 
      };
    } finally {
      setUpdating(false);
    }
  };

  const getPlanDisplayName = (plan: string): string => {
    switch (plan.toLowerCase()) {
      case 'free':
        return 'Free Plan';
      case 'premium':
        return 'Premium Plan';
      case 'professional':
        return 'Professional Plan';
      default:
        return plan;
    }
  };

  const getPlanFeatures = (plan: string): string[] => {
    switch (plan.toLowerCase()) {
      case 'free':
        return [
          'Basic trade analysis',
          'Limited AI insights',
          'Standard support'
        ];
      case 'premium':
        return [
          'Advanced trade analysis',
          'Unlimited AI insights',
          'Priority support',
          'Custom alerts'
        ];
      case 'professional':
        return [
          'All Premium features',
          'Advanced analytics',
          'API access',
          'Dedicated support',
          'Custom integrations'
        ];
      default:
        return [];
    }
  };

  return {
    subscription,
    loading,
    error,
    updating,
    updateSubscription,
    getPlanDisplayName,
    getPlanFeatures
  };
};
