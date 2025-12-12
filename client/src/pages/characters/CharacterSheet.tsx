import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import type { ICharacter } from "../../types/characterType";
import { useAuth } from "../../contexts/authContext";
// 👇 On réintègre ton composant
import { Button } from "../../components/ui/Button";

export default function CharacterSheet() {
    const [char, setChar] = useState<ICharacter | null>(null);
    const [newItemName, setNewItemName] = useState("");
    const { id } = useParams();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!id) return;
        api.get<ICharacter>(`/characters/${id}`)
            .then((res) => setChar(res.data))
            .catch((err) => console.log(err.message));
    }, [id]);

    // --- LOGIQUE MÉTIER (Identique) ---

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
        } catch (e) {
            console.error(e);
        }
    };

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
        } catch (e) {
            console.error(e);
        }
    };

    const addItem = async () => {
        if (!char || !newItemName.trim()) return;
        const newItem = { nom: newItemName, quantite: 1, equipe: false };
        const updatedChar = {
            ...char,
            inventaire: {
                ...char.inventaire,
                equipement: [...char.inventaire.equipement, newItem],
            },
        };
        setChar(updatedChar);
        setNewItemName("");
        try {
            await api.patch(`/characters/${char._id}`, {
                inventaire: updatedChar.inventaire,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const removeItem = async (indexToRemove: number) => {
        if (!char) return;
        const updatedChar = {
            ...char,
            inventaire: {
                ...char.inventaire,
                equipement: char.inventaire.equipement.filter(
                    (_, idx) => idx !== indexToRemove
                ),
            },
        };
        setChar(updatedChar);
        try {
            await api.patch(`/characters/${char._id}`, {
                inventaire: updatedChar.inventaire,
            });
        } catch (e) {
            console.error(e);
        }
    };

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
        } catch (e) {
            console.error(e);
        }
    };

    if (!char)
        return (
            <div className="p-10 text-white animate-pulse">
                Invocation du Héros...
            </div>
        );

    const getMod = (val: number) => Math.floor((val - 10) / 2);
    const formatMod = (val: number) => {
        const mod = getMod(val);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    const pvPercent = (char.stats.pv_actuel / char.stats.pv_max) * 100;
    const barColor =
        pvPercent < 30
            ? "bg-red-600"
            : pvPercent < 60
            ? "bg-amber-500"
            : "bg-green-600";

    return (
        <div className="min-h-screen pb-20 space-y-6 text-slate-200">
            {/* NAVIGATION */}
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <Link
                    to="/playerdex"
                    className="text-slate-400 hover:text-amber-500 font-bold text-sm flex items-center gap-2 transition-colors"
                >
                    <span>←</span> Retour PlayerDex
                </Link>
                <div className="text-xs font-mono text-slate-600">
                    ID: {char._id.slice(-6)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* === COLONNE GAUCHE === */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl grayscale">
                            🧙‍♂️
                        </div>
                        <h1 className="text-4xl font-extrabold text-white font-serif tracking-tight mb-2">
                            {char.nom}
                        </h1>
                        <p className="text-xl text-amber-500 font-medium mb-4">
                            Niveau {char.niveau} • {char.race} • {char.classe}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {char.historique && (
                                <span className="bg-slate-950 px-3 py-1 rounded text-xs font-bold text-slate-400 border border-slate-700">
                                    {char.historique}
                                </span>
                            )}
                            {char.alignement && (
                                <span className="bg-slate-950 px-3 py-1 rounded text-xs font-bold text-slate-400 border border-slate-700">
                                    {char.alignement}
                                </span>
                            )}
                        </div>
                    </div>

                    {char.details && (
                        <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                            <div className="bg-slate-950/50 p-3 border-b border-slate-800">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    L'Âme du Héros
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {char.details.personnalite && (
                                    <div>
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">
                                            Personnalité
                                        </span>
                                        <p className="text-sm text-slate-300 italic">
                                            "{char.details.personnalite}"
                                        </p>
                                    </div>
                                )}
                                {char.details.ideaux && (
                                    <div>
                                        <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">
                                            Idéaux
                                        </span>
                                        <p className="text-sm text-slate-300">
                                            {char.details.ideaux}
                                        </p>
                                    </div>
                                )}
                                {char.details.liens && (
                                    <div>
                                        <span className="text-[10px] font-bold text-green-400 uppercase block mb-1">
                                            Liens
                                        </span>
                                        <p className="text-sm text-slate-300">
                                            {char.details.liens}
                                        </p>
                                    </div>
                                )}
                                {char.details.defauts && (
                                    <div>
                                        <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">
                                            Défauts
                                        </span>
                                        <p className="text-sm text-slate-300">
                                            {char.details.defauts}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                        <h3 className="text-sm font-bold text-amber-500 mb-3 border-b border-slate-600 pb-2">
                            Traits & Capacités
                        </h3>
                        <div className="space-y-3">
                            {char.traits.map((trait, idx) => (
                                <div key={idx} className="text-sm group">
                                    <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                                        {trait.nom}
                                    </span>
                                    <span className="text-slate-500 text-xs ml-2">
                                        ({trait.source})
                                    </span>
                                    <p className="text-slate-400 text-xs mt-1 pl-2 border-l border-slate-600">
                                        {trait.desc}
                                    </p>
                                </div>
                            ))}
                            {char.traits.length === 0 && (
                                <p className="text-slate-500 italic text-xs">
                                    Aucun trait.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* === COLONNE DROITE === */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#1e293b] border-2 border-slate-600 rounded-lg shadow-xl overflow-hidden p-6">
                        <div className="flex justify-around items-center mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">
                                    🛡️ {char.stats.ca}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">
                                    Armure
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">
                                    🦶 {char.stats.vitesse}m
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">
                                    Vitesse
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-amber-500">
                                    ⚡{" "}
                                    {char.stats.init >= 0
                                        ? `+${char.stats.init}`
                                        : char.stats.init}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">
                                    Initiative
                                </div>
                            </div>
                            <div className="text-center flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full border-2 mb-1 ${
                                        char.stats.inspiration
                                            ? "bg-amber-500 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                            : "bg-slate-900 border-slate-600"
                                    }`}
                                ></div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">
                                    Inspi
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded border border-slate-700 mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-slate-400 text-xs uppercase">
                                    Points de Vie
                                </span>
                                <span className="font-bold text-white text-lg">
                                    {char.stats.pv_actuel}{" "}
                                    <span className="text-slate-500 text-sm">
                                        / {char.stats.pv_max}
                                    </span>
                                </span>
                            </div>
                            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-600 mb-3 relative">
                                <div
                                    className={`h-full transition-all duration-300 ${barColor}`}
                                    style={{ width: `${pvPercent}%` }}
                                ></div>
                            </div>

                            {/* 👇 BOUTONS PV : On utilise <Button> avec des styles forcés pour la forme carrée */}
                            {isAuthenticated && (
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="secondary"
                                        className="w-8 h-8 p-0 border-slate-600 hover:bg-red-500 hover:text-white"
                                        onClick={() => adjustPV(-1)}
                                    >
                                        -1
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-8 h-8 p-0 border-slate-600 hover:bg-red-600 hover:text-white"
                                        onClick={() => adjustPV(-5)}
                                    >
                                        -5
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-8 h-8 p-0 border-slate-600 hover:bg-green-500 hover:text-white"
                                        onClick={() => adjustPV(1)}
                                    >
                                        +1
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-8 h-8 p-0 border-slate-600 hover:bg-green-600 hover:text-white"
                                        onClick={() => adjustPV(5)}
                                    >
                                        +5
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-6 gap-2 text-center bg-slate-900 p-3 rounded-lg border border-slate-800">
                            {[
                                { l: "FOR", v: char.caracteristiques.force },
                                {
                                    l: "DEX",
                                    v: char.caracteristiques.dexterite,
                                },
                                {
                                    l: "CON",
                                    v: char.caracteristiques.constitution,
                                },
                                {
                                    l: "INT",
                                    v: char.caracteristiques.intelligence,
                                },
                                { l: "SAG", v: char.caracteristiques.sagesse },
                                { l: "CHA", v: char.caracteristiques.charisme },
                            ].map((s) => (
                                <div
                                    key={s.l}
                                    className="flex flex-col group cursor-help"
                                    title={`Score: ${s.v}`}
                                >
                                    <span className="text-[10px] font-bold text-slate-500 mb-1">
                                        {s.l}
                                    </span>
                                    <span className="font-bold text-white text-lg group-hover:text-amber-500 transition-colors">
                                        {formatMod(s.v)}
                                    </span>
                                    <span className="text-[9px] text-slate-600">
                                        {s.v}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                        <h3 className="text-sm font-bold text-red-400 mb-3 border-b border-slate-600 pb-2 uppercase flex items-center gap-2">
                            <span>⚔️</span> Attaques
                        </h3>
                        <div className="space-y-2">
                            {char.actions.length === 0 && (
                                <p className="text-slate-500 italic text-sm">
                                    Aucune attaque.
                                </p>
                            )}
                            {char.actions.map((action, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-900/50 p-2 px-3 rounded flex justify-between items-center text-sm border border-slate-700 hover:border-red-500/30 transition-colors"
                                >
                                    <div>
                                        <div className="font-bold text-slate-200">
                                            {action.nom}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
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
                    </div>

                    {char.magie && (
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                            <div className="flex justify-between items-center border-b border-slate-600 pb-2 mb-3">
                                <h3 className="text-sm font-bold text-purple-400 uppercase flex items-center gap-2">
                                    <span>✨</span> Grimoire
                                </h3>
                                <div className="flex gap-3 text-[10px] font-bold text-slate-400">
                                    <span>
                                        DD:{" "}
                                        <span className="text-white">
                                            {char.magie.dd_sauvegarde}
                                        </span>
                                    </span>
                                    <span>
                                        HIT:{" "}
                                        <span className="text-white">
                                            +{char.magie.bonus_attaque_sort}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-thin scrollbar-thumb-slate-600">
                                {Object.entries(char.magie.emplacements).map(
                                    ([key, val]: [string, any]) => {
                                        if (val.max === 0) return null;
                                        const lvl = key.split("_")[1];
                                        return (
                                            <div
                                                key={key}
                                                className="min-w-[50px] text-center flex flex-col items-center gap-1 bg-slate-900 p-1.5 rounded border border-slate-700"
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
                                                        // Ici, comme ce sont des micro-ronds, on garde button natif ou on fait un composant custom "SpellSlot" plus tard
                                                        // Pour l'instant je laisse le natif pour ne pas casser le layout très spécifique
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
                                                                        : "bg-slate-950 border-slate-600 hover:border-purple-500"
                                                                }`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {char.magie.sorts_prepares.map((sort, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-slate-900/50 border border-slate-700 p-2 rounded flex justify-between items-center text-xs border-l-2 border-l-purple-500"
                                    >
                                        <span className="text-slate-300 font-medium">
                                            {sort.nom}
                                        </span>
                                        <span className="text-[10px] text-slate-600 bg-slate-900 px-1 rounded">
                                            Niv {sort.niveau}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                        <div className="flex justify-between items-center border-b border-slate-600 pb-2 mb-3">
                            <h3 className="text-sm font-bold text-green-400 uppercase flex items-center gap-2">
                                <span>🎒</span> Inventaire
                            </h3>
                            <div className="flex items-center bg-slate-900 px-2 py-1 rounded border border-slate-700">
                                <span className="text-yellow-500 mr-1 text-xs">
                                    🪙
                                </span>
                                <input
                                    type="number"
                                    className="w-16 bg-transparent text-right text-sm font-bold text-white focus:outline-none"
                                    defaultValue={char.inventaire.pieces.po}
                                    onBlur={(e) => updateGold(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        e.currentTarget.blur()
                                    }
                                />
                                <span className="text-xs text-slate-500 ml-1 font-bold">
                                    PO
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {char.inventaire.equipement.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700/50 text-sm group hover:bg-slate-700/30 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 font-mono text-xs bg-slate-950 px-1 rounded">
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
                                    {/* 👇 BOUTON ICONE SUPPRESSION */}
                                    {isAuthenticated && (
                                        <Button
                                            variant="icon"
                                            onClick={() => removeItem(idx)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {isAuthenticated && (
                                <div className="flex gap-2 mt-3 pt-2 border-t border-slate-700/50">
                                    <input
                                        type="text"
                                        placeholder="Ajouter un objet..."
                                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white flex-grow focus:outline-none focus:border-green-500"
                                        value={newItemName}
                                        onChange={(e) =>
                                            setNewItemName(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && addItem()
                                        }
                                    />
                                    {/* 👇 BOUTON AJOUT STANDARD */}
                                    <Button
                                        variant="secondary"
                                        className="px-3 py-1 text-xs h-auto"
                                        onClick={addItem}
                                    >
                                        +
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
