import { Request, Response } from "express";
import * as monsterService from "../services/monsterService.js"; // <-- On importe le service

// GET /api/monsters
export const getMonsters = async (req: Request, res: Response) => {
    try {
        const monsters = await monsterService.getAllMonsters();
        res.status(200).json(monsters);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/monsters/:id
export const getMonsterById = async (req: Request, res: Response) => {
    try {
        const monster = await monsterService.getMonsterById(req.params.id);
        if (!monster) {
            return res.status(404).json({ message: "Monstre introuvable" });
        }
        res.status(200).json(monster);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH /api/monsters/:id
export const updateMonster = async (req: Request, res: Response) => {
    try {
        const updated = await monsterService.updateMonster(
            req.params.id,
            req.body
        );
        if (!updated) {
            return res.status(404).json({ message: "Monstre introuvable" });
        }
        res.status(200).json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMonster = async (req: Request, res: Response) => {
    try {
        await monsterService.deleteMonster(req.params.id);
        res.status(200).json({ message: "Monstre supprimé avec succès" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createInstance = async (req: Request, res: Response) => {
    try {
        const newMonster = await monsterService.createCombatInstance(
            req.params.id
        );
        res.status(201).json(newMonster);
    } catch (error: any) {
        // Si l'erreur est "Modèle introuvable", on renvoie 404, sinon 500
        const status =
            error.message === "Modèle de monstre introuvable" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};
