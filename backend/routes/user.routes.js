import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('enter a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('password must be at least 3 chars long'),
    userController.createUserController);

    router.post('/login',
    body('email').isEmail().withMessage('enter a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('password must be at least 3 chars long'),
    userController.login);
router.get('/profile', authMiddleware.authUser, userController.profile);
router.get('/logout', authMiddleware.authUser, userController.logout);
export default router;
