import express from 'express';
import {
  registerVisitor,
  loginVisitor,
  getVisitorProfile,
  updateVisitorProfile,
  logoutVisitor,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerVisitor);
router.post('/login', loginVisitor);

// Protected routes
router.get('/profile', authenticate, getVisitorProfile);
router.put('/profile', authenticate, updateVisitorProfile);
router.post('/logout', authenticate, logoutVisitor);

export default router;
