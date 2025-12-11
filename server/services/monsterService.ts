import Monster, { IMonsterModel } from "../models/Monster.js";

// Récupérer tous les monstres
export const getAllMonsters = async (): Promise<IMonsterModel[]> => {
    return await Monster.find().sort("nom");
};

// Récupérer un monstre par ID
export const getMonsterById = async (
    id: string
): Promise<IMonsterModel | null> => {
    return await Monster.findById(id);
};

// Mettre à jour un monstre (PV, Actif...)
export const updateMonster = async (
    id: string,
    data: Partial<IMonsterModel>
): Promise<IMonsterModel | null> => {
    return await Monster.findByIdAndUpdate(id, data, { new: true });
};

// Supprimer un monstre
export const deleteMonster = async (id: string): Promise<IMonsterModel | null> => {
  return await Monster.findByIdAndDelete(id);
};

//Créer un clone du monstre pour le combat

export const createCombatInstance = async (
    templateId: string
): Promise<IMonsterModel> => {
    // 1. On récupère le "moule" (le monstre du bestiaire)
    const template = await Monster.findById(templateId);
    if (!template) {
        throw new Error("Modèle de monstre introuvable");
    }

    // 2. On compte combien de clones existent déjà pour le nommer (ex: "Gobelin 1", "Gobelin 2")
    // On cherche ceux qui commencent par le même nom et qui ne sont PAS des modèles
    const count = await Monster.countDocuments({
        est_modele: false,
        nom: { $regex: new RegExp(`^${template.nom}`, "i") },
    });

    // 3. On crée la copie propre au combat
    const newInstance = new Monster({
        ...template.toObject(), // On copie tout
        _id: undefined, // On laisse Mongo créer un nouvel ID
        createdAt: undefined,
        updatedAt: undefined,

        nom: `${template.nom} ${count + 1}`, // ex: "Gobelin 1"
        est_modele: false, // C'est une copie, pas un modèle
        est_actif: true, // Il arrive directement sur le plateau
        pv: template.pv_max, // On s'assure qu'il est full vie
    });

    return await newInstance.save();
};
