import mongoose from "mongoose";
import dotenv from "dotenv";
import Race from "../models/Race.js";
import Classe from "../models/Classe.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedDB = async () => {
    try {
        await connectDB();
        console.log("🔌 Connecté à MongoDB pour le seed...");

        // 1. NETTOYAGE
        await Race.deleteMany({});
        await Classe.deleteMany({});
        console.log("🧹 Anciennes données supprimées.");

        // 2. DONNÉES DES RACES (PHB COMPLET)
        const races = [
            {
                nom: "Nain",
                vitesse: 7.5,
                taille: "Moyenne",
                vision_nocturne: true,
                bonus_caracteristiques: [{ stat: "constitution", val: 2 }],
                maitrises: {
                    armes: [
                        "Hache de guerre",
                        "Hachette",
                        "Marteau léger",
                        "Marteau de guerre",
                    ],
                    armures: [],
                    outils: ["Outils de forgeron"],
                    langues: ["Commun", "Nain"],
                },
                traits: [
                    {
                        nom: "Résistance naine",
                        desc: "Avantage JdS poison, résistance dégâts poison.",
                    },
                    {
                        nom: "Connaissance de la pierre",
                        desc: "Expertise Histoire sur la pierre.",
                    },
                ],
            },
            {
                nom: "Elfe",
                vitesse: 9,
                taille: "Moyenne",
                vision_nocturne: true,
                bonus_caracteristiques: [{ stat: "dexterite", val: 2 }],
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Elfique"],
                },
                traits: [
                    {
                        nom: "Sens aiguisés",
                        desc: "Maîtrise de la Perception.",
                    },
                    {
                        nom: "Ascendance féerique",
                        desc: "Avantage contre charmes, immunité sommeil magique.",
                    },
                    {
                        nom: "Transe",
                        desc: "4h de méditation = 8h de sommeil.",
                    },
                ],
            },
            {
                nom: "Halfelin",
                vitesse: 7.5,
                taille: "Petite",
                vision_nocturne: false,
                bonus_caracteristiques: [{ stat: "dexterite", val: 2 }],
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Halfelin"],
                },
                traits: [
                    { nom: "Chanceux", desc: "Relance les 1 sur un d20." },
                    { nom: "Brave", desc: "Avantage JdS contre la peur." },
                    {
                        nom: "Agilité halfeline",
                        desc: "Peut traverser l'espace des créatures plus grandes.",
                    },
                ],
            },
            {
                nom: "Humain",
                vitesse: 9,
                taille: "Moyenne",
                vision_nocturne: false,
                bonus_caracteristiques: [
                    { stat: "force", val: 1 },
                    { stat: "dexterite", val: 1 },
                    { stat: "constitution", val: 1 },
                    { stat: "intelligence", val: 1 },
                    { stat: "sagesse", val: 1 },
                    { stat: "charisme", val: 1 },
                ],
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Une autre au choix"],
                },
                traits: [],
            },
            {
                nom: "Drakéide",
                vitesse: 9,
                taille: "Moyenne",
                vision_nocturne: false,
                bonus_caracteristiques: [
                    { stat: "force", val: 2 },
                    { stat: "charisme", val: 1 },
                ],
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Draconique"],
                },
                traits: [
                    {
                        nom: "Souffle",
                        desc: "Action pour exhaler une énergie destructrice (selon ancêtre).",
                    },
                    {
                        nom: "Résistance",
                        desc: "Résistance au type de dégâts de votre ancêtre.",
                    },
                ],
            },
            {
                nom: "Gnome",
                vitesse: 7.5,
                taille: "Petite",
                vision_nocturne: true,
                bonus_caracteristiques: [{ stat: "intelligence", val: 2 }],
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Gnome"],
                },
                traits: [
                    {
                        nom: "Ruse gnome",
                        desc: "Avantage aux JdS Int, Sag et Cha contre la magie.",
                    },
                ],
            },
            {
                nom: "Demi-Elfe",
                vitesse: 9,
                taille: "Moyenne",
                vision_nocturne: true,
                bonus_caracteristiques: [{ stat: "charisme", val: 2 }], // +2 autres au choix normalement
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Elfique", "Une autre au choix"],
                },
                traits: [
                    {
                        nom: "Ascendance féerique",
                        desc: "Avantage contre charmes, immunité sommeil magique.",
                    },
                    {
                        nom: "Polyvalence",
                        desc: "Maîtrise de deux compétences au choix.",
                    },
                ],
            },
            {
                nom: "Demi-Orque",
                vitesse: 9,
                taille: "Moyenne",
                vision_nocturne: true,
                bonus_caracteristiques: [
                    { stat: "force", val: 2 },
                    { stat: "constitution", val: 1 },
                ],
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Orque"],
                },
                traits: [
                    { nom: "Menaçant", desc: "Maîtrise de l'Intimidation." },
                    {
                        nom: "Endurance implacable",
                        desc: "Tomber à 0 PV vous remet à 1 PV (1 fois/repos long).",
                    },
                    {
                        nom: "Attaques sauvages",
                        desc: "Critique au corps à corps = 1 dé de dégâts supplémentaire.",
                    },
                ],
            },
            {
                nom: "Tieffelin",
                vitesse: 9,
                taille: "Moyenne",
                vision_nocturne: true,
                bonus_caracteristiques: [
                    { stat: "charisme", val: 2 },
                    { stat: "intelligence", val: 1 },
                ],
                maitrises: {
                    armes: [],
                    armures: [],
                    outils: [],
                    langues: ["Commun", "Infernal"],
                },
                traits: [
                    {
                        nom: "Résistance infernale",
                        desc: "Résistance aux dégâts de feu.",
                    },
                    {
                        nom: "Héritage infernal",
                        desc: "Connaît le sort mineur Thaumaturgie.",
                    },
                ],
            },
        ];

        // 3. DONNÉES DES CLASSES (PHB COMPLET)
        const classes = [
            {
                nom: "Barbare",
                de_vie: 12,
                maitrises: {
                    armures: ["Légères", "Moyennes", "Boucliers"],
                    armes: ["Armes courantes", "Armes de guerre"],
                    outils: [],
                    sauvegardes: ["Force", "Constitution"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Athlétisme",
                        "Intimidation",
                        "Nature",
                        "Perception",
                        "Survie",
                    ],
                },
                magie: { est_lanceur: false },
                equipement_depart: ["Grande hache", "Hachette (2)"],
            },
            {
                nom: "Barde",
                de_vie: 8,
                maitrises: {
                    armures: ["Légères"],
                    armes: [
                        "Armes courantes",
                        "Arbalète de main",
                        "Épée longue",
                        "Rapière",
                        "Épée courte",
                    ],
                    outils: ["3 instruments de musique"],
                    sauvegardes: ["Dextérité", "Charisme"],
                },
                choix_competences: { nombre: 3, liste: ["Toutes"] },
                magie: { est_lanceur: true, caracteristique: "Charisme" },
                equipement_depart: [
                    "Rapière",
                    "Luth",
                    "Armure de cuir",
                    "Dague",
                ],
            },
            {
                nom: "Clerc",
                de_vie: 8,
                maitrises: {
                    armures: ["Légères", "Moyennes", "Boucliers"],
                    armes: ["Armes courantes"],
                    outils: [],
                    sauvegardes: ["Sagesse", "Charisme"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Histoire",
                        "Intuition",
                        "Médecine",
                        "Persuasion",
                        "Religion",
                    ],
                },
                magie: { est_lanceur: true, caracteristique: "Sagesse" },
                equipement_depart: [
                    "Masse d'armes",
                    "Cotte de mailles",
                    "Bouclier",
                    "Symbole sacré",
                ],
            },
            {
                nom: "Druide",
                de_vie: 8,
                maitrises: {
                    armures: ["Légères", "Moyennes", "Boucliers (bois)"],
                    armes: [
                        "Gourdin",
                        "Dague",
                        "Fléchette",
                        "Javeline",
                        "Masse",
                        "Bâton",
                        "Cimeterre",
                        "Serpe",
                        "Fronde",
                        "Lance",
                    ],
                    outils: ["Jeu d'herboriste"],
                    sauvegardes: ["Intelligence", "Sagesse"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Arcanes",
                        "Dressage",
                        "Intuition",
                        "Médecine",
                        "Nature",
                        "Perception",
                        "Religion",
                        "Survie",
                    ],
                },
                magie: { est_lanceur: true, caracteristique: "Sagesse" },
                equipement_depart: [
                    "Bouclier en bois",
                    "Cimeterre",
                    "Armure de cuir",
                    "Focaliseur druidique",
                ],
            },
            {
                nom: "Ensorceleur",
                de_vie: 6,
                maitrises: {
                    armures: [],
                    armes: [
                        "Dague",
                        "Fléchette",
                        "Fronde",
                        "Bâton",
                        "Arbalète légère",
                    ],
                    outils: [],
                    sauvegardes: ["Constitution", "Charisme"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Arcanes",
                        "Intimidation",
                        "Intuition",
                        "Persuasion",
                        "Religion",
                        "Tromperie",
                    ],
                },
                magie: { est_lanceur: true, caracteristique: "Charisme" },
                equipement_depart: [
                    "Arbalète légère",
                    "Focaliseur arcanique",
                    "Dague (2)",
                ],
            },
            {
                nom: "Guerrier",
                de_vie: 10,
                maitrises: {
                    armures: ["Toutes les armures", "Boucliers"],
                    armes: ["Armes courantes", "Armes de guerre"],
                    outils: [],
                    sauvegardes: ["Force", "Constitution"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Acrobaties",
                        "Athlétisme",
                        "Histoire",
                        "Intimidation",
                        "Intuition",
                        "Perception",
                        "Survie",
                    ],
                },
                magie: { est_lanceur: false },
                equipement_depart: [
                    "Cotte de mailles",
                    "Épée longue",
                    "Bouclier",
                ],
            },
            {
                nom: "Magicien",
                de_vie: 6,
                maitrises: {
                    armures: [],
                    armes: [
                        "Dague",
                        "Fléchette",
                        "Fronde",
                        "Bâton",
                        "Arbalète légère",
                    ],
                    outils: [],
                    sauvegardes: ["Intelligence", "Sagesse"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Arcanes",
                        "Histoire",
                        "Intuition",
                        "Investigation",
                        "Médecine",
                        "Religion",
                    ],
                },
                magie: { est_lanceur: true, caracteristique: "Intelligence" },
                equipement_depart: ["Bâton", "Grimoire", "Sacoche", "Robe"],
            },
            {
                nom: "Moine",
                de_vie: 8,
                maitrises: {
                    armures: [],
                    armes: ["Armes courantes", "Épée courte"],
                    outils: ["1 type d'outil d'artisan ou instrument"],
                    sauvegardes: ["Force", "Dextérité"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Acrobaties",
                        "Athlétisme",
                        "Discrétion",
                        "Histoire",
                        "Intuition",
                        "Religion",
                    ],
                },
                magie: { est_lanceur: false, caracteristique: "Sagesse" }, // Pour le Ki
                equipement_depart: ["Épée courte", "Dard (10)"],
            },
            {
                nom: "Paladin",
                de_vie: 10,
                maitrises: {
                    armures: ["Toutes les armures", "Boucliers"],
                    armes: ["Armes courantes", "Armes de guerre"],
                    outils: [],
                    sauvegardes: ["Sagesse", "Charisme"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Athlétisme",
                        "Intuition",
                        "Intimidation",
                        "Médecine",
                        "Persuasion",
                        "Religion",
                    ],
                },
                magie: { est_lanceur: true, caracteristique: "Charisme" },
                equipement_depart: [
                    "Arme de guerre",
                    "Bouclier",
                    "Cotte de mailles",
                    "Symbole sacré",
                ],
            },
            {
                nom: "Rôdeur",
                de_vie: 10,
                maitrises: {
                    armures: ["Légères", "Moyennes", "Boucliers"],
                    armes: ["Armes courantes", "Armes de guerre"],
                    outils: [],
                    sauvegardes: ["Force", "Dextérité"],
                },
                choix_competences: {
                    nombre: 3,
                    liste: [
                        "Athlétisme",
                        "Discrétion",
                        "Dresage",
                        "Intuition",
                        "Investigation",
                        "Nature",
                        "Perception",
                        "Survie",
                    ],
                },
                magie: { est_lanceur: true, caracteristique: "Sagesse" },
                equipement_depart: [
                    "Armure d'écailles",
                    "Épées courtes (2)",
                    "Arc long",
                ],
            },
            {
                nom: "Roublard",
                de_vie: 8,
                maitrises: {
                    armures: ["Légères"],
                    armes: [
                        "Armes courantes",
                        "Arbalète de main",
                        "Épée longue",
                        "Rapière",
                        "Épée courte",
                    ],
                    outils: ["Outils de voleur"],
                    sauvegardes: ["Dextérité", "Intelligence"],
                },
                choix_competences: {
                    nombre: 4,
                    liste: [
                        "Acrobaties",
                        "Athlétisme",
                        "Discrétion",
                        "Escamotage",
                        "Intimidation",
                        "Intuition",
                        "Investigation",
                        "Perception",
                        "Persuasion",
                        "Représentation",
                        "Tromperie",
                    ],
                },
                magie: { est_lanceur: false },
                equipement_depart: [
                    "Rapière",
                    "Arc court",
                    "Armure de cuir",
                    "Dagues (2)",
                    "Outils de voleur",
                ],
            },
            {
                nom: "Sorcier",
                de_vie: 8,
                maitrises: {
                    armures: ["Légères"],
                    armes: ["Armes courantes"],
                    outils: [],
                    sauvegardes: ["Sagesse", "Charisme"],
                },
                choix_competences: {
                    nombre: 2,
                    liste: [
                        "Arcanes",
                        "Histoire",
                        "Intimidation",
                        "Investigation",
                        "Nature",
                        "Religion",
                        "Tromperie",
                    ],
                },
                magie: { est_lanceur: true, caracteristique: "Charisme" },
                equipement_depart: [
                    "Arbalète légère",
                    "Focaliseur arcanique",
                    "Armure de cuir",
                    "Dague (2)",
                ],
            },
        ];

        // 4. INSERTION
        await Race.insertMany(races);
        console.log(`✅ ${races.length} Races insérées !`);

        await Classe.insertMany(classes);
        console.log(`✅ ${classes.length} Classes insérées !`);

        process.exit();
    } catch (error) {
        console.error("❌ Erreur seed:", error);
        process.exit(1);
    }
};

seedDB();
