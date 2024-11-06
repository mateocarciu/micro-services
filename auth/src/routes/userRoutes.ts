import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateApiKey } from '../middlewares/apiKeyMiddleware';
import { check } from 'express-validator';

const router = Router();

// Appliquer le middleware de validation de la clé API à toutes les routes
router.use(validateApiKey);

// Routes pour la gestion des utilisateurs
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.get('/role/:role', UserController.getUsersByRole);
router.put('/:id', [
  check('email', 'Email invalide').optional().isEmail(),
  check('role', 'Rôle invalide').optional().isIn(['client', 'chef', 'livreur']),
], UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;