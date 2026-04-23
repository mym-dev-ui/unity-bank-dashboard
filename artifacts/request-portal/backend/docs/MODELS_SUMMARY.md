# Database Models - Technical Summary

## Model Files Overview

### 1. **User Model** (`User.js`)
**Purpose:** Store visitor account information
**Safe Fields:**
- `email` - unique email address
- `phoneNumber` - contact phone
- `fullName` - visitor name
- `idNumber` - unique identification
- `address` - location information
- `isVerified` - email verification status
- `status` - account state (active/inactive/suspended)
- `lastLogin` - last access timestamp

**Security Note:** Password hash is stored but never returned in queries (select: false)

---

### 2. **OTPToken Model** (`OTPToken.js`)
**Purpose:** Manage one-time passwords for verification flows
**Safe Fields (for tracking only):**
- `userId` - reference to User
- `type` - 'login', 'password_reset', 'email_verification'
- `phoneNumber` - masked phone for display only
- `expiresAt` - token expiration time
- `attempts` - failed attempt counter
- `maxAttempts` - attempt limit (default: 5)
- `isUsed` - verification status

**Security Note:** OTP code itself is never returned; auto-deletes after expiration

---

### 3. **PasswordReset Model** (`PasswordReset.js`)
**Purpose:** Manage password reset workflow
**Safe Fields (for tracking only):**
- `userId` - reference to User
- `expiresAt` - reset request expiration
- `isUsed` - completion status
- `usedAt` - when reset was completed
- `status` - 'pending', 'verified', 'completed', 'expired'

**Security Note:** Security codes and tokens are hashed; never returned in queries

---

### 4. **Request Model** (`Request.js`)
**Purpose:** Track visitor requests and service submissions
**Safe Fields (suitable for admin review):**
- `userId` - visitor reference
- `requestType` - 'account_opening', 'document_request', 'service_request'
- `data` - visitor-submitted information:
  - `fullName`
  - `phoneNumber`
  - `idNumber`
  - `address`
- `status` - 'draft', 'submitted', 'pending', 'approved', 'rejected', 'completed'
- `submittedAt` - submission timestamp
- `completedAt` - completion timestamp
- `notes` - admin notes
- `attachments` - uploaded file metadata (filename, URL, timestamp)
- `createdAt`, `updatedAt` - audit timestamps

---

### 5. **RequestStatus Model** (`RequestStatus.js`)
**Purpose:** Track status history and workflow transitions
**Safe Fields (audit trail):**
- `requestId` - reference to Request
- `status` - previous status
- `newStatus` - current status
- `changedBy` - admin/system identifier
- `reason` - reason for status change
- `notes` - additional workflow notes
- `changedAt` - change timestamp

---

### 6. **Session Model** (`Session.js`)
**Purpose:** Manage user login sessions
**Safe Fields (for tracking only):**
- `userId` - reference to User
- `expiresAt` - session expiration
- `ipAddress` - connection IP address
- `userAgent` - browser/client information
- `createdAt` - login timestamp
- `revokedAt` - logout/revocation timestamp

**Security Note:** Token hash is stored but never returned (select: false)

---

## Model Relationships

```
User (1) ──→ (many) Request
  │
  ├──→ (many) OTPToken
  ├──→ (many) PasswordReset
  └──→ (many) Session

Request (1) ──→ (many) RequestStatus
```

---

## Visitor Request Tracking Flow

1. **Visitor creates account** → User record created, isVerified = false
2. **Visitor submits request** → Request record created with status = 'draft'
3. **Visitor finalizes request** → status = 'submitted', submittedAt timestamp set
4. **Admin reviews request** → RequestStatus history created
5. **Admin updates status** → New RequestStatus record (audit trail)
6. **Request completion** → status = 'completed', completedAt timestamp

---

## Admin Review Workflow

- Access list of all requests (status, visitor info, submission date)
- View individual request details (visitor data, attachments, notes)
- Update request status with reason tracking
- View full status history (who changed it, when, why)
- Add notes for internal collaboration
- No exposure to passwords, OTP codes, or reset secrets

---

## Safe Backend Structure

```
models/
├── User.js              (Visitor accounts)
├── Request.js           (Request submissions)
├── RequestStatus.js     (Status audit trail)
├── Session.js           (Login sessions)
├── OTPToken.js          (Verification - code not exposed)
├── PasswordReset.js     (Reset flow - secrets not exposed)
└── index.js             (Centralized exports)
```

---

## Security Implementation

✅ **Passwords:** Hashed with bcrypt, select: false  
✅ **OTP Codes:** Never returned, auto-expire, attempt limiting  
✅ **Reset Tokens:** Hashed comparison only, time-limited  
✅ **Sessions:** Token hash stored, revocation tracking  
✅ **Auto-Cleanup:** Expired tokens/sessions removed automatically  
✅ **Audit Trail:** All status changes tracked with timestamps and admin ID  

---

## What This Setup Supports

✅ Visitor account creation and login  
✅ Request submission and tracking  
✅ Admin review and status management  
✅ Complete audit trail of all changes  
✅ Secure session management  
✅ Proper security for sensitive flows without exposing data  

---

## What This Setup Does NOT Expose

❌ Plain text passwords  
❌ OTP codes  
❌ Password reset secrets  
❌ Session tokens in logs  
❌ Hashed token internals  
