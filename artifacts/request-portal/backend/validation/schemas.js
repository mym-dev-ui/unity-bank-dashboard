import Joi from 'joi';

// Visitor profile validation - safe public data
export const visitorProfileSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 100 characters',
    }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be valid (7-15 digits)',
      'string.empty': 'Phone number is required',
    }),
  idNumber: Joi.string()
    .trim()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.empty': 'ID number is required',
      'string.min': 'ID number must be at least 5 characters',
    }),
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters',
    }),
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
    }),
});

// Request creation - visitor-submitted data
export const createRequestSchema = Joi.object({
  requestType: Joi.string()
    .valid('account_opening', 'document_request', 'service_request')
    .required()
    .messages({
      'any.only': 'Invalid request type',
      'string.empty': 'Request type is required',
    }),
  data: Joi.object({
    fullName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .required(),
    idNumber: Joi.string()
      .trim()
      .min(5)
      .max(20)
      .required(),
    address: Joi.string()
      .trim()
      .min(5)
      .max(200)
      .required(),
  })
    .required()
    .messages({
      'object.base': 'Request data must be an object',
    }),
});

// Request data update - visitor can modify their own data
export const updateRequestDataSchema = Joi.object({
  data: Joi.object({
    fullName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .optional(),
    idNumber: Joi.string()
      .trim()
      .min(5)
      .max(20)
      .optional(),
    address: Joi.string()
      .trim()
      .min(5)
      .max(200)
      .optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
  notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters',
    }),
}).min(1);

// Request submission validation
export const submitRequestSchema = Joi.object({
  // Empty object - submission only changes status, no sensitive data
}).unknown(false);

// Admin request status update - safe status transitions
export const updateRequestStatusSchema = Joi.object({
  newStatus: Joi.string()
    .valid('pending', 'approved', 'rejected', 'completed')
    .required()
    .messages({
      'any.only': 'Invalid status',
      'string.empty': 'Status is required',
    }),
  reason: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Reason cannot exceed 500 characters',
    }),
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters',
    }),
}).min(1);

// Admin notes only - for internal documentation
export const addAdminNotesSchema = Joi.object({
  notes: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Notes cannot be empty',
      'string.max': 'Notes cannot exceed 1000 characters',
    }),
});

// Query validation for listing requests
export const listRequestsQuerySchema = Joi.object({
  status: Joi.string()
    .valid('draft', 'submitted', 'pending', 'approved', 'rejected', 'completed')
    .optional(),
  requestType: Joi.string()
    .valid('account_opening', 'document_request', 'service_request')
    .optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional(),
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'status')
    .default('createdAt')
    .optional(),
  order: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .optional(),
});
