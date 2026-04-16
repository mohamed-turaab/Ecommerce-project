const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validations/userValidation');

const router = express.Router();

router.use(protect);

router.get('/me', userController.getMe);
router.patch('/me', validate(updateProfileSchema), userController.updateMe);
router.delete('/me', userController.deleteMe);

router.get('/', authorize('admin'), userController.getAllUsers);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
