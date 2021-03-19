import express from 'express';
import { authMiddleware, checkToken, login, register } from './auth';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/', authMiddleware, checkToken);

export { authMiddleware };

export default router;
