# OpenAI API Key Setup for AI Blog Images

## 🔑 Step-by-Step API Key Setup

### 1. Get OpenAI API Key

1. **Visit OpenAI Platform**: https://platform.openai.com
2. **Sign In/Up**: Create account or sign in
3. **Add Payment Method**: Go to Billing → Add payment method (required for API usage)
4. **Navigate to API Keys**: https://platform.openai.com/api-keys
5. **Create New Key**: 
   - Click "Create new secret key"
   - Name: "BelizeVibes-Blog-Images"
   - Permissions: All (or restrict to Images if available)
6. **Copy Key**: Save immediately (won't be shown again)

### 2. Environment Variables Setup

Add to your `.env` file (NOT `.env.example`):

```bash
# OpenAI Configuration (for AI blog image generation)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_ORGANIZATION=org-xxxxxxxxxxxxxxxxxxxxxxxx
```

**Important Security Notes:**
- ⚠️ **NEVER commit your real API key to git**
- ✅ Use `.env` for real keys (gitignored)
- ✅ Use `.env.example` for templates only

### 3. Get Organization ID (Optional but Recommended)

1. Go to https://platform.openai.com/settings/organization
2. Copy your Organization ID (starts with `org-`)
3. Add to `OPENAI_ORGANIZATION` in `.env`

### 4. API Usage & Billing

**DALL-E 3 Pricing (as of 2024):**
- Standard (1024×1024): $0.040 per image
- HD (1024×1024): $0.080 per image

**Recommended Settings:**
- Start with Standard quality for testing
- Monitor usage in OpenAI dashboard
- Set spending limits in OpenAI billing settings

### 5. Test API Connection

After adding your key, test with:

```bash
npm run dev
# Navigate to admin blog post creation
# Try generating an AI image
```

### 6. Error Handling

The system gracefully handles:
- ❌ Missing API key → Falls back to Unsplash images
- ❌ Invalid API key → Shows error message, doesn't break posts
- ❌ Rate limits → Retry with exponential backoff
- ❌ Generation failures → Keeps existing featured_image_url

### 7. Environment Validation

System checks for:
```typescript
if (!process.env.OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. AI image generation disabled.');
  return null;
}
```

## 🚀 Ready to Use

Once configured:
1. ✅ API key added to `.env`
2. ✅ Billing configured in OpenAI
3. ✅ Server restarted (`npm run dev`)
4. ✅ Test image generation in admin interface

**Need Help?** Check the OpenAI documentation: https://platform.openai.com/docs/guides/images