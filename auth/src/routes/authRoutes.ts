import { Router } from 'express';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middleware/authMiddleware';
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';

const router = Router();
const authService = new AuthService();

// Applique le middleware API Key pour toutes les routes
router.use(apiKeyMiddleware);

router.post('/register', async (req, res) => {
  try {
    const token = await authService.register(req.body);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const token = await authService.login(req.body.username, req.body.password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Exemple de route protégée
router.get('/protected', authMiddleware(['chef', 'livreur']), (req, res) => {
  res.json({ message: `Bienvenue, ${req.user.role}` });
});

export default router;
