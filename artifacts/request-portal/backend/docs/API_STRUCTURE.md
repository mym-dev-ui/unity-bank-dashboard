# Safe API Structure - Request Tracking & Admin Review

## Route Files Summary

```
artifacts/request-portal/backend/routes/
├── authRoutes.js       (Visitor authentication - safe)
├── requestRoutes.js    (Visitor request submission & tracking)
└── adminRoutes.js      (Admin request review & dashboard)
```

---

## Visitor Routes (authRoutes.js)

### Public Routes (No Auth Required)
- `POST /auth/register` - Register new visitor account
- `POST /auth/login` - Login to account

### Protected Routes (Authentication Required)
- `GET /auth/profile` - Get own profile
- `PUT /auth/profile` - Update own profile
- `POST /auth/logout` - Logout session

**Models Used:** `User`, `Session`

---

## Visitor Request Routes (requestRoutes.js)

### All Protected Routes (Authentication Required)
- `POST /requests` - Create new request (draft)
- `GET /requests/my-requests` - List own requests
- `GET /requests/:requestId` - View specific request
- `PUT /requests/:requestId/data` - Update request data
- `POST /requests/:requestId/submit` - Submit request for review
- `GET /requests/:requestId/status` - Track request status

**Models Used:** `Request`, `RequestStatus`, `User`

**Safe Data Tracked:**
- Request type (account_opening, document_request, service_request)
- Request status (draft, submitted, pending, approved, rejected, completed)
- Visitor data (name, phone, ID, address)
- Attachments (file metadata, timestamps)
- Status history (who changed it, when, why)

---

## Admin Routes (adminRoutes.js)

### All Protected Routes (Authentication + Admin Authorization Required)

**Dashboard**
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/requests` - List all requests (filterable, sortable, paginated)

**Request Review**
- `GET /admin/requests/:requestId` - View request details
- `GET /admin/requests/:requestId/history` - View status change history

**Request Management**
- `PUT /admin/requests/:requestId/status` - Update request status
- `PUT /admin/requests/:requestId/notes` - Add admin notes

**Visitor Information**
- `GET /admin/visitors/:userId` - View visitor profile and context

**Export**
- `GET /admin/requests/:requestId/export` - Export request data

**Models Used:** `User`, `Request`, `RequestStatus`

---

## Validation Schemas

### Public/Visitor Schemas
1. **visitorProfileSchema**
   - Validates: fullName, phoneNumber, idNumber, address, email
   - Used by: Profile update endpoints
   - Security: Contact info only

2. **createRequestSchema**
   - Validates: requestType, visitor data fields
   - Used by: POST /requests
   - Security: Non-sensitive form data

3. **updateRequestDataSchema**
   - Validates: Partial updates to request data, optional notes
   - Used by: PUT /requests/:requestId/data
   - Security: Visitor can only edit their own data

4. **submitRequestSchema**
   - Validates: Empty object (status change only)
   - Used by: POST /requests/:requestId/submit
   - Security: No data transmission, status change only

### Admin Schemas
5. **updateRequestStatusSchema**
   - Validates: newStatus (pending, approved, rejected, completed), reason, notes
   - Used by: PUT /admin/requests/:requestId/status
   - Security: Admin only, audit fields

6. **addAdminNotesSchema**
   - Validates: Admin notes (max 1000 chars)
   - Used by: PUT /admin/requests/:requestId/notes
   - Security: Internal documentation only

7. **listRequestsQuerySchema**
   - Validates: Pagination (page, limit), filtering (status, requestType), sorting
   - Used by: GET /admin/requests
   - Security: Query input validation

---

## Middleware Files

### validation.js
Middleware factory functions:
- `validateBody(schema)` - Generic body validation factory
- `validateQuery(schema)` - Generic query validation factory
- `validateVisitorProfile` - Profile field validation
- `validateVisitorRequest` - Request creation validation
- `validateRequestUpdate` - Request update validation
- `validateRequestStatus` - Status update validation (admin only)
- `validateAdminNotes` - Admin notes validation
- `validateRequestListQuery` - Query parameter validation (admin only)

**Usage:** Applied to routes before controllers to reject invalid input early

### auth.js (To be implemented)
Authentication & authorization middleware:
- `authenticate` - Verify session token, extract userId
- `authorizeAdmin` - Check admin role

**Applied to:**
- All protected visitor routes
- All admin routes

---

## Controller Structure (To be implemented)

### authController.js
- `registerVisitor(req, res)` - Create user + initial session
- `loginVisitor(req, res)` - Authenticate + create session
- `getVisitorProfile(req, res)` - Return user data (safe fields)
- `updateVisitorProfile(req, res)` - Update contact info
- `logoutVisitor(req, res)` - Revoke session

### requestController.js
- `createRequest(req, res)` - Create request (draft status)
- `getRequestById(req, res)` - Return request details (own only)
- `updateRequestData(req, res)` - Update request fields (own only)
- `listVisitorRequests(req, res)` - List own requests with pagination
- `submitRequest(req, res)` - Change status to submitted
- `getRequestStatus(req, res)` - Return status history (own only)

### adminController.js
- `getDashboardStats(req, res)` - Aggregate stats (counts, trends)
- `listAllRequests(req, res)` - List all requests with filters
- `getRequestForReview(req, res)` - Return request details (admin view)
- `updateRequestStatus(req, res)` - Update status + create audit entry
- `getRequestStatusHistory(req, res)` - Return status timeline
- `addAdminNotes(req, res)` - Update admin notes
- `getVisitorDetails(req, res)` - Return visitor info + requests
- `exportRequestData(req, res)` - Export request as file/JSON

---

## Data Flow: Visitor Submission → Admin Review

```
1. Visitor Registration
   ├─ POST /auth/register (email, phone, fullName, idNumber, address)
   └─ Creates: User record, Session

2. Visitor Request Creation
   ├─ POST /requests (requestType, data)
   └─ Creates: Request (status: draft)

3. Visitor Request Updates
   ├─ PUT /requests/:requestId/data (updated fields)
   └─ Updates: Request.data

4. Visitor Request Submission
   ├─ POST /requests/:requestId/submit
   └─ Updates: Request.status = submitted, Request.submittedAt

5. Admin Dashboard View
   ├─ GET /admin/requests (all requests)
   └─ Returns: Request list with status, visitor, timestamps

6. Admin Request Review
   ├─ GET /admin/requests/:requestId
   ├─ GET /admin/requests/:requestId/history
   └─ Returns: Full request details + status history

7. Admin Status Update
   ├─ PUT /admin/requests/:requestId/status (newStatus, reason, notes)
   └─ Creates: RequestStatus audit entry

8. Admin Notes
   ├─ PUT /admin/requests/:requestId/notes (notes)
   └─ Updates: Request.notes

9. Visitor Tracking
   ├─ GET /requests/my-requests
   ├─ GET /requests/:requestId
   ├─ GET /requests/:requestId/status
   └─ Returns: Own request status + history
```

---

## Security Guarantees

✅ **Passwords:** Never exposed in any API response (select: false)  
✅ **OTP Codes:** Never exposed, internal verification only  
✅ **Reset Secrets:** Never exposed, secure comparison only  
✅ **Session Tokens:** Hashed in database, validated but not returned  
✅ **Sensitive Fields:** Excluded from all API responses via schema select  
✅ **Audit Trail:** Every admin action tracked with timestamp + admin ID  
✅ **Access Control:** Visitors see only own requests, admins see all  
✅ **Input Validation:** All endpoints validate input before processing  

---

## Admin Access Only Routes

These routes REQUIRE admin authorization:
```
GET    /admin/dashboard/stats
GET    /admin/requests
GET    /admin/requests/:requestId
GET    /admin/requests/:requestId/history
PUT    /admin/requests/:requestId/status
PUT    /admin/requests/:requestId/notes
GET    /admin/visitors/:userId
GET    /admin/requests/:requestId/export
```

All other routes are visitor-protected (authentication required, own data only).

---

## Next Steps for Implementation

1. Create `auth.js` middleware (authenticate, authorizeAdmin)
2. Implement controllers (authController, requestController, adminController)
3. Integrate validation middleware into routes
4. Create error handling middleware
5. Add request/response logging (audit trail)
6. Test visitor + admin workflows
