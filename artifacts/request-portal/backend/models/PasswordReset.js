import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    securityCodeHash: {
      type: String,
      required: true,
      select: false, // Don't return by default for security
    },
    resetToken: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    resetTokenHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'completed', 'expired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic cleanup of expired tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to verify security code
passwordResetSchema.methods.verifySecurityCode = async function (providedCode) {
  if (this.isUsed || new Date() > this.expiresAt) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(this.securityCodeHash),
    Buffer.from(crypto.createHash('sha256').update(providedCode).digest('hex'))
  );
};

// Method to verify reset token
passwordResetSchema.methods.verifyResetToken = async function (providedToken) {
  if (this.isUsed || new Date() > this.expiresAt) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(this.resetTokenHash),
    Buffer.from(crypto.createHash('sha256').update(providedToken).digest('hex'))
  );
};

// Mark as used
passwordResetSchema.methods.markAsUsed = async function () {
  this.isUsed = true;
  this.usedAt = new Date();
  this.status = 'completed';
  return await this.save();
};

export default mongoose.model('PasswordReset', passwordResetSchema);
