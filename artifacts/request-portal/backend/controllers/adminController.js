import Request from '../models/Request.js';
import RequestStatus from '../models/RequestStatus.js';
import User from '../models/User.js';

// Admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRequests = await Request.countDocuments();
    const totalVisitors = await User.countDocuments({ role: 'visitor' });

    return res.status(200).json({
      success: true,
      data: {
        totalRequests,
        totalVisitors,
        byStatus: stats.reduce((acc, s) => {
          acc[s._id] = s.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

// Admin lists all requests for review
export const listAllRequests = async (req, res) => {
  try {
    const { status, requestType, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (requestType) filter.requestType = requestType;

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const requests = await Request.find(filter)
      .populate('userId', 'email fullName phoneNumber')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message,
    });
  }
};

// Admin views request for review
export const getRequestForReview = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId).populate('userId', 'email fullName phoneNumber idNumber address');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
      error: error.message,
    });
  }
};

// Admin views request status history
export const getRequestStatusHistory = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    const history = await RequestStatus.find({ requestId }).sort({ changedAt: -1 });

    return res.status(200).json({
      success: true,
      currentStatus: request.status,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch status history',
      error: error.message,
    });
  }
};

// Admin updates request status
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { newStatus, reason, notes } = req.body;
    const adminId = req.admin._id;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    const oldStatus = request.status;

    // Update request status
    request.status = newStatus;
    if (newStatus === 'completed') {
      request.completedAt = new Date();
    }
    await request.save();

    // Create status history record
    await RequestStatus.create({
      requestId: request._id,
      status: oldStatus,
      newStatus,
      changedBy: adminId.toString(),
      reason: reason || '',
      notes: notes || '',
    });

    return res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      data: {
        requestId: request._id,
        previousStatus: oldStatus,
        newStatus: request.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update request status',
      error: error.message,
    });
  }
};

// Admin adds internal notes
export const addAdminNotes = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { notes } = req.body;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.notes = (request.notes || '') + `\n[${new Date().toISOString()}] ${notes}`;
    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Notes added successfully',
      data: { notes: request.notes },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add notes',
      error: error.message,
    });
  }
};

// Admin views visitor details
export const getVisitorDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const visitor = await User.findById(userId).select('-passwordHash');
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found',
      });
    }

    const requests = await Request.find({ userId }).select('_id requestType status createdAt submittedAt');

    return res.status(200).json({
      success: true,
      data: {
        visitor,
        requestCount: requests.length,
        requests,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor details',
      error: error.message,
    });
  }
};

// Admin exports request data
export const exportRequestData = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId).populate('userId', 'email fullName phoneNumber idNumber address');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    const history = await RequestStatus.find({ requestId: request._id }).sort({ changedAt: -1 });

    // Prepare export data
    const exportData = {
      request: {
        id: request._id,
        type: request.requestType,
        status: request.status,
        createdAt: request.createdAt,
        submittedAt: request.submittedAt,
        completedAt: request.completedAt,
        data: request.data,
        notes: request.notes,
      },
      visitor: {
        email: request.userId.email,
        fullName: request.userId.fullName,
        phoneNumber: request.userId.phoneNumber,
        idNumber: request.userId.idNumber,
        address: request.userId.address,
      },
      statusHistory: history,
    };

    return res.status(200).json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to export request data',
      error: error.message,
    });
  }
};
