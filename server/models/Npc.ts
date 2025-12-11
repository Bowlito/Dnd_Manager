import mongoose, { Document, Schema } from "mongoose";

export interface INpc {
    nom: string;
    classe: string;
    race: string;
    niveau: string;
    estPnj: boolean;
    est_actif: boolean;
    initiative: number;

    // Caractéristiques
    caracteristiques: {
        force: number;
        dexterite: number;
        constitution: number;
        intelligence: number;
        sagesse: number;
        charisme: number;
    };
}
