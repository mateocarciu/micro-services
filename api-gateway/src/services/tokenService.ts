import { Token } from '../models/tokenModel';
import { sign, verify } from 'jsonwebtoken';
import { config } from '../config/config';

interface JWTPayload {
  userId: string;
  role: string;
}

export class TokenService {
  async generateToken(payload: JWTPayload): Promise<string> {
    // Générer le JWT
    const token = sign(
      payload,
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    // Calculer la date d'expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Sauvegarder le token en base
    await Token.create({
      userId: payload.userId,
      token,
      expiresAt
    });

    return token;
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    // Vérifier si le token existe en base
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      throw new Error('Token non trouvé');
    }

    // Vérifier si le token n'est pas expiré
    if (tokenDoc.expiresAt < new Date()) {
      await Token.deleteOne({ _id: tokenDoc._id });
      throw new Error('Token expiré');
    }

    // Vérifier la signature du token
    const decoded = verify(token, config.jwt.secret) as JWTPayload;
    
    // Vérifier que l'userId du token correspond à celui en base
    if (decoded.userId !== tokenDoc.userId) {
      throw new Error('Token invalide');
    }

    return decoded;
  }

  async invalidateToken(token: string): Promise<void> {
    await Token.deleteOne({ token });
  }

  async invalidateAllUserTokens(userId: string): Promise<void> {
    await Token.deleteMany({ userId });
  }
}