<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .eq('user_id', user.id)
        .single();
      if (profileError) throw profileError;
      setProfile({
        id: user.id,
        display_name: data?.display_name || '',
        email: data?.email || user.email || '',
      });
    } catch (err: any) {
      setProfile(null);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: { display_name?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);
      if (updateError) throw updateError;
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refreshProfile: fetchProfile, updateProfile };
} 
=======
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';

interface UserProfile extends Tables<'profiles'> {
  user?: User;
}

// Utility function to get avatar URL from Supabase storage
const constructAvatarUrl = (avatarUrl: string | null): string | null => {
  if (!avatarUrl) return null;
  
  // If it's already a full URL, return as is
  if (avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  
  // If it's a storage path, construct the full URL
  if (avatarUrl.startsWith('/')) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(avatarUrl);
    return data.publicUrl;
  }
  
  return avatarUrl;
};

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }

        if (!user) {
          setUserProfile(null);
          return;
        }

        // Fetch profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Profile not found, create one
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                user_id: user.id,
                display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Trader'
              })
              .select()
              .single();

            if (createError) {
              console.warn('Failed to create profile:', createError);
              // Continue with just user data - create a minimal profile object
              setUserProfile({
                id: '',
                user_id: user.id,
                display_name: null,
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user
              });
            } else {
              setUserProfile({ ...newProfile, user });
            }
          } else {
            console.warn('Error fetching profile:', profileError);
            // Continue with just user data - create a minimal profile object
            setUserProfile({
              id: '',
              user_id: user.id,
              display_name: null,
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user
            });
          }
        } else {
          setUserProfile({ ...profile, user });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile();
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getUserDisplayName = (): string => {
    if (!userProfile?.user) return '';
    
    // Priority: full_name from user_metadata, then email
    const name = userProfile.user.user_metadata?.full_name || userProfile.user.email;
    return name || 'Trader';
  };

  const getUserEmail = (): string => {
    if (!userProfile?.user) return '';
    return userProfile.user.email || '';
  };

  const getAvatarUrl = (): string | null => {
    // First try to get avatar from user_metadata
    if (userProfile?.user?.user_metadata?.avatar_url) {
      return constructAvatarUrl(userProfile.user.user_metadata.avatar_url);
    }
    
    // Then try to get from profiles table
    if (userProfile?.avatar_url) {
      return constructAvatarUrl(userProfile.avatar_url);
    }
    
    return null;
  };

  const updateFullName = async (newFullName: string): Promise<boolean> => {
    if (!userProfile?.user) return false;

    try {
      // Update user metadata with new full_name
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: newFullName }
      });

      if (error) {
        console.error('Error updating full_name:', error);
        return false;
      }

      // Refresh the user data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update the local state with new user data
        setUserProfile(prev => prev ? { ...prev, user } : null);
      }

      return true;
    } catch (err) {
      console.error('Error updating full_name:', err);
      return false;
    }
  };

  const updateDisplayName = async (newDisplayName: string): Promise<boolean> => {
    if (!userProfile?.user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userProfile.user.id,
          display_name: newDisplayName
        });

      if (error) {
        console.error('Error updating display name:', error);
        return false;
      }

      // Refresh the profile data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setUserProfile({ ...profile, user });
      }

      return true;
    } catch (err) {
      console.error('Error updating display name:', err);
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Error updating password:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An unexpected error occurred' 
      };
    }
  };

  return {
    userProfile,
    loading,
    error,
    getUserDisplayName,
    getUserEmail,
    getAvatarUrl,
    updateFullName,
    updateDisplayName,
    updatePassword
  };
};
>>>>>>> 74acc0a (Initial commit of my project)
