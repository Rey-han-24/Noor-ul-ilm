# 🔐 Security Implementation - Noor ul Ilm

## Overview
This document outlines the security measures implemented in the Noor ul Ilm application.

---

## ✅ Security Features Implemented

### 1. Authentication Security

| Feature | Implementation | File |
|---------|---------------|------|
| JWT Tokens | Signed with secret key, 7-day expiry | `src/lib/auth.ts` |
| HTTP-only Cookies | Prevents XSS access to tokens | All auth routes |
| Secure Flag | HTTPS only in production | All auth routes |
| SameSite | 'lax' - CSRF protection | All auth routes |
| Password Hashing | bcrypt with cost factor 12 | Signup/Login routes |

### 2. Rate Limiting

| Route | Limit | Window |
|-------|-------|--------|
| `/api/auth/login` | 5 attempts | Per minute |
| `/api/auth/signup` | 3 attempts | Per hour |
| Admin APIs | Uses standard auth check | N/A |

### 3. Admin API Protection

All `/api/admin/*` routes now require authentication:

```typescript
// Every admin route includes:
const authResult = await requireAdmin();
if (isErrorResponse(authResult)) {
  return authResult; // Returns 401 or 403
}
```

| Route | Required Role |
|-------|--------------|
| `GET /api/admin/users` | ADMIN or SUPER_ADMIN |
| `POST /api/admin/users` | SUPER_ADMIN only |
| `GET /api/admin/collections` | ADMIN or SUPER_ADMIN |
| `POST /api/admin/collections` | ADMIN or SUPER_ADMIN |
| `GET /api/admin/hadiths` | ADMIN or SUPER_ADMIN |
| `POST /api/admin/hadiths` | ADMIN or SUPER_ADMIN |

### 4. Input Validation

- ✅ Email format validation
- ✅ Password minimum 8 characters
- ✅ Name length 2-100 characters
- ✅ Input sanitization (XSS prevention)
- ✅ Slug sanitization for collections

### 5. Security Logging

All security events are logged:
- Login attempts (success/failure)
- Unauthorized access attempts
- Admin actions (create user, create collection, etc.)
- Rate limit violations

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# CRITICAL: Change this in production!
JWT_SECRET="your-secure-random-string"

# Database
DATABASE_URL="postgresql://..."
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ⚠️ Security Checklist for Production

Before deploying to production:

- [ ] Generate a strong `JWT_SECRET` (64+ bytes)
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS only
- [ ] Configure proper CORS headers
- [ ] Set up Redis for rate limiting (current is in-memory)
- [ ] Configure proper logging service (Sentry, LogRocket)
- [ ] Regular security audits
- [ ] Database access restricted by IP
- [ ] Strong PostgreSQL password

---

## 📁 Security Files

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | JWT creation, verification, user session |
| `src/lib/api-security.ts` | Rate limiting, auth helpers, logging |
| `src/app/api/auth/login/route.ts` | Login with rate limiting |
| `src/app/api/auth/signup/route.ts` | Signup with validation |
| `src/app/api/admin/*/route.ts` | Protected admin routes |

---

## 🚫 What's NOT Implemented (Future Work)

- [ ] Two-factor authentication (2FA)
- [ ] Email verification on signup
- [ ] Password reset flow
- [ ] Account lockout after failed attempts
- [ ] CAPTCHA for signup
- [ ] Redis-based rate limiting (for multi-server)
- [ ] IP blocklist/allowlist
- [ ] Content Security Policy (CSP) headers

---

## Testing Security

### Test Unauthorized Access
```bash
# Should return 401 Unauthorized
curl http://localhost:3001/api/admin/users

# Should return rate limit after 5 attempts
for i in {1..6}; do curl -X POST http://localhost:3001/api/auth/login -d '{"email":"test","password":"test"}'; done
```

---

*Last updated: January 26, 2026*
