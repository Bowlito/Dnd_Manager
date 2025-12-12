import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { ICharacter, IMonster, INpc } from "../types";

// UI Components
import { PageHeader } from "../components/ui/PageHeader";
import { EntityCard } from "../components/ui/EntityCard";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/authContext";

// Union type élargi
type Combatant = ICharacter | IMonster | INpc;

export default function Dashboard() {
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCombatStarted, setIsCombatStarted] = useState(false);

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // --- TYPE GUARDS & HELPERS ---

    const isCharacter = (e: Combatant): e is ICharacter =>
        (e as ICharacter).classe !== undefined;
    const isNpc = (e: Combatant): e is INpc =>
        (e as INpc).occupation !== undefined;
    // Si ce n'est ni un perso ni un PNJ, c'est un monstre

    // Helper pour savoir sur quelle route API taper
    const getEndpoint = (e: Combatant) => {
        if (isCharacter(e)) return "characters";
        if (isNpc(e)) return "npcs";
        return "monsters";
    };

    const getVariant = (entity: Combatant) => {
        if (isCharacter(entity)) {
            const cls = entity.classe.toLowerCase();
            if (cls.includes("guerrier") || cls.includes("barbare"))
                return "red";
            if (cls.includes("magicien") || cls.includes("sorcier"))
                return "blue";
            if (cls.includes("voleur") || cls.includes("rôdeur"))
                return "green";
            if (cls.includes("clerc") || cls.includes("paladin"))
                return "amber";
            return "slate";
        }
        if (isNpc(entity)) {
            return "slate"; // Les PNJ en gris/neutre (ou indigo si tu préfères)
        }
        // Monstres
        const type = (entity as IMonster).type.toLowerCase();
        if (type.includes("dragon") || type.includes("démon")) return "red";
        if (type.includes("bête")) return "green";
        return "slate";
    };

    // --- CHARGEMENT ---

    useEffect(() => {
        const fetchData = async () => {
            try {
                // On charge les 3 sources
                const [charsRes, monstersRes, npcsRes] = await Promise.all([
                    api.get<ICharacter[]>("/characters"),
                    api.get<IMonster[]>("/monsters"),
                    api.get<INpc[]>("/npcs"),
                ]);

                // On filtre les actifs
                const activeChars = charsRes.data.filter((c) => c.est_actif);
                const activeMonsters = monstersRes.data.filter(
                    (m) => m.est_actif
                );
                const activeNpcs = npcsRes.data.filter((n) => n.est_actif);

                const all = [...activeChars, ...activeNpcs, ...activeMonsters];
                setCombatants(all);

                // Détection auto du combat
                const ongoingCombat = all.some((c) => c.initiative > 0);
                if (ongoingCombat) setIsCombatStarted(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- ACTIONS ---

    const updateInitiative = async (entity: Combatant, newVal: string) => {
        const val = parseInt(newVal) || 0;
        setCombatants((prev) =>
            prev.map((c) =>
                c._id === entity._id ? { ...c, initiative: val } : c
            )
        );
        try {
            await api.patch(`/${getEndpoint(entity)}/${entity._id}`, {
                initiative: val,
            });
        } catch (error) {
            console.error("Erreur save init", error);
        }
    };

    const updateHealth = async (entity: Combatant, amount: number) => {
        let newPv = 0;
        let maxPv = 0;

        // Calcul générique (fonctionne pour les 3 types si la structure est respectée)
        if (isCharacter(entity)) {
            const current = entity.stats.pv_actuel;
            maxPv = entity.stats.pv_max;
            newPv = Math.min(maxPv, Math.max(0, current + amount));
        } else {
            // NPC et Monstres ont la même structure "pv" / "pv_max" à la racine
            const current = (entity as any).pv;
            maxPv = (entity as any).pv_max;
            newPv = Math.min(maxPv, Math.max(0, current + amount));
        }

        // Optimistic UI
        setCombatants((prev) =>
            prev.map((c) => {
                if (c._id !== entity._id) return c;

                if (isCharacter(c)) {
                    return { ...c, stats: { ...c.stats, pv_actuel: newPv } };
                } else {
                    // NPC ou Monstre
                    return { ...c, pv: newPv };
                }
            })
        );

        // API
        try {
            if (isCharacter(entity)) {
                const updatedStats = { ...entity.stats, pv_actuel: newPv };
                await api.patch(`/characters/${entity._id}`, {
                    stats: updatedStats,
                });
            } else {
                // Fonctionne pour /monsters et /npcs
                await api.patch(`/${getEndpoint(entity)}/${entity._id}`, {
                    pv: newPv,
                });
            }
        } catch (error) {
            console.error("Erreur sauvegarde PV", error);
        }
    };

    const removeFromCombat = async (entity: Combatant, e: React.MouseEvent) => {
        e.stopPropagation();
        setCombatants((prev) => prev.filter((c) => c._id !== entity._id));
        try {
            const endpoint = getEndpoint(entity);
            if (endpoint === "monsters") {
                // Les monstres (clones) sont supprimés
                await api.delete(`/monsters/${entity._id}`);
            } else {
                // Héros et PNJ sont juste désactivés
                await api.patch(`/${endpoint}/${entity._id}`, {
                    est_actif: false,
                });
            }
        } catch (error) {
            console.error("Erreur retrait combat", error);
        }
    };

    // --- START / STOP ---

    const startCombat = () => setIsCombatStarted(true);

    const stopCombat = async () => {
        if (!window.confirm("Arrêter le combat ? Initiatives -> 0")) return;
        setIsCombatStarted(false);
        setCombatants((prev) => prev.map((c) => ({ ...c, initiative: 0 })));
        try {
            const promises = combatants.map((c) =>
                api.patch(`/${getEndpoint(c)}/${c._id}`, { initiative: 0 })
            );
            await Promise.all(promises);
        } catch (error) {
            console.error("Erreur reset combat", error);
        }
    };

    // --- RENDER ---

    const timeline = [...combatants].sort(
        (a, b) => b.initiative - a.initiative
    );

    // Séparation en 3 groupes
    const heroes = combatants.filter(isCharacter);
    const npcs = combatants.filter(isNpc);
    const monsters = combatants.filter((c) => !isCharacter(c) && !isNpc(c));

    if (loading)
        return <div className="text-white p-10">Chargement de la scène...</div>;

    return (
        <div className="space-y-8 pb-20">
            <PageHeader
                title="Table de Jeu"
                subtitle={
                    isCombatStarted
                        ? "⚔️ Combat en cours"
                        : "Exploration / Social"
                }
                action={
                    isAuthenticated && (
                        <div className="flex gap-2 items-center">
                            {combatants.length > 0 &&
                                (!isCombatStarted ? (
                                    <Button
                                        variant="primary"
                                        className="mr-4 bg-green-600 hover:bg-green-500 text-white"
                                        onClick={startCombat}
                                    >
                                        ⚔️ Démarrer Combat
                                    </Button>
                                ) : (
                                    <Button
                                        variant="danger"
                                        className="mr-4"
                                        onClick={stopCombat}
                                    >
                                        🛑 Finir Combat
                                    </Button>
                                ))}
                            <Button
                                variant="secondary"
                                className="text-xs"
                                onClick={() => navigate("/playerdex")}
                            >
                                + Héros
                            </Button>
                            <Button
                                variant="secondary"
                                className="text-xs"
                                onClick={() => navigate("/npcs")}
                            >
                                + PNJ
                            </Button>
                            <Button
                                variant="secondary"
                                className="text-xs"
                                onClick={() => navigate("/bestiary")}
                            >
                                + Monstre
                            </Button>
                        </div>
                    )
                }
            />

            {/* TIMELINE */}
            {isCombatStarted && timeline.length > 0 && (
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 overflow-x-auto animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest sticky left-0">
                        Ordre du tour
                    </div>
                    <div className="flex gap-4 min-w-max">
                        {timeline.map((c, idx) => (
                            <div
                                key={c._id}
                                className="relative flex flex-col items-center gap-2 group min-w-[60px]"
                            >
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400 z-10">
                                    {idx + 1}
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl shadow-lg overflow-hidden transition-transform hover:scale-110
                                    ${
                                        isCharacter(c)
                                            ? "border-amber-500/50 bg-slate-800"
                                            : isNpc(c)
                                            ? "border-indigo-500/50 bg-slate-800"
                                            : "border-red-500/50 bg-red-900/20"
                                    }`}
                                >
                                    {isCharacter(c)
                                        ? "🧙‍♂️"
                                        : isNpc(c)
                                        ? "🎭"
                                        : "🐉"}
                                </div>
                                <div className="font-mono font-bold text-xl text-white">
                                    {c.initiative}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* GRILLE 3 COLONNES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. HÉROS */}
                <div className="space-y-4">
                    <h2 className="text-lg font-serif font-bold text-amber-500 border-b border-amber-500/20 pb-2">
                        Héros ({heroes.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {heroes.map((h) => (
                            <CombatantCard
                                key={h._id}
                                entity={h}
                                variant={getVariant(h)}
                                isCombatStarted={isCombatStarted}
                                onUpdateInit={(val: string) =>
                                    updateInitiative(h, val)
                                }
                                onUpdateHealth={(amt: number) =>
                                    updateHealth(h, amt)
                                }
                                onRemove={(e: React.MouseEvent) =>
                                    removeFromCombat(h, e)
                                }
                                navigate={navigate}
                                isAuth={isAuthenticated}
                            />
                        ))}
                        {heroes.length === 0 && (
                            <p className="text-slate-600 italic text-sm">
                                Aucun héros.
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. PNJ (Alliés/Neutres) */}
                <div className="space-y-4">
                    <h2 className="text-lg font-serif font-bold text-indigo-400 border-b border-indigo-500/20 pb-2">
                        PNJ ({npcs.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {npcs.map((n) => (
                            <CombatantCard
                                key={n._id}
                                entity={n}
                                variant={getVariant(n)}
                                isCombatStarted={isCombatStarted}
                                onUpdateInit={(val: string) =>
                                    updateInitiative(n, val)
                                }
                                onUpdateHealth={(amt: number) =>
                                    updateHealth(n, amt)
                                }
                                onRemove={(e: React.MouseEvent) =>
                                    removeFromCombat(n, e)
                                }
                                navigate={navigate}
                                isAuth={isAuthenticated}
                            />
                        ))}
                        {npcs.length === 0 && (
                            <p className="text-slate-600 italic text-sm">
                                Aucun PNJ.
                            </p>
                        )}
                    </div>
                </div>

                {/* 3. MONSTRES (Ennemis) */}
                <div className="space-y-4">
                    <h2 className="text-lg font-serif font-bold text-red-500 border-b border-red-500/20 pb-2">
                        Menaces ({monsters.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {monsters.map((m) => (
                            <CombatantCard
                                key={m._id}
                                entity={m}
                                variant={getVariant(m)}
                                isCombatStarted={isCombatStarted}
                                onUpdateInit={(val: string) =>
                                    updateInitiative(m, val)
                                }
                                onUpdateHealth={(amt: number) =>
                                    updateHealth(m, amt)
                                }
                                onRemove={(e: React.MouseEvent) =>
                                    removeFromCombat(m, e)
                                }
                                navigate={navigate}
                                isAuth={isAuthenticated}
                            />
                        ))}
                        {monsters.length === 0 && (
                            <p className="text-slate-600 italic text-sm">
                                Aucune menace.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SOUS-COMPOSANT UNIFIÉ ---

const CombatantCard = ({
    entity,
    variant,
    isCombatStarted,
    onUpdateInit,
    onUpdateHealth,
    onRemove,
    navigate,
    isAuth,
}: any) => {
    // Détection du type pour l'affichage conditionnel
    const isChar = (entity as ICharacter).classe !== undefined;
    const isNpcEntity = (entity as INpc).occupation !== undefined;

    // Calcul Bonus Init
    let bonus = 0;
    if (isChar) bonus = (entity as ICharacter).stats.init;
    else bonus = Math.floor(((entity as IMonster | INpc).dexterite - 10) / 2);

    const bonusDisplay = bonus >= 0 ? `+${bonus}` : `${bonus}`;

    // Sous-titre dynamique
    let subtitle = "";
    let icon = undefined;

    if (isChar) {
        subtitle = `Niv ${(entity as ICharacter).niveau} ${
            (entity as ICharacter).classe
        }`;
    } else if (isNpcEntity) {
        subtitle = `${(entity as INpc).occupation}`;
        icon = "🎭";
    } else {
        subtitle = `CR ${(entity as IMonster).challenge}`;
        icon = "🐉";
    }

    // Gestion PV pour l'affichage
    const currentPv = isChar
        ? (entity as ICharacter).stats.pv_actuel
        : (entity as any).pv;
    const maxPv = isChar
        ? (entity as ICharacter).stats.pv_max
        : (entity as any).pv_max;

    return (
        <EntityCard
            title={entity.nom}
            subtitle={subtitle}
            variant={variant}
            icon={icon}
            onHpChange={isAuth ? onUpdateHealth : undefined}
            stats={[
                {
                    label: `Init (${bonusDisplay})`,
                    value: !isCombatStarted ? (
                        <span className="text-slate-500 text-lg">--</span>
                    ) : (
                        <input
                            type="number"
                            className="w-12 bg-slate-950 border border-slate-600 rounded text-center text-amber-500 font-bold focus:outline-none focus:border-amber-500 p-1"
                            value={
                                entity.initiative > 0 ? entity.initiative : ""
                            }
                            placeholder="0"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => onUpdateInit(e.target.value)}
                        />
                    ),
                },
                {
                    label: "CA",
                    value: isChar ? (entity as ICharacter).stats.ca : entity.ca,
                    icon: "🛡️",
                },
                {
                    label: "PV",
                    value: `${currentPv} / ${maxPv}`,
                    color: "text-green-400",
                },
            ]}
            bar={{
                current: currentPv,
                max: maxPv,
                label: "PV",
            }}
            onClick={() => {
                if (isChar) navigate(`/character/${entity._id}`);
                else if (!isNpcEntity) navigate(`/monster/${entity._id}`);
                else if (isNpcEntity) navigate(`/npc/${entity._id}`);
            }}
            actions={
                isAuth ? (
                    <Button
                        variant="ghost"
                        className="text-xs px-2 py-1 text-slate-500 hover:text-red-400 w-full"
                        onClick={onRemove}
                    >
                        {isChar || isNpcEntity ? "Retirer" : "💀 Tuer"}
                    </Button>
                ) : null
            }
        />
    );
};
