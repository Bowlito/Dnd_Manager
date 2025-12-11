import { Request, Response } from "express";
import * as optionsService from "../services/optionsService.js";

export const getRaces = async (req: Request, res: Response) => {
    try {
        const races = await optionsService.getAllRaces();
        res.status(200).json(races);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getClasses = async (req: Request, res: Response) => {
    try {
        const classes = await optionsService.getAllClasses();
        res.status(200).json(classes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
