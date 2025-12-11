import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { ICharacter } from "../../types/characterType";
import api from "../../api/axios";
import { useAuth } from "../../contexts/authContext";

export default function CharacterSheet() {
    const [char, setChar] = useState<ICharacter | null>(null);
    const [newItemName, setNewItemName] = useState(""); // Pour l'ajout rapide d'objet
    const { id } = useParams();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!id) return;
        api.get<ICharacter>(`/characters/${id}`)
            .then((res) => setChar(res.data))
            .catch((err) => console.log(err.message));
    }, [id]);

    // --- GESTION DES SORTS ---
    const updateSpellSlot = async (levelKey: string, change: number) => {
        if (!char || !char.magie) return;

        const currentLevel = (char.magie.emplacements as any)[levelKey];
        const newVal = Math.min(
            currentLevel.max,
            Math.max(0, currentLevel.actuel + change)
        );

        if (newVal === currentLevel.actuel) return;

        const updatedChar = {
            ...char,
            magie: {
                ...char.magie,
                emplacements: {
                    ...char.magie.emplacements,
                    [levelKey]: { ...currentLevel, actuel: newVal },
                },
            },
        };
        setChar(updatedChar);

        try {
            await api.patch(`/characters/${char._id}`, {
                magie: updatedChar.magie,
            });
        } catch (error) {
            console.error("Erreur maj sorts", error);
        }
    };

    // --- GESTION DE L'OR ---
    const updateGold = async (newVal: string) => {
        if (!char) return;
        const val = parseInt(newVal) || 0;

        const updatedChar = {
            ...char,
            inventaire: {
                ...char.inventaire,
                pieces: { ...char.inventaire.pieces, po: val },
            },
        };
        setChar(updatedChar);

        try {
            await api.patch(`/characters/${char._id}`, {
                inventaire: updatedChar.inventaire,
            });
        } catch (error) {
            console.error("Erreur sauvegarde or", error);
        }
    };

    // --- GESTION DE L'INVENTAIRE ---
    const addItem = async () => {
        if (!char || !newItemName.trim()) return;

        const newItem = { nom: newItemName, quantite: 1, equipe: false };
        const newEquipement = [...char.inventaire.equipement, newItem];

        const updatedChar = {
            ...char,
            inventaire: { ...char.inventaire, equipement: newEquipement },
        };

        setChar(updatedChar);
        setNewItemName(""); // On vide le champ

        try {
            await api.patch(`/characters/${char._id}`, {
                inventaire: updatedChar.inventaire,
            });
        } catch (error) {
            console.error("Erreur ajout item", error);
        }
    };

    const removeItem = async (indexToRemove: number) => {
        if (!char) return;

        const newEquipement = char.inventaire.equipement.filter(
            (_, idx) => idx !== indexToRemove
        );

        const updatedChar = {
            ...char,
            inventaire: { ...char.inventaire, equipement: newEquipement },
        };

        setChar(updatedChar);

        try {
            await api.patch(`/characters/${char._id}`, {
                inventaire: updatedChar.inventaire,
            });
        } catch (error) {
            console.error("Erreur suppression item", error);
        }
    };

    // --- GESTION DES PV ---
    const adjustPV = async (amount: number) => {
        if (!char) return;
        const newPv = Math.min(
            char.stats.pv_max,
            Math.max(0, char.stats.pv_actuel + amount)
        );
        const updatedChar = {
            ...char,
            stats: { ...char.stats, pv_actuel: newPv },
        };
        setChar(updatedChar);

        try {
            await api.patch(`/characters/${char._id}`, {
                stats: updatedChar.stats,
            });
        } catch (error) {
            console.error("Erreur pv", error);
        }
    };

    if (!char)
        return (
            <div className="p-10 text-white animate-pulse">Invocation...</div>
        );

    const getMod = (val: number) => Math.floor((val - 10) / 2);
    const formatMod = (val: number) => {
        const mod = getMod(val);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans pb-20">
            {/* NAVIGATION */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20 shadow-md flex justify-between items-center">
                <Link
                    to="/"
                    className="text-slate-400 hover:text-amber-500 transition-colors font-bold text-sm flex items-center gap-2"
                >
                    <span>←</span> Retour
                </Link>
                <span className="text-slate-500 text-xs font-mono">
                    {char.nom}
                </span>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
                {/* 1. EN-TÊTE */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-full bg-slate-700 border-2 border-amber-500/50 flex items-center justify-center text-2xl">
                            🧙‍♂️
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white font-serif tracking-tight mb-1">
                                {char.nom}
                            </h1>
                            <p className="text-amber-500 font-medium">
                                Niveau {char.niveau} • {char.race} •{" "}
                                {char.classe}
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-4 grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center text-center">
                            <span className="text-xs uppercase text-slate-500 font-bold mb-1">
                                Inspiration
                            </span>
                            <div
                                className={`w-8 h-8 rounded-full border-2 ${
                                    char.stats.inspiration
                                        ? "bg-amber-500 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                        : "bg-slate-900 border-slate-600"
                                }`}
                            ></div>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center text-center">
                            <span className="text-xs uppercase text-slate-500 font-bold mb-1">
                                P. Passive
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {char.stats.perception_passive}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. CARACTÉRISTIQUES */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                        { label: "Force", val: char.caracteristiques.force },
                        {
                            label: "Dextérité",
                            val: char.caracteristiques.dexterite,
                        },
                        {
                            label: "Constitution",
                            val: char.caracteristiques.constitution,
                        },
                        {
                            label: "Intelligence",
                            val: char.caracteristiques.intelligence,
                        },
                        {
                            label: "Sagesse",
                            val: char.caracteristiques.sagesse,
                        },
                        {
                            label: "Charisme",
                            val: char.caracteristiques.charisme,
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-slate-900 rounded p-2 border border-slate-800 text-center relative group"
                        >
                            <span className="text-[10px] uppercase font-bold text-slate-500">
                                {stat.label.slice(0, 3)}
                            </span>
                            <div className="text-xl font-bold text-white">
                                {formatMod(stat.val)}
                            </div>
                            <div className="text-xs text-slate-600 bg-slate-950 inline-block px-2 rounded-full mt-1 border border-slate-800">
                                {stat.val}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. COMBAT (Vie & Or) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 bg-slate-800 rounded-xl p-4 border border-slate-700 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between items-end mb-2 relative z-10">
                            <span className="text-sm font-bold text-slate-400 uppercase">
                                Points de Vie
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {char.stats.pv_actuel}{" "}
                                <span className="text-slate-500 text-lg">
                                    / {char.stats.pv_max}
                                </span>
                            </span>
                        </div>

                        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-700 relative z-10 mb-4">
                            <div
                                className="h-full bg-gradient-to-r from-green-600 to-emerald-500 transition-all duration-500 ease-out"
                                style={{
                                    width: `${
                                        (char.stats.pv_actuel /
                                            char.stats.pv_max) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                        {isAuthenticated && (
                            <>
                                <div className="grid grid-cols-4 gap-2 relative z-10">
                                    <button
                                        onClick={() => adjustPV(-1)}
                                        className="bg-red-900/30 hover:bg-red-500/20 text-red-500 border border-red-900 rounded py-1 font-bold text-xs transition-colors"
                                    >
                                        -1
                                    </button>
                                    <button
                                        onClick={() => adjustPV(-5)}
                                        className="bg-red-900/50 hover:bg-red-500 hover:text-white text-red-400 border border-red-800 rounded py-1 font-bold text-xs transition-colors"
                                    >
                                        -5
                                    </button>
                                    <button
                                        onClick={() => adjustPV(1)}
                                        className="bg-green-900/30 hover:bg-green-500/20 text-green-500 border border-green-900 rounded py-1 font-bold text-xs transition-colors"
                                    >
                                        +1
                                    </button>
                                    <button
                                        onClick={() => adjustPV(5)}
                                        className="bg-green-900/50 hover:bg-green-500 hover:text-white text-green-400 border border-green-800 rounded py-1 font-bold text-xs transition-colors"
                                    >
                                        +5
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-slate-800 rounded-xl p-2 border border-slate-700 flex justify-around items-center">
                        <div className="text-center">
                            <span className="block text-[10px] uppercase text-slate-500 font-bold">
                                CA
                            </span>
                            <span className="text-2xl font-bold text-blue-400">
                                🛡️ {char.stats.ca}
                            </span>
                        </div>
                        <div className="w-px h-10 bg-slate-700"></div>
                        <div className="text-center">
                            <span className="block text-[10px] uppercase text-slate-500 font-bold">
                                Init
                            </span>
                            <span className="text-2xl font-bold text-yellow-500">
                                {char.stats.init >= 0
                                    ? `+${char.stats.init}`
                                    : char.stats.init}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 flex flex-col justify-center gap-2 group hover:border-amber-500/50 transition-colors">
                        <div className="text-center text-xs text-slate-500 uppercase font-bold">
                            Fortune
                        </div>
                        <div className="flex items-center justify-center gap-1">
                            {isAuthenticated && (
                                <input
                                    type="number"
                                    className="w-20 bg-transparent text-center text-xl text-yellow-500 font-bold focus:outline-none border-b border-transparent focus:border-yellow-500"
                                    defaultValue={char.inventaire.pieces.po}
                                    onBlur={(e) => updateGold(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        e.currentTarget.blur()
                                    }
                                />
                            )}
                            <span className="text-yellow-600 font-bold">
                               {char.inventaire.pieces.po} PO
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. ACTIONS, GRIMOIRE & INVENTAIRE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLONNE GAUCHE: ACTIONS + GRIMOIRE */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="space-y-3">
                            <h3 className="text-amber-500 font-bold uppercase text-xs border-b border-slate-700 pb-2">
                                Attaques
                            </h3>
                            {char.actions.length === 0 && (
                                <p className="text-slate-600 italic text-sm">
                                    Aucune attaque connue.
                                </p>
                            )}
                            {char.actions.map((action, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-800 border border-slate-700 p-3 rounded flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-bold text-slate-200">
                                            {action.nom}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {action.type_degats}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-amber-500">
                                            +{action.bonus_attaque}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {action.degats}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Grimoire */}
                        {char.magie && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                    <h3 className="text-amber-500 font-bold uppercase text-xs">
                                        Grimoire
                                    </h3>
                                    <div className="flex gap-3 text-[10px] font-bold text-slate-400">
                                        <span>
                                            DD:{" "}
                                            <span className="text-purple-400">
                                                {char.magie.dd_sauvegarde}
                                            </span>
                                        </span>
                                        <span>
                                            HIT:{" "}
                                            <span className="text-purple-400">
                                                +{char.magie.bonus_attaque_sort}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-800 border border-slate-700 p-3 rounded">
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600">
                                        {Object.entries(
                                            char.magie.emplacements
                                        ).map(([key, val]: [string, any]) => {
                                            if (val.max === 0) return null;
                                            const lvl = key.split("_")[1];
                                            return (
                                                <div
                                                    key={key}
                                                    className="min-w-[50px] text-center flex flex-col items-center gap-1 bg-slate-900/50 p-1 rounded border border-slate-700/50"
                                                >
                                                    <span className="text-[9px] uppercase text-slate-500 font-bold">
                                                        Niv {lvl}
                                                    </span>
                                                    <div className="flex flex-wrap justify-center gap-1 max-w-[60px]">
                                                        {Array.from({
                                                            length: val.max,
                                                        }).map((_, i) => {
                                                            const isAvailable =
                                                                i < val.actuel;
                                                            return (
                                                                <button
                                                                    key={i}
                                                                    onClick={() =>
                                                                        updateSpellSlot(
                                                                            key,
                                                                            isAvailable
                                                                                ? -1
                                                                                : 1
                                                                        )
                                                                    }
                                                                    className={`w-3 h-3 rounded-full border transition-all duration-200 ${
                                                                        isAvailable
                                                                            ? "bg-purple-500 border-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.8)] hover:bg-purple-600"
                                                                            : "bg-slate-900 border-slate-600 hover:border-purple-500"
                                                                    }`}
                                                                    title={
                                                                        isAvailable
                                                                            ? "Utiliser"
                                                                            : "Récupérer"
                                                                    }
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {char.magie.sorts_prepares.map(
                                        (sort, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-slate-800 border border-slate-700 p-2 px-3 rounded flex justify-between items-center text-sm border-l-2 border-l-purple-500"
                                            >
                                                <span className="text-slate-200 font-medium">
                                                    {sort.nom}
                                                </span>
                                                {sort.domaine && (
                                                    <span className="text-[10px] uppercase text-amber-500 font-bold">
                                                        Domaine
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COLONNE DROITE: INVENTAIRE ÉDITABLE */}
                    <div className="space-y-3">
                        <h3 className="text-amber-500 font-bold uppercase text-xs border-b border-slate-700 pb-2">
                            Inventaire
                        </h3>

                        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 space-y-2">
                            {/* Liste des items */}
                            {char.inventaire.equipement.length === 0 && (
                                <p className="text-slate-600 italic text-sm text-center py-2">
                                    Sac vide.
                                </p>
                            )}

                            {char.inventaire.equipement.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700/50 text-sm group"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 font-mono text-xs">
                                            x{item.quantite}
                                        </span>
                                        <span className="text-slate-300">
                                            {item.nom}
                                        </span>
                                        {item.equipe && (
                                            <span
                                                className="text-[10px]"
                                                title="Équipé"
                                            >
                                                🛡️
                                            </span>
                                        )}
                                    </div>
                                    {isAuthenticated && (
                                        <button
                                            onClick={() => removeItem(idx)}
                                            className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                                            title="Jeter"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Ajout rapide */}
                            {isAuthenticated && (
                                <div className="mt-4 pt-2 border-t border-slate-700 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nouvel objet..."
                                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white flex-grow focus:outline-none focus:border-amber-500"
                                        value={newItemName}
                                        onChange={(e) =>
                                            setNewItemName(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && addItem()
                                        }
                                    />
                                    )
                                    <button
                                        onClick={addItem}
                                        className="bg-slate-700 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
