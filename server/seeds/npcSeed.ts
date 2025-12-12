import mongoose from "mongoose";
import dotenv from "dotenv";
import Npc from "../models/Npc.js"; // Attention à l'extension .js si tu es en ES Module
import connectDB from "../config/db.js";

dotenv.config();

const npcSeed = async () => {
    try {
        await connectDB();
        console.log("🔌 Connecté pour le seed PNJ...");

        // 1. Nettoyage
        await Npc.deleteMany({});
        console.log("🧹 Anciens PNJ supprimés.");

        // 2. Données
        const npcs = [
            {
                nom: "Toblen Petipierre",
                race: "Humain",
                occupation: "Aubergiste",
                alignement: "Neutre Bon",
                apparence: "Petit, rondouillard, tablier taché de bière.",
                personnalite:
                    "Amical, adore les rumeurs, protecteur envers sa famille.",
                but: "Garder son auberge paisible et rentable.",
                secret: "Cache un bandit blessé dans sa cave par pitié.",
                voix: "Chaude et accueillante.",

                // Combat (Statblock de Roturier)
                ca: 10,
                pv: 4,
                pv_max: 4,
                vitesse: 9,
                initiative: 0,
                force: 10,
                dexterite: 10,
                constitution: 10,
                intelligence: 10,
                sagesse: 10,
                charisme: 10,
                attaques: [{ nom: "Gourdin", bonus: 2, degats: "1d4" }],
                est_actif: false,
            },
            {
                nom: "Sildar Hallhiver",
                race: "Humain",
                occupation: "Guerrier vétéran",
                alignement: "Loyal Neutre",
                apparence: "Armure usée, cheveux gris, regard sévère.",
                personnalite: "Honnête, direct, obsédé par l'ordre.",
                but: "Retrouver son ami disparu dans la mine.",
                secret: "A peur de ne plus être à la hauteur de sa légende.",
                voix: "Militaire, sèche.",

                // Combat (Statblock de Vétéran simplifié)
                ca: 17,
                pv: 58,
                pv_max: 58,
                vitesse: 9,
                initiative: 1,
                force: 16,
                dexterite: 13,
                constitution: 14,
                intelligence: 10,
                sagesse: 11,
                charisme: 10,
                attaques: [
                    { nom: "Épée longue", bonus: 5, degats: "1d8+3" },
                    { nom: "Arbalète lourde", bonus: 3, degats: "1d10" },
                ],
                est_actif: false,
            },
            {
                nom: "Requin Rouge",
                race: "Demi-Orque",
                occupation: "Chef de gang",
                alignement: "Chaotique Mauvais",
                apparence: "Immense, cicatrice en forme de morsure sur le cou.",
                personnalite: "Brutal, rit de ses propres blagues, intimidant.",
                but: "Contrôler le trafic de la région.",
                secret: "A une peur bleue des araignées.",
                voix: "Rauque, gutturale.",

                // Combat (Statblock de Chef de Bandit)
                ca: 15,
                pv: 65,
                pv_max: 65,
                vitesse: 9,
                initiative: 2,
                force: 18,
                dexterite: 14,
                constitution: 16,
                intelligence: 10,
                sagesse: 8,
                charisme: 12,
                attaques: [{ nom: "Grande Hache", bonus: 6, degats: "1d12+4" }],
                est_actif: false,
            },
            {
                nom: "Elara Chantenuit",
                race: "Elfe",
                occupation: "Prêtresse",
                alignement: "Chaotique Bon",
                apparence: "Robe blanche, tatouages argentés sur le front.",
                personnalite: "Mystérieuse, parle par énigmes, bienveillante.",
                but: "Protéger le sanctuaire de la forêt.",
                secret: "Est la dernière survivante de son ordre.",
                voix: "Douce, mélodieuse.",

                // Combat (Statblock de Prêtre)
                ca: 13,
                pv: 27,
                pv_max: 27,
                vitesse: 9,
                initiative: 1,
                force: 10,
                dexterite: 12,
                constitution: 13,
                intelligence: 12,
                sagesse: 16,
                charisme: 14,
                attaques: [
                    { nom: "Masse d'armes", bonus: 2, degats: "1d6" },
                    { nom: "Flamme sacrée", bonus: 5, degats: "1d8 (JdS Dex)" },
                ],
                est_actif: false,
            },
        ];

        // 3. Insertion
        await Npc.insertMany(npcs);
        console.log(`✅ ${npcs.length} PNJ ajoutés avec succès !`);
        process.exit();
    } catch (error) {
        console.error("❌ Erreur seed:", error);
        process.exit(1);
    }
};

npcSeed();
