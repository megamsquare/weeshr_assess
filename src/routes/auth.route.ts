import express from 'express';
import Auth_controller from '../controllers/auth.controller';

const router = express.Router();

router.post('/sign_up', Auth_controller.sign_up);
router.post('/sign_in', Auth_controller.sign_in);
router.post('/refresh', Auth_controller.refresh_token);

export default router;