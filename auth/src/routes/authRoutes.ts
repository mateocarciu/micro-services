import { Router } from 'express';
import { check } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { validateApiKey } from '../middlewares/apiKeyMiddleware';
import { UserRole } from '../types/userTypes';

const router = Router();

// Appliquer le middleware de validation de la clé API à toutes les routes
router.use(validateApiKey);

router.post('/register', [
  check('email', 'Email invalide').isEmail(),
  check('password', 'Le mot de passe doit faire au moins 6 caractères').isLength({ min: 6 }),
  check('role', 'Rôle invalide').isIn(Object.values(UserRole))
], AuthController.register);

router.post('/login', AuthController.login);

export default router;