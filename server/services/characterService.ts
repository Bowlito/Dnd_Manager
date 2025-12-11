import Character, { ICharacter } from "../models/Character";

export const getAllCharacters = async () => {
    return await Character.find();
};

export const getCharacterById = async (id: string) => {
    return await Character.findById(id);
};

export const createNewCharacter = async (
    characterData: Partial<ICharacter>
) => {
    const character = new Character(characterData);
    return await character.save();
};

export const updateCharacter = async (
    id: string,
    updateData: Partial<ICharacter>
) => {
    return await Character.findByIdAndUpdate(id, updateData);
};

export const deleteCharacter = async (
    id: string
) => {
    return await Character.findByIdAndDelete(id)
}
