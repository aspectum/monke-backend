import express from 'express';
import { authMiddleware, checkToken, login, register } from './auth';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.use(authMiddleware);

router.get('/', checkToken);

export { authMiddleware };

export default router;
