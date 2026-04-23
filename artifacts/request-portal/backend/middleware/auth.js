import jwt from 'jsonwebtoken';
import { Session, User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware - verify session token
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if session exists and is active
    const session = await Session.findById(decoded.sessionId);

    if (!session || !session.isActive()) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or revoked',
      });
    }

    // Get user details
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user and session to request
    req.user = user;
    req.session = session;
    req.userId = user._id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

// Admin authorization middleware - requires admin role
export const authorizeAdmin = async (req, res, next) => {
  try {
    // Check if user is admin (add admin role to User model)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Authorization failed',
    });
  }
};

// Request ownership check - visitor can only access own requests
export const checkRequestOwnership = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { Request } = await import('../models/index.js');

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Check if user owns this request
    if (request.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this request',
      });
    }

    req.request = request;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed',
    });
  }
};