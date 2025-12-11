import Race from "../models/Race.js";
import Classe from "../models/Classe.js";

export const getAllRaces = async () => {
    return await Race.find().sort("nom");
};

export const getAllClasses = async () => {
    return await Classe.find().sort("nom");
};
