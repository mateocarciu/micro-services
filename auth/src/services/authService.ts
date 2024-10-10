import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export class AuthService {
  async register(userDetails: Partial<IUser>) {
    const user = new User(userDetails);
    await user.save();
    return this.generateToken(user);
  }

  async login(username: string, password: string) {
    const user = await User.findOne({ username });

    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  generateToken(user: IUser) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );
  }

  verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
  }
}
