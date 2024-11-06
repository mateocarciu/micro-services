import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserRole } from '../types/userTypes';

export class UserController {
  // Récupérer tous les utilisateurs
  static async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find().select('-password');
      return res.status(200).json(users);
    } catch (err) {
      console.error('Get users error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error('Get user by id error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Récupérer les utilisateurs par rôle
  static async getUsersByRole(req: Request, res: Response): Promise<Response> {
    try {
      const { role } = req.params;
      
      // Vérifier si le rôle est valide
      if (!Object.values(UserRole).includes(role as UserRole)) {
        return res.status(400).json({ message: 'Rôle invalide' });
      }

      const users = await User.find({ role }).select('-password');
      return res.status(200).json(users);
    } catch (err) {
      console.error('Get users by role error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Empêcher la mise à jour du mot de passe via cette route
      const { password, ...updateData } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { ...updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error('Update user error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
      console.error('Delete user error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}