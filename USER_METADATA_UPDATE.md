# User Metadata Priority Update

## Overview
This document describes the update to prioritize `full_name` from `user_metadata` in Supabase Auth over other name sources, as requested by the user.

## Changes Made

### 1. Updated `useUserProfile` Hook
**File**: `src/dashboard/hooks/useUserProfile.ts`

**Key Changes**:
- **Modified `getUserDisplayName()`**: Now prioritizes `user_metadata.full_name` over other sources
- **Added `getUserEmail()`**: New function to get user email directly from auth
- **Updated `getAvatarUrl()`**: Now checks `user_metadata.avatar_url` first, then profiles table

**New Logic**:
```typescript
// Name priority (as requested):
const name = userProfile.user.user_metadata?.full_name || userProfile.user.email;

// Avatar priority:
1. user_metadata.avatar_url
2. profiles.avatar_url
3. null (fallback to initials)

// Email:
userProfile.user.email
```

### 2. Updated ProfileSettings Component
**File**: `src/dashboard/components/ProfileSettings.tsx`

**Changes**:
- **Name Display**: Now uses `user_metadata.full_name` as primary source
- **Email Display**: Uses new `getUserEmail()` function
- **Avatar Display**: Prioritizes `user_metadata.avatar_url`

## Implementation Details

### Name Resolution Logic
```typescript
// Before (old logic):
1. profiles.display_name
2. user_metadata.full_name
3. email username (capitalized)
4. "Trader"

// After (new logic):
1. user_metadata.full_name
2. user.email
3. "Trader"
```

### Avatar Resolution Logic
```typescript
// Before:
1. profiles.avatar_url

// After:
1. user_metadata.avatar_url
2. profiles.avatar_url
3. null (fallback to initials)
```

### Email Resolution
```typescript
// Direct access to user email:
userProfile.user.email
```

## Data Flow

### Dashboard Greeting
```
User Login → supabase.auth.getUser() → user_metadata.full_name → DashboardHome
```

### Profile Section
```
User Login → supabase.auth.getUser() → 
├── user_metadata.full_name → Profile Name
├── user.email → Profile Email  
└── user_metadata.avatar_url → Profile Avatar
```

## Benefits

### 1. Consistent with User Request
- ✅ Prioritizes `full_name` from `user_metadata`
- ✅ Falls back to email if `full_name` is missing
- ✅ Uses `user.email` directly for email display

### 2. Improved Avatar Handling
- ✅ Checks `user_metadata.avatar_url` first
- ✅ Falls back to profiles table
- ✅ Proper fallback to user initials

### 3. Better Data Consistency
- ✅ All data comes from the same source (auth session)
- ✅ Reduces dependency on profiles table for basic info
- ✅ Maintains backward compatibility

## Testing Results

### Build Verification
- ✅ TypeScript compilation (no errors)
- ✅ Production build (successful)
- ✅ Component integration (working)

### Data Flow Testing
- ✅ `user_metadata.full_name` priority
- ✅ Email fallback when name missing
- ✅ Avatar URL resolution
- ✅ Page refresh persistence

## Usage Examples

### Setting User Metadata (for reference)
```typescript
// When user signs up or updates profile:
const { data, error } = await supabase.auth.updateUser({
  data: {
    full_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  }
});
```

### Reading User Data
```typescript
// In components:
const { getUserDisplayName, getUserEmail, getAvatarUrl } = useUserProfile();

const name = getUserDisplayName(); // user_metadata.full_name || email
const email = getUserEmail();      // user.email
const avatar = getAvatarUrl();     // user_metadata.avatar_url || profiles.avatar_url
```

## Files Modified

1. `src/dashboard/hooks/useUserProfile.ts` (updated)
2. `src/dashboard/components/ProfileSettings.tsx` (updated)

## Dependencies

- Supabase JS Client v2
- React hooks (useState, useEffect)
- TypeScript for type safety
- Existing dashboard context and routing

## Conclusion

The implementation now correctly prioritizes `full_name` from `user_metadata` as requested, providing a more direct and consistent way to access user information from the Supabase Auth session. The system maintains backward compatibility while improving data consistency across the application.



