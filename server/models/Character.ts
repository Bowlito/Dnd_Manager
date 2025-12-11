import mongoose, { Document, Schema } from "mongoose";

// --- 1. INTERFACE TYPESCRIPT ---
export interface ICharacter extends Document {
    // --- IDENTITÉ ---
    nom: string;
    classe: string; // Ex: "Clerc"
    sous_classe?: string; // Ex: "Domaine de la Vie"
    race: string; // Ex: "Nain des collines"
    historique?: string; // Ex: "Soldat"
    alignement?: string; // Ex: "Loyal Bon"
    niveau: number; // Ex: 1
    xp?: number; // Points d'expérience
    nom_joueur?: string;
    estPnj: boolean;
    est_actif: boolean;
    initiative: number;
    

    // --- CARACTÉRISTIQUES (Scores bruts) ---
    caracteristiques: {
        force: number;
        dexterite: number;
        constitution: number;
        intelligence: number;
        sagesse: number;
        charisme: number;
    };

    // --- MAÎTRISES & LANGUES ---
    maitrises: {
        bonus: number; // Ex: +2
        sauvegardes: string[]; // Ex: ["Sagesse", "Charisme"]
        competences: string[]; // Ex: ["Athlétisme", "Intimidation"]
        armures: string[]; // Ex: ["Lourdes", "Boucliers"]
        armes: string[]; // Ex: ["Armes courantes"]
        outils: string[]; // Ex: "Jeu de dés"
        langues: string[]; // Ex: ["Commun", "Nain"]
    };

    // --- COMBAT & VITALITÉ ---
    stats: {
        pv_max: number;
        pv_actuel: number;
        pv_temporaire: number;
        des_vie: {
            total: number; // Ex: 1
            face: number; // Ex: 8 (pour d8)
            disponibles: number;
        };
        contre_la_mort: {
            // Succès/Echecs
            succes: number;
            echecs: number;
        };
        ca: number; // Classe d'armure
        init: number; // Initiative
        vitesse: number; // En mètres (ex: 7.5)
        perception_passive: number;
        inspiration: boolean;
    };

    // --- MAGIE ---
    magie: {
        classe_lancement?: string; // Ex: "Clerc"
        caracteristique?: string; // Ex: "Sagesse"
        dd_sauvegarde?: number; // Ex: 13
        bonus_attaque_sort?: number; // Ex: +5

        // Gestion des ressources (Slots)
        emplacements: {
            niveau_1: { max: number; actuel: number };
            niveau_2: { max: number; actuel: number };
            niveau_3: { max: number; actuel: number };
            niveau_4: { max: number; actuel: number };
            niveau_5: { max: number; actuel: number };
            niveau_6: { max: number; actuel: number };
            niveau_7: { max: number; actuel: number };
            niveau_8: { max: number; actuel: number };
            niveau_9: { max: number; actuel: number };
        };

        // Listes de sorts
        sorts_mineurs: {
            // Cantrips (0)
            nom: string;
            desc?: string;
        }[];
        sorts_prepares: {
            // Sorts de niveau 1+
            nom: string;
            niveau: number;
            prepare: boolean; // Toujours true pour ceux de la liste
            domaine?: boolean; // Si c'est un sort de domaine (toujours préparé)
        }[];
    };

    // --- ACTIONS & ATTAQUES ---
    actions: {
        nom: string; // Ex: "Masse d'armes"
        bonus_attaque: number; // Ex: +4
        degats: string; // Ex: "1d6 + 2"
        type_degats: string; // Ex: "Contondant"
        portee?: string; // Ex: "1.50m"
        desc?: string; // Description complète
    }[];

    // --- ÉQUIPEMENT & ARGENT ---
    inventaire: {
        pieces: {
            pc: number; // Cuivre
            pa: number; // Argent
            pe: number; // Electrum
            po: number; // Or
            pp: number; // Platine
        };
        equipement: {
            nom: string; // Ex: "Cotte de mailles"
            quantite: number;
            equipe: boolean; // Si l'objet est porté
            poids?: number;
            desc?: string;
        }[];
    };

    // --- TRAITS & CAPACITÉS ---
    traits: {
        nom: string; // Ex: "Disciple de la Vie"
        source: string; // Ex: "Race", "Classe"
        desc: string;
    }[];

    // --- ROLEPLAY ---
    details: {
        apparence: {
            age?: number;
            taille?: string;
            poids?: string;
            yeux?: string;
            peau?: string;
            cheveux?: string;
        };
        personnalite?: string;
        ideaux?: string;
        liens?: string;
        defauts?: string;
        histoire?: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

// --- 2. SCHÉMA MONGOOSE ---
const characterSchema: Schema = new Schema(
    {
        nom: { type: String, required: true },
        classe: { type: String, required: true },
        sous_classe: String,
        race: { type: String, default: "Inconnu" },
        historique: String,
        alignement: String,
        niveau: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
        nom_joueur: String,
        estPnj: { type: Boolean, default: false },
        est_actif: { type: Boolean, default: false },
        initiative: {type: Number, default: 0},

        caracteristiques: {
            force: { type: Number, default: 10 },
            dexterite: { type: Number, default: 10 },
            constitution: { type: Number, default: 10 },
            intelligence: { type: Number, default: 10 },
            sagesse: { type: Number, default: 10 },
            charisme: { type: Number, default: 10 },
        },

        maitrises: {
            bonus: { type: Number, default: 2 },
            sauvegardes: [String],
            competences: [String],
            armures: [String],
            armes: [String],
            outils: [String],
            langues: [String],
        },

        stats: {
            pv_max: { type: Number, required: true },
            pv_actuel: { type: Number, required: true },
            pv_temporaire: { type: Number, default: 0 },
            des_vie: {
                total: { type: Number, default: 1 },
                face: { type: Number, default: 8 },
                disponibles: { type: Number, default: 1 },
            },
            contre_la_mort: {
                succes: { type: Number, default: 0 },
                echecs: { type: Number, default: 0 },
            },
            ca: { type: Number, required: true },
            init: { type: Number, default: 0 },
            vitesse: { type: Number, default: 9 },
            perception_passive: { type: Number, default: 10 },
            inspiration: { type: Boolean, default: false },
        },

        magie: {
            classe_lancement: String,
            caracteristique: String,
            dd_sauvegarde: Number,
            bonus_attaque_sort: Number,
            emplacements: {
                niveau_1: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_2: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_3: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_4: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_5: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_6: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_7: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_8: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
                niveau_9: {
                    max: { type: Number, default: 0 },
                    actuel: { type: Number, default: 0 },
                },
            },
            sorts_mineurs: [
                {
                    nom: String,
                    desc: String,
                },
            ],
            sorts_prepares: [
                {
                    nom: String,
                    niveau: Number,
                    prepare: { type: Boolean, default: true },
                    domaine: { type: Boolean, default: false },
                },
            ],
        },

        actions: [
            {
                nom: String,
                bonus_attaque: Number,
                degats: String,
                type_degats: String,
                portee: String,
                desc: String,
            },
        ],

        inventaire: {
            pieces: {
                pc: { type: Number, default: 0 },
                pa: { type: Number, default: 0 },
                pe: { type: Number, default: 0 },
                po: { type: Number, default: 0 },
                pp: { type: Number, default: 0 },
            },
            equipement: [
                {
                    nom: String,
                    quantite: { type: Number, default: 1 },
                    equipe: { type: Boolean, default: false },
                    poids: Number,
                    desc: String,
                },
            ],
        },

        traits: [
            {
                nom: String,
                source: String,
                desc: String,
            },
        ],

        details: {
            apparence: {
                age: Number,
                taille: String,
                poids: String,
                yeux: String,
                peau: String,
                cheveux: String,
            },
            personnalite: String,
            ideaux: String,
            liens: String,
            defauts: String,
            histoire: String,
        },
    },
    {
        timestamps: true,
    }
);

const Character = mongoose.model<ICharacter>("Character", characterSchema);
export default Character;
