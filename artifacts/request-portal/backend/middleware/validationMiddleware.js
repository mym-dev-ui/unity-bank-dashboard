import { createRequestSchema, updateRequestDataSchema, updateRequestStatusSchema, addAdminNotesSchema, listRequestsQuerySchema, visitorProfileSchema } from '../validation/schemas.js';

// Generic validation middleware factory
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    next();
  };
};

// Generic query validation middleware factory
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.details.map((detail) => detail.message),
      });
    }

    req.query = value;
    next();
  };
};

// Safe request form validation middleware
export const validateVisitorRequest = validateBody(createRequestSchema);
export const validateRequestUpdate = validateBody(updateRequestDataSchema);
export const validateRequestStatus = validateBody(updateRequestStatusSchema);
export const validateAdminNotes = validateBody(addAdminNotesSchema);
export const validateVisitorProfile = validateBody(visitorProfileSchema);
export const validateRequestListQuery = validateQuery(listRequestsQuerySchema);
