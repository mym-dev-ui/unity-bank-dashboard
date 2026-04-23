import express from 'express';
import {
  listAllRequests,
  getRequestForReview,
  updateRequestStatus,
  getRequestStatusHistory,
  addAdminNotes,
  getDashboardStats,
  getVisitorDetails,
  exportRequestData,
} from '../controllers/adminController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(authenticate, authorizeAdmin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/requests', listAllRequests);

// Request review routes
router.get('/requests/:requestId', getRequestForReview);
router.get('/requests/:requestId/history', getRequestStatusHistory);

// Request management routes
router.put('/requests/:requestId/status', updateRequestStatus);
router.put('/requests/:requestId/notes', addAdminNotes);

// Visitor information routes
router.get('/visitors/:userId', getVisitorDetails);

// Export routes
router.get('/requests/:requestId/export', exportRequestData);

export default router;
