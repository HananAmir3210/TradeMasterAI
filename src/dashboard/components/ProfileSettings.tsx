<<<<<<< HEAD
import { useState } from "react";
import { User, Settings, Key, Shield, Trash2, Camera, Save } from "lucide-react";
=======
import { useState, useEffect } from "react";
import { User, Settings, Key, Shield, Trash2, Camera, Save, CreditCard, Check, Crown, Zap } from "lucide-react";
>>>>>>> 74acc0a (Initial commit of my project)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
<<<<<<< HEAD
import { useToast } from "@/hooks/use-toast";
=======
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "../hooks/useUserProfile";
import { useSubscription } from "../hooks/useSubscription";
>>>>>>> 74acc0a (Initial commit of my project)

interface ProfileSettingsProps {
  className?: string;
}

export default function ProfileSettings({ className }: ProfileSettingsProps) {
  const { toast } = useToast();
<<<<<<< HEAD
  const [profile, setProfile] = useState({
    name: "Alex Thompson",
    email: "alex@trademaster.ai",
=======
  const { userProfile, loading, updateFullName, getAvatarUrl, getUserEmail } = useUserProfile();
  const { 
    subscription, 
    loading: subscriptionLoading, 
    updating: subscriptionUpdating, 
    updateSubscription, 
    getPlanDisplayName, 
    getPlanFeatures 
  } = useSubscription();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
>>>>>>> 74acc0a (Initial commit of my project)
    avatar: "",
    apiKey: "tm_sk_1234567890abcdef",
    subscription: "Pro Plan"
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

<<<<<<< HEAD
  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handlePasswordChange = () => {
=======
  // Update profile state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      // Get name from user_metadata.full_name or email as fallback
      const displayName = userProfile.user?.user_metadata?.full_name || userProfile.user?.email || 'Trader';
      
      setProfile(prev => ({
        ...prev,
        name: displayName,
        email: getUserEmail(),
        avatar: getAvatarUrl() || ''
      }));
    }
  }, [userProfile, getUserEmail, getAvatarUrl]);

  const handleProfileUpdate = async () => {
    if (!userProfile?.user) {
      toast({
        title: "Error",
        description: "User not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!profile.name.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid full name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await updateFullName(profile.name.trim());
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your full name has been successfully updated.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    }
  };

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { updatePassword } = useUserProfile();

  const handlePasswordChange = async () => {
    // Validate inputs
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

>>>>>>> 74acc0a (Initial commit of my project)
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
<<<<<<< HEAD
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
    setPasswords({ current: "", new: "", confirm: "" });
=======

    if (passwords.new.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      
      const { success, error } = await updatePassword(passwords.new);
      
      if (success) {
        toast({
          title: "Password Updated",
          description: "Your password has been successfully changed.",
        });
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        throw new Error(error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error Updating Password",
        description: error instanceof Error ? error.message : "An error occurred while updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
>>>>>>> 74acc0a (Initial commit of my project)
  };

  const generateNewApiKey = () => {
    const newKey = `tm_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setProfile(prev => ({ ...prev, apiKey: newKey }));
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated.",
    });
  };

<<<<<<< HEAD
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="animate-reveal">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
=======
  const handleSubscriptionChange = async (newPlan: string) => {
    if (!subscription) {
      toast({
        title: "Error",
        description: "No subscription found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (subscription.plan === newPlan) {
      toast({
        title: "Already on this plan",
        description: `You are already on the ${getPlanDisplayName(newPlan)}.`,
      });
      return;
    }

    try {
      const { success, error } = await updateSubscription(newPlan);
      
      if (success) {
        toast({
          title: "Subscription Updated",
          description: `Successfully changed to ${getPlanDisplayName(newPlan)}.`,
        });
      } else {
        throw new Error(error || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error Updating Subscription",
        description: error instanceof Error ? error.message : "An error occurred while updating your subscription.",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile.name) return 'U';
    return profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className={`space-y-6 sm:space-y-8 ${className}`}>
        <div className="animate-reveal">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Profile & Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your account and preferences</p>
        </div>
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm sm:text-base text-foreground font-medium">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 sm:space-y-8 ${className}`}>
      <div className="animate-reveal">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Profile & Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
>>>>>>> 74acc0a (Initial commit of my project)
        {/* Profile Information */}
        <Card className="glass-card animate-reveal animate-reveal-delay-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
<<<<<<< HEAD
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-lg">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
=======
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-base sm:text-lg">Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 rounded-full">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm sm:text-lg rounded-full">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
>>>>>>> 74acc0a (Initial commit of my project)
                Change Photo
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
<<<<<<< HEAD
                <Label htmlFor="name">Full Name</Label>
=======
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
>>>>>>> 74acc0a (Initial commit of my project)
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
<<<<<<< HEAD
                  className="bg-input border-border"
=======
                  className="bg-input border-border text-sm sm:text-base"
                  placeholder="Enter your full name"
>>>>>>> 74acc0a (Initial commit of my project)
                />
              </div>

              <div className="space-y-2">
<<<<<<< HEAD
                <Label htmlFor="email">Email Address</Label>
=======
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
>>>>>>> 74acc0a (Initial commit of my project)
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
<<<<<<< HEAD
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-input border-border"
                />
              </div>

              <Button onClick={handleProfileUpdate} className="btn-premium w-full">
                <Save className="h-4 w-4 mr-2" />
=======
                  disabled
                  className="bg-muted border-border text-muted-foreground text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed from this interface
                </p>
              </div>

              <Button onClick={handleProfileUpdate} className="btn-premium w-full text-sm sm:text-base">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
>>>>>>> 74acc0a (Initial commit of my project)
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card animate-reveal animate-reveal-delay-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
<<<<<<< HEAD
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
=======
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-base sm:text-lg">Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm sm:text-base">Current Password</Label>
>>>>>>> 74acc0a (Initial commit of my project)
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
<<<<<<< HEAD
                  className="bg-input border-border"
=======
                  className="bg-input border-border text-sm sm:text-base"
>>>>>>> 74acc0a (Initial commit of my project)
                />
              </div>

              <div className="space-y-2">
<<<<<<< HEAD
                <Label htmlFor="new-password">New Password</Label>
=======
                <Label htmlFor="new-password" className="text-sm sm:text-base">New Password</Label>
>>>>>>> 74acc0a (Initial commit of my project)
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
<<<<<<< HEAD
                  className="bg-input border-border"
=======
                  className="bg-input border-border text-sm sm:text-base"
>>>>>>> 74acc0a (Initial commit of my project)
                />
              </div>

              <div className="space-y-2">
<<<<<<< HEAD
                <Label htmlFor="confirm-password">Confirm New Password</Label>
=======
                <Label htmlFor="confirm-password" className="text-sm sm:text-base">Confirm New Password</Label>
>>>>>>> 74acc0a (Initial commit of my project)
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
<<<<<<< HEAD
                  className="bg-input border-border"
                />
              </div>

              <Button onClick={handlePasswordChange} variant="outline" className="w-full">
                Change Password
=======
                  className="bg-input border-border text-sm sm:text-base"
                />
              </div>

              <Button 
                onClick={handlePasswordChange} 
                variant="outline" 
                className="w-full text-sm sm:text-base"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-3 w-3 sm:h-4 sm:w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
>>>>>>> 74acc0a (Initial commit of my project)
              </Button>
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD
        {/* API & Subscription */}
        <Card className="glass-card animate-reveal animate-reveal-delay-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              API & Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <span className="font-medium text-foreground">{profile.subscription}</span>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={profile.apiKey}
                    readOnly
                    className="bg-input border-border font-mono text-sm"
                  />
                  <Button onClick={generateNewApiKey} variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this key to access TradeMaster AI API
                </p>
              </div>
            </div>
=======
        {/* Subscription Management */}
        <Card className="glass-card animate-reveal animate-reveal-delay-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-base sm:text-lg">Subscription Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {subscriptionLoading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm sm:text-base text-foreground font-medium">Loading subscription...</span>
                </div>
              </div>
            ) : subscription ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Current Plan Display */}
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Current Plan</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 gap-3">
                    <div className="flex items-center gap-3">
                      {subscription.plan === 'professional' ? (
                        <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                      ) : subscription.plan === 'premium' ? (
                        <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                      ) : (
                        <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">
                          {getPlanDisplayName(subscription.plan)}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Status: <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {subscription.status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {subscription.plan}
                    </Badge>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Plan Features</Label>
                  <div className="space-y-2">
                    {getPlanFeatures(subscription.plan).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Plan Change Options */}
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Change Plan</Label>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {['free', 'premium', 'professional'].map((plan) => (
                      <Button
                        key={plan}
                        variant={subscription.plan === plan ? "default" : "outline"}
                        className={`w-full justify-between text-xs sm:text-sm ${
                          subscription.plan === plan ? 'bg-primary text-primary-foreground' : ''
                        }`}
                        onClick={() => handleSubscriptionChange(plan)}
                        disabled={subscriptionUpdating}
                      >
                        <span className="flex items-center gap-2">
                          {plan === 'professional' ? (
                            <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : plan === 'premium' ? (
                            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                          {getPlanDisplayName(plan)}
                        </span>
                        {subscriptionUpdating && subscription.plan !== plan && (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* API Key Section */}
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">API Key</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={profile.apiKey}
                      readOnly
                      className="bg-input border-border font-mono text-xs sm:text-sm"
                    />
                    <Button onClick={generateNewApiKey} variant="outline" size="sm" className="text-xs sm:text-sm">
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this key to access TradeMaster AI API
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-muted-foreground">No subscription found</p>
              </div>
            )}
>>>>>>> 74acc0a (Initial commit of my project)
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-card animate-reveal animate-reveal-delay-4 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
<<<<<<< HEAD
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <Button variant="destructive" size="sm">
=======
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-base sm:text-lg">Danger Zone</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <h4 className="font-medium text-destructive mb-2 text-sm sm:text-base">Delete Account</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <Button variant="destructive" size="sm" className="text-xs sm:text-sm">
>>>>>>> 74acc0a (Initial commit of my project)
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}