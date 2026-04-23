import Request from '../models/Request.js';
import RequestStatus from '../models/RequestStatus.js';
import User from '../models/User.js';

// Visitor creates new request (draft)
export const createRequest = async (req, res) => {
  try {
    const { requestType, data } = req.body;
    const userId = req.user._id;

    const newRequest = new Request({
      userId,
      requestType,
      data,
      status: 'draft',
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: {
        requestId: newRequest._id,
        status: newRequest.status,
        requestType: newRequest.requestType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message,
    });
  }
};

// Visitor lists their own requests
export const listVisitorRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, requestType, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = { userId };
    if (status) filter.status = status;
    if (requestType) filter.requestType = requestType;

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const requests = await Request.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('-data.idNumber'); // Hide sensitive data

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

// Visitor views their request details
export const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify ownership
    if (request.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
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

// Visitor updates request data (draft only)
export const updateRequestData = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { data, notes } = req.body;
    const userId = req.user._id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify ownership and status
    if (request.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (request.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only edit draft requests',
      });
    }

    // Update allowed fields
    if (data) request.data = { ...request.data, ...data };
    if (notes) request.notes = notes;
    request.updatedAt = new Date();

    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update request',
      error: error.message,
    });
  }
};

// Visitor submits request (draft -> submitted)
export const submitRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify ownership
    if (request.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (request.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft requests can be submitted',
      });
    }

    // Update status
    request.status = 'submitted';
    request.submittedAt = new Date();
    await request.save();

    // Create status history
    await RequestStatus.create({
      requestId: request._id,
      status: 'draft',
      newStatus: 'submitted',
      changedBy: userId.toString(),
      reason: 'Visitor submitted request',
    });

    return res.status(200).json({
      success: true,
      message: 'Request submitted successfully',
      data: {
        requestId: request._id,
        status: request.status,
        submittedAt: request.submittedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit request',
      error: error.message,
    });
  }
};

// Visitor views request status history
export const getRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Verify ownership
    if (request.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const statusHistory = await RequestStatus.find({ requestId }).sort({ changedAt: -1 });

    return res.status(200).json({
      success: true,
      currentStatus: request.status,
      history: statusHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch status history',
      error: error.message,
    });
  }
};
