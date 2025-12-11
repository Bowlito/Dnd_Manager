import mongoose from "mongoose";
import dotenv from "dotenv";
import Monster from "../models/Monster";
import connectDB from "../config/db";

dotenv.config();

const monsterSeed = async () => {
    try {
        await connectDB();
        console.log("🔌 Connecté pour le seed Monstres...");

        await Monster.deleteMany({}); // On nettoie

        const monsters = [
            {
                nom: "Gobelin",
                type: "Humanoïde",
                taille: "Petite",
                pv: 7,
                pv_max: 7,
                ca: 15,
                vitesse: 9,
                force: 8,
                dexterite: 14,
                constitution: 10,
                intelligence: 10,
                sagesse: 8,
                charisme: 8,
                challenge: 0.25,
                est_modele: true,
                actions: [
                    {
                        nom: "Cimeterre",
                        desc: "+4 au toucher, 1d6+2 dégâts tranchants.",
                    },
                ],
            },
            {
                nom: "Orc",
                type: "Humanoïde",
                taille: "Moyenne",
                pv: 15,
                pv_max: 15,
                ca: 13,
                vitesse: 9,
                force: 16,
                dexterite: 12,
                constitution: 16,
                intelligence: 7,
                sagesse: 11,
                charisme: 10,
                challenge: 0.5,
                est_modele: true,
                actions: [
                    {
                        nom: "Grande Hache",
                        desc: "+5 au toucher, 1d12+3 dégâts tranchants.",
                    },
                ],
            },
            {
                nom: "Loup",
                type: "Bête",
                taille: "Moyenne",
                pv: 11,
                pv_max: 11,
                ca: 13,
                vitesse: 12,
                force: 12,
                dexterite: 15,
                constitution: 12,
                intelligence: 3,
                sagesse: 12,
                charisme: 6,
                challenge: 0.25,
                est_modele: true,
                actions: [
                    {
                        nom: "Morsure",
                        desc: "+4 au toucher, 2d4+2 dégâts. Jet de Force DD11 ou à terre.",
                    },
                ],
            },
            {
                nom: "Jeune Dragon Rouge",
                type: "Dragon",
                taille: "Grande",
                pv: 178,
                pv_max: 178,
                ca: 18,
                vitesse: 12,
                force: 23,
                dexterite: 10,
                constitution: 21,
                intelligence: 14,
                sagesse: 11,
                charisme: 19,
                challenge: 10,
                est_modele: true,
                actions: [
                    {
                        nom: "Morsure",
                        desc: "+10 au toucher, 2d10+6 perçants + 1d6 feu.",
                    },
                    {
                        nom: "Souffle de feu",
                        desc: "16d6 feu (Dex DD 17 demi).",
                    },
                ],
            },
        ];

        await Monster.insertMany(monsters);
        console.log("✅ Monstres ajoutés !");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

monsterSeed();
