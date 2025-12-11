import mongoose, { Schema, Document } from "mongoose";

// 1. L'Interface pour le code Serveur (similaire à celle du client)
export interface IMonsterModel extends Document {
    nom: string;
    type: string;
    taille: string;
    pv: number;
    pv_max: number;
    ca: number;
    vitesse: number;
    force: number;
    dexterite: number;
    constitution: number;
    intelligence: number;
    sagesse: number;
    charisme: number;
    challenge: number;
    actions: { nom: string; desc: string }[];
    est_actif: boolean;
    est_modele: boolean;
    initiative: number;
}

// 2. Le Schéma Mongoose (La structure dans la BDD)
const MonsterSchema: Schema = new Schema(
    {
        nom: { type: String, required: true },
        type: { type: String, required: true }, // Humanoïde, Bête, Dragon...
        taille: { type: String, default: "Moyenne" },

        // Stats de Combat
        pv: { type: Number, required: true },
        pv_max: { type: Number, required: true },
        ca: { type: Number, required: true },
        vitesse: { type: Number, default: 9 }, // En mètres (9m = 30ft)

        // Caractéristiques (10 par défaut)
        force: { type: Number, default: 10 },
        dexterite: { type: Number, default: 10 },
        constitution: { type: Number, default: 10 },
        intelligence: { type: Number, default: 10 },
        sagesse: { type: Number, default: 10 },
        charisme: { type: Number, default: 10 },

        // Info Jeu
        challenge: { type: Number, default: 0 }, // Puissance (CR)
        actions: [
            {
                nom: { type: String, required: true },
                desc: { type: String, required: true },
            },
        ],

        // Gestion Dashboard (Table de jeu)
        est_actif: { type: Boolean, default: false },
        est_modele: { type: Boolean, default: true },
        initiative: {type: Number, default: 0}
    },
    { timestamps: true }
);

export default mongoose.model<IMonsterModel>("Monster", MonsterSchema);
