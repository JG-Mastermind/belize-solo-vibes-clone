# 🔐 OAuth Providers Setup Guide

This guide explains how to configure OAuth providers for BelizeVibes.com social authentication.

## 🎯 Supported Providers

- **Google OAuth 2.0** ✅
- **Apple Sign-In** ✅  
- **Instagram Basic Display API** ✅

## 🔧 Supabase Configuration

### 1. Enable Providers in Supabase Dashboard

1. Go to **Authentication** → **Providers**
2. Enable the following providers:
   - Google
   - Apple
   - Instagram (under "Third-party providers")

### 2. Configure Redirect URLs

Set these redirect URLs in each provider's configuration:

**Development:**
```
http://localhost:5173/auth/callback
```

**Production:**
```
https://belizevibes.com/auth/callback
```

## 📱 Google OAuth Setup

### 1. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API** and **Google Identity API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure authorized redirect URIs:
   - `https://tljeawrgjogbjvkjmrxo.supabase.co/auth/v1/callback`
   - Your app's callback URL

### 2. Environment Variables
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Supabase Configuration
- Client ID: `your_google_client_id.apps.googleusercontent.com`
- Client Secret: `your_google_client_secret`

## 🍎 Apple Sign-In Setup

### 1. Apple Developer Account
1. Go to [Apple Developer](https://developer.apple.com/)
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. Create new **App ID** with Sign In with Apple capability
4. Create **Services ID** for web authentication
5. Configure return URLs:
   - `https://tljeawrgjogbjvkjmrxo.supabase.co/auth/v1/callback`

### 2. Environment Variables
```bash
VITE_APPLE_CLIENT_ID=com.belizevibes.signin
APPLE_CLIENT_SECRET=your_apple_client_secret
APPLE_KEY_ID=your_apple_key_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_PRIVATE_KEY=your_apple_private_key
```

### 3. Supabase Configuration
- Client ID: `com.belizevibes.signin`
- Client Secret: Generated JWT (see Apple docs)

## 📸 Instagram Basic Display API Setup

### 1. Facebook Developer Account
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app → **Consumer** type
3. Add **Instagram Basic Display** product
4. Configure OAuth redirect URI:
   - `https://tljeawrgjogbjvkjmrxo.supabase.co/auth/v1/callback`

### 2. Environment Variables
```bash
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
```

### 3. Supabase Configuration
- Client ID: `your_instagram_client_id`
- Client Secret: `your_instagram_client_secret`

## 🔐 Security Notes

1. **Never commit secrets to version control**
2. Use environment variables for all sensitive data
3. Restrict OAuth app domains to your actual domains
4. Enable only necessary scopes for each provider
5. Monitor authentication logs regularly

## 🚀 Testing OAuth Flow

1. **Development**: Use `http://localhost:5173` for testing
2. **Production**: Ensure all callback URLs match your domain
3. **Test each provider** independently
4. **Verify user metadata** (name, email, avatar) is correctly retrieved

## 📊 User Profile Integration

The system automatically:
- Retrieves user avatar from OAuth provider
- Syncs profile to `user_profiles` table
- Updates testimonials with social avatars
- Maintains session persistence based on "Remember Me" choice

## 🔄 Remember Me Functionality

- **Checked**: Session persists across browser restarts
- **Unchecked**: Ephemeral session (cleared on browser close)
- **Social logins**: Default to persistent sessions
- **Local storage**: Stores session and provider preferences

## 🎨 UI/UX Features

- **Dark mode compatible** OAuth buttons
- **Loading states** during authentication
- **Error handling** with user-friendly messages
- **Responsive design** for mobile devices
- **Provider preferences** remembered for future logins

## 🔍 Troubleshooting

### Common Issues:
1. **Invalid redirect URI**: Check callback URL configuration
2. **Scope errors**: Ensure required permissions are granted
3. **Token expiration**: Implement refresh token logic
4. **CORS issues**: Verify domain whitelist settings

### Debug Steps:
1. Check browser console for detailed error messages
2. Verify environment variables are loaded correctly
3. Test OAuth flow in incognito/private browsing
4. Check Supabase authentication logs