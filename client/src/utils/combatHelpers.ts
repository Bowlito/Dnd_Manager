import type { ICharacter, IMonster, IFighter } from "../types";

// Petit utilitaire pour générer des IDs uniques (nécessaire pour cloner 3 fois le même Gobelin)
const generateId = () => Math.random().toString(36).slice(2, 11);

// 1. Transforme un HÉROS en COMBATTANT
export const convertHeroToFighter = (hero: ICharacter): IFighter => {
    return {
        uniqueId: generateId(),
        referenceId: hero._id,
        type: "hero",
        name: hero.nom,
        // On va chercher les infos au fond de l'objet Hero
        hpCurrent: hero.stats.pv_actuel,
        hpMax: hero.stats.pv_max,
        ac: hero.stats.ca,
        // Pour l'instant on met juste le bonus, on fera le jet de dé plus tard
        initiative: hero.stats.init,
    };
};

// 2. Transforme un MONSTRE en COMBATTANT
export const convertMonsterToFighter = (monster: IMonster): IFighter => {
    // Calcul du modificateur de DEX pour l'initiative du monstre : (Score - 10) / 2
    const dexMod = Math.floor((monster.dexterite - 10) / 2);

    return {
        uniqueId: generateId(),
        referenceId: monster._id,
        type: "monster",
        name: monster.nom,
        // Chez le monstre, c'est rangé différemment
        hpCurrent: monster.pv,
        hpMax: monster.pv_max, // Souvent identique au début
        ac: monster.ca,
        initiative: dexMod, // On utilise le modificateur de Dex comme base
    };
};
