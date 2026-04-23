import Joi from 'joi';

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: messages,
      });
    }

    // Replace request property with validated data
    req[property] = value;
    next();
  };
};

// Validation middleware for request body
export const validateBody = (schema) => validate(schema, 'body');

// Validation middleware for query parameters
export const validateQuery = (schema) => validate(schema, 'query');

// Validation middleware for URL parameters
export const validateParams = (schema) => validate(schema, 'params');

// Safe error handler for validation
export const validationErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Request validation failed',
      message: err.message,
    });
  }
  next(err);
};
