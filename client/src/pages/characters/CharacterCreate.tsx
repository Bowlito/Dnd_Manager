import { useEffect, useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import type { ICharacter } from "../../types/characterType";
import type { IOption } from "../../types/optionType";

// --- IMPORTS UI ---
import { Button } from "../../components/ui/Button";

// --- IMPORTS SECTIONS DE FORMULAIRE ---

import { IdentitySection } from "../../components/Forms/character-form/IdentitySection";
import { ActionsManager } from "../../components/Forms/character-form/ActionManager";
import { AttributesSection } from "../../components/Forms/character-form/AttributeSection";
import { CombatStatsSection } from "../../components/Forms/character-form/CombatStatsSection";
import { InventoryManager } from "../../components/Forms/character-form/InventoryManager";

export default function CharacterCreate() {
    const navigate = useNavigate();
    const [races, setRaces] = useState<IOption[]>([]);
    const [classes, setClasses] = useState<IOption[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Initialisation du formulaire avec valeurs par défaut
    const methods = useForm<ICharacter>({
        defaultValues: {
            niveau: 1,
            stats: {
                ca: 10,
                pv_max: 10,
                pv_actuel: 10,
                init: 0,
                vitesse: 9,
                perception_passive: 10,
                inspiration: false,
                des_vie: { total: 1, face: 8, disponibles: 1 },
                contre_la_mort: { succes: 0, echecs: 0 },
            },
            caracteristiques: {
                force: 10,
                dexterite: 10,
                constitution: 10,
                intelligence: 10,
                sagesse: 10,
                charisme: 10,
            },
            maitrises: {
                bonus: 2,
                sauvegardes: [],
                competences: [],
                armures: [],
                armes: [],
                outils: [],
                langues: [],
            },
            inventaire: {
                pieces: { pc: 0, pa: 0, pe: 0, po: 0, pp: 0 },
                equipement: [],
            },
            traits: [],
            actions: [],
        },
    });

    // 2. Chargement des options (Race/Classe) au montage
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [racesRes, classesRes] = await Promise.all([
                    api.get<IOption[]>("/options/races"),
                    api.get<IOption[]>("/options/classes"),
                ]);
                setRaces(racesRes.data);
                setClasses(classesRes.data);
            } catch (err) {
                console.error("Erreur chargement options:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, []);

    // 3. Gestion de la soumission
    const createCharacter: SubmitHandler<ICharacter> = async (data) => {
        try {
            // Transformation des données (le HTML renvoie parfois des strings pour les nombres)
            const payload = {
                ...data,
                niveau: Number(data.niveau),
                caracteristiques: {
                    force: Number(data.caracteristiques.force),
                    dexterite: Number(data.caracteristiques.dexterite),
                    constitution: Number(data.caracteristiques.constitution),
                    intelligence: Number(data.caracteristiques.intelligence),
                    sagesse: Number(data.caracteristiques.sagesse),
                    charisme: Number(data.caracteristiques.charisme),
                },
                stats: {
                    ...data.stats,
                    pv_max: Number(data.stats.pv_max),
                    pv_actuel: Number(data.stats.pv_max), // On commence full vie
                    ca: Number(data.stats.ca),
                    vitesse: Number(data.stats.vitesse),
                    init: Number(data.stats.init),
                },
                inventaire: {
                    ...data.inventaire,
                    pieces: {
                        po: Number(data.inventaire.pieces.po),
                        pa: 0,
                        pc: 0,
                        pe: 0,
                        pp: 0, // On ignore les autres pièces pour l'instant
                    },
                },
            };

            console.log("Envoi au serveur :", payload);
            await api.post("/characters", payload);

            methods.reset(); // Nettoie le formulaire
            navigate("/"); // Redirige vers l'accueil
        } catch (error) {
            console.error("Erreur création :", error);
            alert(
                "Erreur lors de la création du personnage (vérifie la console)"
            );
        }
    };

    if (loading)
        return (
            <div className="p-10 text-white animate-pulse">
                Chargement du grimoire...
            </div>
        );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 pb-20">
            {/* --- EN-TÊTE FIXE --- */}
            <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800 sticky top-2 z-20 backdrop-blur shadow-lg">
                <Link
                    to="/"
                    className="text-slate-400 hover:text-amber-500 transition-colors font-bold flex items-center gap-2 text-sm uppercase tracking-wide"
                >
                    <span>←</span> Annuler
                </Link>
                <h1 className="text-xl font-bold text-slate-100 hidden sm:block font-serif tracking-wider">
                    Nouvel Aventurier
                </h1>

                <Button
                    onClick={methods.handleSubmit(createCharacter)}
                    variant="primary"
                    isLoading={methods.formState.isSubmitting}
                >
                    Enregistrer
                </Button>
            </div>

            {/* --- FORMULAIRE MODULAIRE --- */}
            {/* Le FormProvider rend "register" et "control" accessibles aux composants enfants */}
            <FormProvider {...methods}>
                <form
                    className="max-w-6xl mx-auto space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                >
                    {/* 1. Identité (Nom, Race, Classe...) */}
                    <IdentitySection races={races} classes={classes} />

                    {/* 2. Caractéristiques (Force, Dex...) */}
                    <AttributesSection />

                    {/* 3. Grille Principale (Combat / Inventaire / Actions) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne Gauche : Stats & Sac à dos */}
                        <div className="space-y-6">
                            <CombatStatsSection />
                            <InventoryManager />
                        </div>

                        {/* Colonne Droite : Attaques */}
                        <ActionsManager />
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
