
# Adding Authentication Guards to Dashboard Pages

## Overview
Implement authentication protection across all dashboard pages so unauthenticated users are redirected to the sign-up/login page with a friendly message explaining they need to sign in.

---

## Current State Analysis

**Pages WITH auth protection:**
- `/install` - Checks `supabase.auth.getUser()` and redirects to `/auth` if not logged in

**Pages WITHOUT auth protection (need to be fixed):**
- `/overview` - Only checks for `selectedWebsite`
- `/scans` - No auth check
- `/scans/:scanId` - No auth check  
- `/scans/:scanId/results` - No auth check
- `/audiences` - No auth check
- `/wallets` - No auth check
- `/touchpoints` - No auth check
- `/contracts` - No auth check
- `/costs` - No auth check
- `/events` - No auth check
- `/settings` - No auth check
- `/bots` - No auth check

---

## Solution: Create a `RequireAuth` Wrapper Component

### Approach
Create a reusable component that wraps protected routes and handles:
1. Checking authentication state via Supabase
2. Showing a loading spinner while checking
3. Redirecting to `/auth` with a message if not authenticated
4. Rendering children if authenticated

---

## Technical Implementation

### 1. Create `RequireAuth` Component

**File: `src/components/auth/RequireAuth.tsx`**

```text
+--------------------------------------------+
|              RequireAuth                    |
+--------------------------------------------+
| - Checks supabase.auth.getSession()        |
| - Shows loading state while checking       |
| - Redirects to /auth?message=... if no user|
| - Renders {children} if authenticated      |
+--------------------------------------------+
```

The component will:
- Use `supabase.auth.getSession()` for initial check
- Listen to `onAuthStateChange` for real-time updates
- Pass a URL parameter `?message=signin_required` to the auth page
- The auth page will display a friendly message based on this parameter

### 2. Update Auth Page to Show Message

**File: `src/pages/Auth.tsx`**

Add logic to check for the `message` URL parameter and display an appropriate alert:
- `signin_required` -> "Please sign in to access the dashboard"

### 3. Wrap Protected Routes

**File: `src/App.tsx`**

Wrap all dashboard routes with the `RequireAuth` component:

```tsx
<Route path="/overview" element={
  <RequireAuth>
    <Overview />
  </RequireAuth>
} />
```

Routes to protect:
- `/overview`
- `/install`
- `/scans`
- `/scans/:scanId`
- `/scans/:scanId/results`
- `/audiences`
- `/wallets`
- `/touchpoints`
- `/contracts`
- `/costs`
- `/events`
- `/settings`
- `/bots`

### 4. Remove Redundant Auth Check from Install.tsx

Since `RequireAuth` will handle authentication, the manual auth check in `Install.tsx` can be removed (simplifies code and avoids double-checking).

---

## User Experience Flow

```text
User visits /overview (not logged in)
         |
         v
   RequireAuth checks session
         |
         v
   No session found
         |
         v
   Redirect to /auth?message=signin_required
         |
         v
   Auth page shows:
   "Please sign in to access the dashboard"
```

---

## Files to Create/Modify

1. **Create** `src/components/auth/RequireAuth.tsx` - Auth guard wrapper
2. **Modify** `src/pages/Auth.tsx` - Display message from URL params
3. **Modify** `src/App.tsx` - Wrap protected routes with RequireAuth
4. **Modify** `src/pages/Install.tsx` - Remove redundant auth check (optional cleanup)

---

## Message Display on Auth Page

When redirected with `?message=signin_required`, the Auth page will show:

```text
+------------------------------------------+
|  [Info Icon]                              |
|  Sign in required                         |
|  Please sign in to access your dashboard  |
+------------------------------------------+
```

This appears as a styled alert above the login form.

---

## Security Considerations

- Auth check happens on every route load (not just initial)
- Uses Supabase's session management (handles token refresh automatically)
- No sensitive data exposed if user manipulates URL
- Backend API calls still require valid auth tokens (defense in depth)
