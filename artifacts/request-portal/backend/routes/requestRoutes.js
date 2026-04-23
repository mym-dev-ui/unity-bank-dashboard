import express from 'express';
import {
  createRequest,
  getRequestById,
  updateRequestData,
  listVisitorRequests,
  getRequestStatus,
  submitRequest,
} from '../controllers/requestController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Visitor routes - protected
router.post('/', authenticate, createRequest);
router.get('/my-requests', authenticate, listVisitorRequests);
router.get('/:requestId', authenticate, getRequestById);
router.put('/:requestId/data', authenticate, updateRequestData);
router.post('/:requestId/submit', authenticate, submitRequest);
router.get('/:requestId/status', authenticate, getRequestStatus);

export default router;
