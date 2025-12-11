// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as authService from "../services/auth.service"

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Appel au service
        const data = await authService.loginUser(email, password);

        res.status(200).json(data);
    } catch (error: any) {
        // Si le service renvoie une erreur (mauvais mdp), on renvoie 401 (Non autorisé)
        res.status(401).json({ message: error.message });
    }
};
