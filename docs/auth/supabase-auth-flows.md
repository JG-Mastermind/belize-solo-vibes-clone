# Supabase Authentication Flow Diagrams

## Overview
This document provides visual diagrams and explanations for all authentication flows in the BelizeVibes application, helping developers understand the security model and implementation patterns.

## 🔐 Core Authentication Architecture

```mermaid
graph TB
    A[User] --> B[Frontend Auth Request]
    B --> C{Auth Method}
    C -->|Email/Password| D[Supabase Auth]
    C -->|OAuth| E[OAuth Provider]
    E --> D
    D --> F[Session Created]
    F --> G[UserRole Selection/Update]
    G --> H[RequireRole Guard]
    H --> I{Role Check}
    I -->|Authorized| J[Access Granted]
    I -->|Unauthorized| K[Redirect to 403]
    
    style D fill:#4ade80
    style H fill:#f59e0b
    style I fill:#ef4444
```

## 1. 🔑 Email/Password Sign-In Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase Auth
    participant DB as Database
    participant G as RequireRole Guard
    
    U->>F: Enter email/password
    F->>S: signInWithPassword()
    S-->>F: { user, session }
    F->>F: Store session (if remember me)
    F->>F: updateUserRole(selectedRole)
    F->>DB: UPDATE users SET user_type
    F->>G: Navigate to protected route
    G->>S: Check session validity
    G->>F: getUserRole()
    G-->>U: Grant/Deny access
    
    Note over S,DB: Session stored in Supabase<br/>Role stored in both user metadata<br/>and users table
```

## 2. 🔄 OAuth Sign-In Flow (Google/Apple/Instagram)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant O as OAuth Provider
    participant S as Supabase Auth
    participant C as Auth Callback
    participant DB as Database
    
    U->>F: Click OAuth button
    F->>S: signInWithOAuth(provider)
    S->>O: Redirect to OAuth
    O->>U: OAuth consent screen
    U->>O: Grant permission
    O->>C: Redirect to /auth/callback
    C->>S: Exchange code for session
    S-->>C: { user, session }
    C->>F: Redirect to app
    F->>DB: Sync user profile
    F->>F: Role selection (if needed)
    
    Note over C: AuthCallback component<br/>handles OAuth returns<br/>NEVER auto-logins recovery
```

## 3. 🔒 Password Reset Flow (CRITICAL SECURITY)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase Auth
    participant E as Email Service
    participant C as Auth Callback
    participant R as Reset Page
    
    U->>F: Request password reset
    F->>S: resetPasswordForEmail(email)
    S->>E: Send reset email
    E->>U: Email with reset link
    U->>C: Click reset link (?type=recovery&access_token=...)
    
    Note over C: 🚨 SECURITY CHECKPOINT
    C->>C: Detect type=recovery
    C-->>R: Redirect to /reset-password<br/>(NEVER auto-login)
    
    R->>U: Show password form
    U->>R: Enter new password
    R->>S: updateUser({ password })
    S-->>R: Success/Error
    R->>S: signOut() (force clean state)
    R-->>F: Redirect to homepage
    U->>F: Must manually sign in
    
    Note over R,S: Critical: Users MUST<br/>explicitly sign in after reset
```

## 4. 👥 Role-Based Access Control

```mermaid
graph TB
    A[Route Request] --> B[RequireRole Component]
    B --> C{User Authenticated?}
    C -->|No| D[Redirect to 403]
    C -->|Yes| E[Get User Role]
    E --> F{Role in allowedRoles?}
    F -->|No| D
    F -->|Yes| G[Render Protected Content]
    
    H[Role Sources] --> I[getUserRole()]
    I --> J[user.user_metadata.role]
    I --> K[user.user_metadata.user_type]
    I --> L[Fallback to null]
    
    style B fill:#3b82f6
    style F fill:#f59e0b
    style G fill:#10b981
    style D fill:#ef4444
```

## 5. 🔐 Admin Portal Security Flow

```mermaid
sequenceDiagram
    participant A as Admin User
    participant R as RequireRole
    participant S as Supabase Auth
    participant DB as Database
    participant E as Edge Function
    
    A->>R: Access /admin/invitations
    R->>S: Check session
    S-->>R: User session
    R->>R: getUserRole()
    R->>R: Check if 'super_admin' in allowedRoles
    
    alt Authorized (super_admin)
        R-->>A: Render admin content
        A->>E: Create invitation
        E->>DB: INSERT admin_invitations
        E->>DB: INSERT admin_invitation_audit
        Note over E,DB: SECURITY DEFINER function<br/>Server-side role validation
    else Unauthorized
        R-->>A: Redirect to /403
    end
```

## 6. 📧 Admin Invitation Acceptance Flow

```mermaid
sequenceDiagram
    participant U as Invited User
    participant F as Frontend
    participant E as Edge Function
    participant DB as Database
    participant S as Supabase Auth
    
    U->>F: Click invitation link
    F->>F: Extract email & code from URL
    F->>E: accept_admin_invitation(email, code)
    
    E->>DB: Validate invitation exists & not expired
    alt Valid Invitation
        E->>DB: UPDATE users SET role_type
        E->>DB: INSERT admin_invitation_audit
        E->>S: Update user metadata
        E-->>F: Success response
        F-->>U: Show success + redirect
    else Invalid/Expired
        E-->>F: Error response
        F-->>U: Show error message
    end
    
    Note over E: SECURITY DEFINER ensures<br/>only server can elevate roles
```

## 🛡️ Security Principles

### 1. **Session Management**
- Sessions stored securely in Supabase
- "Remember me" uses localStorage for convenience
- All auth state changes trigger re-validation

### 2. **Role Elevation** 
- **CLIENT NEVER ELEVATES ROLES**
- Only SECURITY DEFINER functions can change user roles
- All role changes are audited

### 3. **Password Reset Security**
- Recovery links NEVER auto-login users
- Users must explicitly set new password
- Forced sign-out after password change

### 4. **Route Protection**
- RequireRole component guards all admin routes
- Multiple roles can be specified per route
- Graceful fallback to 403 page

## 🔧 Implementation Files

| Component | File Path | Purpose |
|-----------|-----------|---------|
| AuthProvider | `src/components/auth/AuthProvider.tsx` | Core auth context |
| RequireRole | `src/components/auth/RequireRole.tsx` | Route protection |
| AuthCallback | `src/pages/auth/callback.tsx` | OAuth & recovery handling |
| ResetPassword | `src/pages/ResetPassword.tsx` | Secure password reset |
| SignInModal | `src/components/auth/SignInModal.tsx` | Email/OAuth sign-in |

## 🚨 Critical Security Notes

1. **Never modify auth flows without security review**
2. **All role changes must use SECURITY DEFINER functions**
3. **Password reset must never auto-login users**
4. **Test auth flows thoroughly in production-like environment**
5. **Monitor auth logs for suspicious activity**

## 📋 Testing Checklist

- [ ] Password reset requires explicit password entry
- [ ] Recovery links don't auto-login
- [ ] Admin routes reject non-admin users
- [ ] Role changes are properly audited
- [ ] OAuth flows complete successfully
- [ ] Session persistence works correctly