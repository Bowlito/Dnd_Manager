import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// On étend l'interface Request d'Express pour y ajouter notre utilisateur
// Sinon TypeScript va râler en disant "la propriété user n'existe pas sur Request"
export interface AuthRequest extends Request {
    user?: any;
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token;

    // 1. On cherche le token dans le header "Authorization: Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // On enlève "Bearer " pour garder juste le code
            token = req.headers.authorization.split(" ")[1];

            // On vérifie la signature
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

            // On colle les infos du token (id, role) dans la requête pour la suite
            req.user = decoded;

            next(); // C'est tout bon, on laisse passer !
        } catch (error) {
            res.status(401).json({ message: "Token non autorisé ou expiré" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Accès refusé, pas de token" });
    }
};
