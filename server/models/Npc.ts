import mongoose, { Schema, Document } from "mongoose";

export interface INpc extends Document {
    nom: string;
    race: string;
    occupation: string;
    alignement?: string;

    // Narratif
    apparence?: string;
    personnalite?: string;
    but?: string;
    secret?: string;
    voix?: string;

    // Combat
    ca: number;
    pv: number;
    pv_max: number;
    vitesse: number;
    initiative: number;

    force: number;
    dexterite: number;
    constitution: number;
    intelligence: number;
    sagesse: number;
    charisme: number;

    attaques: { nom: string; bonus: number; degats: string }[];

    est_actif: boolean;
}

const NpcSchema: Schema = new Schema(
    {
        nom: { type: String, required: true },
        race: { type: String, default: "Humain" },
        occupation: { type: String, default: "Villageois" },
        alignement: String,

        apparence: String,
        personnalite: String,
        but: String,
        secret: String,
        voix: String,

        ca: { type: Number, default: 10 },
        pv: { type: Number, default: 4 },
        pv_max: { type: Number, default: 4 },
        vitesse: { type: Number, default: 9 },
        initiative: { type: Number, default: 0 },

        force: { type: Number, default: 10 },
        dexterite: { type: Number, default: 10 },
        constitution: { type: Number, default: 10 },
        intelligence: { type: Number, default: 10 },
        sagesse: { type: Number, default: 10 },
        charisme: { type: Number, default: 10 },

        attaques: [{ nom: String, bonus: Number, degats: String }],

        est_actif: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<INpc>("Npc", NpcSchema);
