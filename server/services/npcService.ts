import Npc, { INpc } from "../models/Npc.js";

export const getAllNpcs = async (): Promise<INpc[]> => {
    return await Npc.find().sort("nom");
};

export const getNpcById = async (id: string): Promise<INpc | null> => {
    return await Npc.findById(id);
};

export const createNpc = async (data: Partial<INpc>): Promise<INpc> => {
    const newNpc = new Npc(data);
    return await newNpc.save();
};

export const updateNpc = async (
    id: string,
    data: Partial<INpc>
): Promise<INpc | null> => {
    return await Npc.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNpc = async (id: string): Promise<INpc | null> => {
    return await Npc.findByIdAndDelete(id);
};
