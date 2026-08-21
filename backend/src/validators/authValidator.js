const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation Error', 422, errors.array());
  }
  next();
};

const registerValidation = [
  body('full_name').trim().notEmpty().withMessage('Full name is required.').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  validate
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate
];

const updateProfileValidation = [
  body('full_name').trim().notEmpty().withMessage('Full name cannot be empty.').isLength({ min: 2, max: 100 }),
  body('email').optional().trim().isEmail().withMessage('Invalid email format.').normalizeEmail(),
  validate
];

const changePasswordValidation = [
  body('current_password').notEmpty().withMessage('Current password is required.'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
};
