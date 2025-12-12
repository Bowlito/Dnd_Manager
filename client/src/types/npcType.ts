export interface INpc {
    _id: string;
    nom: string;
    race: string;
    occupation: string;
    alignement?: string;

    // RP
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
