import mongoose, { Document, Schema } from "mongoose";

export interface IClasse extends Document {
    nom: string; // Ex: "Clerc"
    description?: string;

    // Vie
    de_vie: number; // Ex: 8 (pour 1d8)

    // Maîtrises fixes
    maitrises: {
        armures: string[]; // Ex: ["Légères", "Moyennes", "Boucliers"]
        armes: string[]; // Ex: ["Armes courantes"]
        outils: string[];
        sauvegardes: string[]; // Ex: ["Sagesse", "Charisme"]
    };

    // Choix de compétences (Ex: Choisir 2 parmi une liste)
    choix_competences: {
        nombre: number; // Ex: 2
        liste: string[]; // Ex: ["Histoire", "Religion", "Médecine", ...]
    };

    // Magie (Optionnel)
    magie?: {
        est_lanceur: boolean;
        caracteristique: string; // Ex: "Sagesse"
    };

    // Équipement de départ suggéré (Texte simple pour l'instant)
    equipement_depart: string[];
}

const classeSchema = new Schema({
    nom: { type: String, required: true, unique: true },
    description: String,

    de_vie: { type: Number, required: true },

    maitrises: {
        armures: [String],
        armes: [String],
        outils: [String],
        sauvegardes: [String],
    },

    choix_competences: {
        nombre: { type: Number, default: 2 },
        liste: [String],
    },

    magie: {
        est_lanceur: { type: Boolean, default: false },
        caracteristique: String,
    },

    equipement_depart: [String],
});

export default mongoose.model<IClasse>("Classe", classeSchema);
