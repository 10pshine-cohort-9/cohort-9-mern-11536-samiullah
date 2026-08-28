const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation Error', 422, errors.array());
  }
  next();
};

const createNoteValidation = [
  body('title').trim().notEmpty().withMessage('Note title is required.').isLength({ max: 255 }),
  body('content').optional().isString(),
  body('category').optional().trim().isLength({ max: 50 }),
  body('tags').optional().isString(),
  body('color').optional().trim().isLength({ max: 20 }),
  validate
];

const updateNoteValidation = [
  body('title').optional().trim().notEmpty().withMessage('Note title cannot be empty.').isLength({ max: 255 }),
  body('content').optional().isString(),
  body('category').optional().trim().isLength({ max: 50 }),
  body('tags').optional().isString(),
  body('color').optional().trim().isLength({ max: 20 }),
  validate
];

module.exports = {
  createNoteValidation,
  updateNoteValidation
};
