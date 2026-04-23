import Session from '../models/Session.js';
import User from '../models/User.js';

// Authenticate visitor - verify session token
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    // Find active session
    const session = await Session.findOne({
      tokenHash: token,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).populate('userId');

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session',
      });
    }

    // Attach user and session to request
    req.user = session.userId;
    req.session = session;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

// Authorize admin - check user role
export const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    req.admin = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error',
    });
  }
};
