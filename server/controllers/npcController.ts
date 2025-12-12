import { Request, Response } from "express";
import * as npcService from "../services/npcService.js";

export const getNpcs = async (req: Request, res: Response) => {
    try {
        const npcs = await npcService.getAllNpcs();
        res.status(200).json(npcs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getNpcById = async (req: Request, res: Response) => {
    try {
        const npc = await npcService.getNpcById(req.params.id);
        if (!npc) return res.status(404).json({ message: "PNJ introuvable" });
        res.status(200).json(npc);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createNpc = async (req: Request, res: Response) => {
    try {
        const newNpc = await npcService.createNpc(req.body);
        res.status(201).json(newNpc);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateNpc = async (req: Request, res: Response) => {
    try {
        const updated = await npcService.updateNpc(req.params.id, req.body);
        if (!updated)
            return res.status(404).json({ message: "PNJ introuvable" });
        res.status(200).json(updated);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNpc = async (req: Request, res: Response) => {
    try {
        await npcService.deleteNpc(req.params.id);
        res.status(200).json({ message: "PNJ supprimé" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
