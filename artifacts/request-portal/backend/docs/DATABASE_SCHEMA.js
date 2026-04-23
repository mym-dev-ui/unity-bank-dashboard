// User Schema
// Stores visitor account information

const UserSchema = {
  _id: ObjectId,
  email: String, // unique
  phoneNumber: String,
  fullName: String,
  idNumber: String, // unique
  address: String,
  passwordHash: String,
  isVerified: Boolean, // email verified
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  status: String, // 'active', 'inactive', 'suspended'
};

// OTPToken Schema
// Stores OTP tokens for verification and password reset

const OTPTokenSchema = {
  _id: ObjectId,
  userId: ObjectId, // references User
  code: String, // 6-digit OTP
  type: String, // 'login', 'password_reset', 'email_verification'
  phoneNumber: String, // masked for display
  expiresAt: Date,
  attempts: Number, // track failed attempts
  maxAttempts: Number, // default: 5
  isUsed: Boolean,
  createdAt: Date,
};

// PasswordReset Schema
// Manages password reset requests

const PasswordResetSchema = {
  _id: ObjectId,
  userId: ObjectId, // references User
  securityCode: String, // user-provided security code
  newPasswordHash: String, // temporary, cleared after verification
  token: String, // unique reset token
  expiresAt: Date,
  isUsed: Boolean,
  createdAt: Date,
};

// Request Schema
// Stores visitor requests/submissions

const RequestSchema = {
  _id: ObjectId,
  userId: ObjectId, // references User
  requestType: String, // e.g., 'account_opening', 'document_request'
  data: {
    // Dynamic based on request type
    fullName: String,
    phoneNumber: String,
    idNumber: String,
    address: String,
    // Additional fields as needed
  },
  status: String, // 'draft', 'submitted', 'pending', 'approved', 'rejected', 'completed'
  submittedAt: Date,
  completedAt: Date,
  notes: String,
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date,
    },
  ],
  createdAt: Date,
  updatedAt: Date,
};

// RequestStatus Schema
// Tracks status history and updates for requests

const RequestStatusSchema = {
  _id: ObjectId,
  requestId: ObjectId, // references Request
  status: String, // previous status
  newStatus: String, // current status
  changedBy: String, // admin/system user
  reason: String, // reason for status change
  notes: String, // additional notes
  changedAt: Date,
};

// Session Schema
// Manages user sessions

const SessionSchema = {
  _id: ObjectId,
  userId: ObjectId, // references User
  token: String, // JWT token
  tokenHash: String, // hashed for security
  expiresAt: Date,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  revokedAt: Date, // null if active
};

export {
  UserSchema,
  OTPTokenSchema,
  PasswordResetSchema,
  RequestSchema,
  RequestStatusSchema,
  SessionSchema,
};
