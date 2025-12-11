import mongoose, { Document, Schema } from "mongoose";

export interface IRace extends Document {
    nom: string; // Ex: "Nain des collines"
    description?: string;

    // Stats raciales
    vitesse: number; // Ex: 7.5 (mètres) ou 25 (pieds)
    taille: string; // Ex: "Moyenne"
    vision_nocturne: boolean; // true/false

    // Bonus aux caractéristiques (Ex: [{stat: "constitution", val: 2}])
    bonus_caracteristiques: {
        stat: string;
        val: number;
    }[];

    // Ce que la race donne gratuitement
    maitrises: {
        armes: string[]; // Ex: ["Hache de guerre", "Marteau léger"]
        armures: string[];
        outils: string[]; // Ex: ["Outils de forgeron"]
        langues: string[]; // Ex: ["Commun", "Nain"]
    };

    // Les pouvoirs spéciaux (Ex: "Résistance naine")
    traits: {
        nom: string;
        desc: string;
    }[];
}

const raceSchema = new Schema({
    nom: { type: String, required: true, unique: true },
    description: String,

    vitesse: { type: Number, default: 9 },
    taille: { type: String, default: "Moyenne" },
    vision_nocturne: { type: Boolean, default: false },

    bonus_caracteristiques: [
        {
            stat: String,
            val: Number,
        },
    ],

    maitrises: {
        armes: [String],
        armures: [String],
        outils: [String],
        langues: [String],
    },

    traits: [
        {
            nom: String,
            desc: String,
        },
    ],
});

export default mongoose.model<IRace>("Race", raceSchema);
