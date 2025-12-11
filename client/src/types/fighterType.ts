export interface IFighter {
    uniqueId: string; // UUID généré au moment de l'ajout (pour les clones)
    referenceId: string; // L'ID original de la BDD (_id)
    type: "hero" | "monster";

    // Infos d'affichage
    name: string;
    avatar?: string; // Optionnel, pour plus tard

    // Stats de Combat (Modifiables en temps réel)
    hpCurrent: number;
    hpMax: number;
    ac: number; // Classe d'armure

    // Initiative
    initiative: number; // La valeur finale du jet (d20 + dex)
}
