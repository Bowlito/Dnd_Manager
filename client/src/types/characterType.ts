export interface ICharacter {
    _id: string; // L'identifiant unique MongoDB

    // --- IDENTITÉ ---
    nom: string;
    classe: string;
    sous_classe?: string;
    race: string;
    historique?: string;
    alignement?: string;
    niveau: number;
    xp?: number;
    nom_joueur?: string;
    estPnj: boolean;
    est_actif: boolean;
    initiative: number;

    // --- CARACTÉRISTIQUES ---
    caracteristiques: {
        force: number;
        dexterite: number;
        constitution: number;
        intelligence: number;
        sagesse: number;
        charisme: number;
    };

    // --- MAÎTRISES ---
    maitrises: {
        bonus: number;
        sauvegardes: string[];
        competences: string[];
        armures: string[];
        armes: string[];
        outils: string[];
        langues: string[];
    };

    // --- COMBAT & VITALITÉ ---
    stats: {
        pv_max: number;
        pv_actuel: number;
        pv_temporaire: number;
        des_vie: {
            total: number;
            face: number;
            disponibles: number;
        };
        contre_la_mort: {
            succes: number;
            echecs: number;
        };
        ca: number;
        init: number;
        vitesse: number;
        perception_passive: number;
        inspiration: boolean;
    };

    // --- MAGIE ---
    magie?: {
        // Optionnel car les non-magiciens n'ont pas cet objet
        classe_lancement?: string;
        caracteristique?: string;
        dd_sauvegarde?: number;
        bonus_attaque_sort?: number;
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
        sorts_mineurs: {
            nom: string;
            desc?: string;
        }[];
        sorts_prepares: {
            nom: string;
            niveau: number;
            prepare: boolean;
            domaine?: boolean;
        }[];
    };

    // --- ACTIONS ---
    actions: {
        nom: string;
        bonus_attaque: number;
        degats: string;
        type_degats: string;
        portee?: string;
        desc?: string;
    }[];

    // --- INVENTAIRE ---
    inventaire: {
        pieces: {
            pc: number;
            pa: number;
            pe: number;
            po: number;
            pp: number;
        };
        equipement: {
            nom: string;
            quantite: number;
            equipe: boolean;
            poids?: number;
            desc?: string;
        }[];
    };

    // --- TRAITS ---
    traits: {
        nom: string;
        source: string;
        desc: string;
    }[];

    // --- DÉTAILS ---
    details?: {
        apparence?: {
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

    createdAt?: string;
    updatedAt?: string;
}


