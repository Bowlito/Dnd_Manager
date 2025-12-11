export interface IMonster {
    _id: string;
    nom: string;
    type: string; // ex: "Bête", "Dragon"
    taille: string; // ex: "Moyenne", "Grande"
    alignement?: string; // Optionnel

    // Stats Vitales
    pv: number;
    pv_max: number;
    ca: number;
    vitesse: number;

    // Caractéristiques
    force: number;
    dexterite: number;
    constitution: number;
    intelligence: number;
    sagesse: number;
    charisme: number;

    // Gameplay
    challenge: number; // Puissance (CR)
    xp?: number;

    actions: {
        nom: string;
        desc: string; // Description de l'attaque (ex: "Melee Weapon Attack: +4 to hit...")
    }[];

    // Gestion Dashboard
    est_actif: boolean;
    est_modele: boolean;
    initiative: number;
}
