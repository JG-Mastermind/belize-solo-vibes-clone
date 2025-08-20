# User Settings API Reference

## Overview

The User Settings API provides secure, role-based profile management for BelizeVibes users. All endpoints enforce strict security policies to prevent privilege escalation and unauthorized access.

## Base URL

```
https://tljeawrgjogbjvkjmrxo.supabase.co/functions/v1
```

## Authentication

All endpoints require authentication via Bearer token:

```http
Authorization: Bearer <supabase_access_token>
```

## Endpoints

### 1. Update User Settings

Updates the authenticated user's profile settings with role-based validation.

```http
POST /update-user-settings
```

#### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

#### Request Body Schema

The request body varies by user role. Only role-appropriate fields are accepted.

##### Common Fields (All Roles)

```json
{
  "first_name": "string (max 100)",
  "last_name": "string (max 100)", 
  "phone": "string (max 20)",
  "country": "string (max 100)",
  "whatsapp_number": "string (max 20)",
  "whatsapp_enabled": "boolean",
  "language_preference": "en | fr-ca",
  "profile_image_url": "string (valid URL)",
  "notification_preferences": {
    "email": "boolean",
    "whatsapp": "boolean", 
    "push": "boolean"
  },
  "dark_mode": "boolean",
  "emergency_contact": {
    "name": "string (required, max 100)",
    "phone": "string (required, max 20)",
    "relation": "string (required, max 50)"
  }
}
```

##### Traveler-Specific Fields

```json
{
  "dietary_restrictions": "string (max 500)"
}
```

##### Guide-Specific Fields

```json
{
  "bio": "string (max 2000)",
  "certifications": ["string (max 100 each, max 10 items)"],
  "operating_region": "string (max 200)",
  "languages_spoken": ["string (max 50 each, max 20 items)"],
  "payout_account_status": "not_connected | pending | connected | restricted"
}
```

##### Host-Specific Fields  

```json
{
  "bio": "string (max 2000)",
  "operating_region": "string (max 200)", 
  "languages_spoken": ["string (max 50 each, max 20 items)"],
  "payout_account_status": "not_connected | pending | connected | restricted"
}
```

#### Example Requests

##### Traveler Profile Update

```json
{
  "first_name": "Maria",
  "last_name": "Rodriguez",
  "phone": "+501-123-4567",
  "whatsapp_enabled": true,
  "notification_preferences": {
    "email": true,
    "whatsapp": true,
    "push": false
  },
  "emergency_contact": {
    "name": "Carlos Rodriguez", 
    "phone": "+501-987-6543",
    "relation": "Brother"
  },
  "dietary_restrictions": "Vegetarian, gluten-free"
}
```

##### Guide Profile Update

```json
{
  "bio": "Certified cave diving instructor with 15+ years exploring Belize's underwater caves",
  "certifications": [
    "PADI Open Water Scuba Instructor", 
    "Cave Diving Instructor",
    "Wilderness First Aid"
  ],
  "operating_region": "Cayo District, Blue Hole, Actun Tunichil Muknal",
  "languages_spoken": ["English", "Spanish", "German"],
  "payout_account_status": "connected"
}
```

#### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "first_name": "Maria",
    "last_name": "Rodriguez",
    "phone": "+501-123-4567",
    "country": "Belize",
    "user_type": "traveler",
    "whatsapp_number": "+501-123-4567",
    "whatsapp_enabled": true,
    "language_preference": "en",
    "profile_image_url": null,
    "notification_preferences": {
      "email": true,
      "whatsapp": true,
      "push": false
    },
    "dark_mode": false,
    "emergency_contact": {
      "name": "Carlos Rodriguez",
      "phone": "+501-987-6543", 
      "relation": "Brother"
    },
    "dietary_restrictions": "Vegetarian, gluten-free",
    "profile_updated_at": "2025-01-20T15:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

#### Error Responses

##### 400 Bad Request - Validation Error

```json
{
  "error": "Invalid input data",
  "details": [
    {
      "field": "emergency_contact.phone",
      "message": "Phone is required"
    }
  ]
}
```

##### 401 Unauthorized

```json
{
  "error": "Invalid or expired token"
}
```

##### 403 Forbidden - Security Violation

```json
{
  "error": "Attempting to modify restricted fields"
}
```

```json
{
  "error": "Travelers cannot update guide/host specific fields" 
}
```

##### 500 Internal Server Error

```json
{
  "error": "Failed to update profile",
  "details": "Database constraint violation"
}
```

---

### 2. Get User Profile

Retrieves user profile data with appropriate privacy filtering.

```http
GET /get-user-profile
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string (optional) | Get specific user's public profile |
| `include_private` | boolean (optional) | Include private data (super_admin only) |

#### Headers

```http
Authorization: Bearer <token>
```

#### Example Requests

##### Get Own Profile

```http
GET /get-user-profile
Authorization: Bearer <token>
```

##### Get Another User's Public Profile

```http
GET /get-user-profile?user_id=456e7890-e89b-12d3-a456-426614174999
Authorization: Bearer <token>
```

##### Get Private Data (Super Admin Only)

```http
GET /get-user-profile?user_id=456e7890-e89b-12d3-a456-426614174999&include_private=true
Authorization: Bearer <token>
```

#### Success Response (Own Profile)

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache
```

```json
{
  "success": true,
  "profile": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "first_name": "Maria",
    "last_name": "Rodriguez", 
    "phone": "+501-123-4567",
    "country": "Belize",
    "user_type": "traveler",
    "whatsapp_number": "+501-123-4567",
    "whatsapp_enabled": true,
    "language_preference": "en",
    "profile_image_url": null,
    "notification_preferences": {
      "email": true,
      "whatsapp": true,
      "push": false
    },
    "dark_mode": false,
    "emergency_contact": {
      "name": "Carlos Rodriguez",
      "phone": "+501-987-6543",
      "relation": "Brother"
    },
    "dietary_restrictions": "Vegetarian, gluten-free",
    "is_verified": false,
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2025-01-20T15:30:00Z",
    "profile_updated_at": "2025-01-20T15:30:00Z",
    "settings_version": 1
  },
  "audit_log": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174111",
      "changed_fields": {
        "emergency_contact": true,
        "dietary_restrictions": true
      },
      "created_at": "2025-01-20T15:30:00Z",
      "change_reason": "User self-update via settings"
    }
  ],
  "is_own_profile": true,
  "includes_private_data": true
}
```

#### Success Response (Public Profile)

```http
HTTP/1.1 200 OK  
Content-Type: application/json
Cache-Control: public, max-age=300
```

```json
{
  "success": true,
  "profile": {
    "id": "456e7890-e89b-12d3-a456-426614174999",
    "first_name": "Juan",
    "last_name": "Morales",
    "country": "Belize", 
    "user_type": "guide",
    "profile_image_url": "https://example.com/avatar.jpg",
    "language_preference": "en",
    "is_verified": true,
    "created_at": "2024-06-15T09:00:00Z",
    "bio": "Professional cave diving guide with 15+ years experience",
    "certifications": [
      "PADI Open Water Scuba Instructor",
      "Cave Diving Instructor"
    ],
    "operating_region": "Cayo District, Blue Hole",
    "languages_spoken": ["English", "Spanish", "German"]
  },
  "audit_log": null,
  "is_own_profile": false,
  "includes_private_data": false
}
```

#### Error Responses

##### 401 Unauthorized

```json
{
  "error": "Invalid or expired token"
}
```

##### 403 Forbidden

```json
{
  "error": "Insufficient permissions for private data access"
}
```

##### 404 Not Found

```json
{
  "error": "User profile not found"
}
```

---

## Field Validation Rules

### Common Validation

- **Email**: Must be valid email format (system-managed)
- **Phone**: Max 20 characters, international format recommended
- **Names**: Max 100 characters each
- **Profile Image URL**: Must be valid HTTPS URL with image extension
- **Language**: Must be 'en' or 'fr-ca'

### JSON Field Validation

#### Notification Preferences

```json
{
  "email": "boolean (required)",
  "whatsapp": "boolean (required)", 
  "push": "boolean (required)"
}
```

#### Emergency Contact

```json
{
  "name": "string (required, 1-100 chars)",
  "phone": "string (required, 1-20 chars)",
  "relation": "string (required, 1-50 chars)"
}
```

### Role-Specific Validation

#### Travelers
- **Cannot update**: `bio`, `certifications`, `operating_region`, `languages_spoken`, `payout_account_status`
- **Can update**: All common fields + `dietary_restrictions`

#### Guides  
- **Can update**: All common fields + all guide-specific fields
- **Certifications**: Max 10 items, 100 chars each
- **Languages**: Max 20 items, 50 chars each

#### Hosts
- **Cannot update**: `certifications` (guide-specific)
- **Can update**: All common fields + `bio`, `operating_region`, `languages_spoken`, `payout_account_status`

---

## Security Features

### Authentication & Authorization
- JWT token validation required for all endpoints
- User identity verified against database records
- Role-based access control enforced

### Input Validation
- **Zod schema validation** in Edge Functions
- **Database constraint validation** at storage level
- **XSS prevention** through input sanitization
- **SQL injection prevention** through parameterized queries

### Audit Logging
- All profile changes automatically logged
- IP address and User-Agent tracking
- Field-level change tracking
- Security violation logging

### Privacy Protection
- Public vs private data filtering
- Role-appropriate data exposure
- Cross-user access prevention

---

## Rate Limits

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| POST /update-user-settings | 10 requests | 1 minute |
| GET /get-user-profile | 100 requests | 1 minute |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request data or validation failure |
| 401 | Authentication required or invalid token |
| 403 | Forbidden - insufficient permissions |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## Development & Testing

### Test Endpoints

Use the security validation test function to verify implementation:

```sql
SELECT * FROM run_user_settings_validation_tests();
```

### Example cURL Requests

```bash
# Update user settings
curl -X POST \
  https://tljeawrgjogbjvkjmrxo.supabase.co/functions/v1/update-user-settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated Name",
    "whatsapp_enabled": true
  }'

# Get user profile  
curl -X GET \
  https://tljeawrgjogbjvkjmrxo.supabase.co/functions/v1/get-user-profile \
  -H "Authorization: Bearer <token>"
```

---

**🔒 Security Notice**: This API implements multiple layers of security validation. Any attempt to bypass security measures will be logged and may result in account suspension.