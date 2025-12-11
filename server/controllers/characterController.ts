import { Request, Response } from "express";
import * as characterService from "../services/characterService";

export const getCharacters = async (req: Request, res: Response) => {
    try {
        const characters = await characterService.getAllCharacters();
        res.status(200).json(characters);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCharacterById = async (req: Request, res: Response) => {
    try {
        const character = await characterService.getCharacterById(
            req.params.id
        );
        return res.status(200).json(character);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCharacter = async (req: Request, res: Response) => {
    try {
        const newCharacter = await characterService.createNewCharacter(
            req.body
        );
        return res.status(201).json(newCharacter);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCharacter = async (req: Request, res: Response) => {
    try {
        const updatedCharacter = await characterService.updateCharacter(
            req.params.id,
            req.body
        );
        if (!updateCharacter) {
            return res.status(404).json({ message: "Personnage introuvable" });
        }

        return res.status(200).json(updatedCharacter);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCharacter = async (req: Request, res: Response) => {
    try {
        const deleted = await characterService.deleteCharacter(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Personnage introuvable" });
        }

        res.status(200).json({ message: "Personnage supprimé avec succès" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
