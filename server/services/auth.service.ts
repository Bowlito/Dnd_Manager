import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// Type pour le retour de la fonction
interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  // 1. On cherche l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // 2. On vérifie le mot de passe
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // 3. On génère le Token
  if (!process.env.JWT_SECRET) {
    throw new Error("Erreur serveur : Clé JWT manquante");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Expire dans 1 jour
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    }
  };
};