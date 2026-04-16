const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/authValidation');

const router = express.Router();

router.get('/register', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Use POST /api/auth/register to create a new account.', body: { name: 'Turaab', email: 'turaab@gmail.com', password: '12345678' } });
});
router.get('/login', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Use POST /api/auth/login to sign in.', body: { email: 'turaab@gmail.com', password: '12345678' } });
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/admin/login', validate(loginSchema), authController.adminLogin);
router.post('/logout', authController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
