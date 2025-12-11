import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { ICharacter, IMonster } from "../types";

// UI Components
import { PageHeader } from "../components/ui/PageHeader";
import { EntityCard } from "../components/ui/EntityCard";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/authContext";

// Union type
type Combatant = ICharacter | IMonster;

export default function Dashboard() {
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [loading, setLoading] = useState(true);

    // NOUVEAU : État local pour savoir si le combat est lancé
    const [isCombatStarted, setIsCombatStarted] = useState(false);

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // --- HELPERS ---

    const isCharacter = (entity: Combatant): entity is ICharacter => {
        return (entity as ICharacter).classe !== undefined;
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
        } else {
            const type = entity.type.toLowerCase();
            if (type.includes("dragon") || type.includes("démon")) return "red";
            if (type.includes("bête")) return "green";
            return "slate";
        }
    };

    // --- CHARGEMENT ---

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [charsRes, monstersRes] = await Promise.all([
                    api.get<ICharacter[]>("/characters"),
                    api.get<IMonster[]>("/monsters"),
                ]);

                const activeChars = charsRes.data.filter((c) => c.est_actif);
                const activeMonsters = monstersRes.data.filter(
                    (m) => m.est_actif
                );

                const all = [...activeChars, ...activeMonsters];
                setCombatants(all);

                // DÉTECTION AUTO : Si quelqu'un a déjà de l'initiative, le combat est considéré comme "En cours"
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
            const endpoint = isCharacter(entity) ? "characters" : "monsters";
            await api.patch(`/${endpoint}/${entity._id}`, { initiative: val });
        } catch (error) {
            console.error("Erreur save init", error);
        }
    };

    const removeFromCombat = async (entity: Combatant, e: React.MouseEvent) => {
        e.stopPropagation();
        setCombatants((prev) => prev.filter((c) => c._id !== entity._id));
        try {
            if (isCharacter(entity)) {
                await api.patch(`/characters/${entity._id}`, {
                    est_actif: false,
                });
            } else {
                await api.delete(`/monsters/${entity._id}`);
            }
        } catch (error) {
            console.error("Erreur retrait combat", error);
        }
    };

    // --- START / STOP LOGIC ---

    const startCombat = () => {
        setIsCombatStarted(true);
    };

    const stopCombat = async () => {
        if (
            !window.confirm(
                "Arrêter le combat ? Cela réinitialisera toutes les initiatives à 0."
            )
        )
            return;

        // 1. UI Reset
        setIsCombatStarted(false);
        setCombatants((prev) => prev.map((c) => ({ ...c, initiative: 0 })));

        // 2. API Reset
        try {
            const promises = combatants.map((c) => {
                const endpoint = isCharacter(c) ? "characters" : "monsters";
                return api.patch(`/${endpoint}/${c._id}`, { initiative: 0 });
            });
            await Promise.all(promises);
        } catch (error) {
            console.error("Erreur reset combat", error);
        }
    };

    // --- UI CALCULATIONS ---

    const timeline = [...combatants].sort(
        (a, b) => b.initiative - a.initiative
    );
    const heroes = combatants.filter(isCharacter);
    const monsters = combatants.filter((c) => !isCharacter(c));

    if (loading) return <div className="text-white p-10">Chargement...</div>;

    return (
        <div className="space-y-8 pb-20">
            <PageHeader
                title="Table de Jeu"
                subtitle={
                    isCombatStarted ? "⚔️ Combat en cours" : "Campagne en cours"
                }
                action={
                    isAuthenticated && (
                        <div className="flex gap-2 items-center">
                            {/* BOUTON TOGGLE START/STOP */}
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

                            {/* Ajout rapide (toujours dispo) */}
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
                                onClick={() => navigate("/bestiary")}
                            >
                                + Monstre
                            </Button>
                        </div>
                    )
                }
            />

            {/* --- 1. TIMELINE (Seulement si combat démarré) --- */}
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
                                            : "border-red-500/50 bg-red-900/20"
                                    }`}
                                >
                                    {isCharacter(c) ? "🧙‍♂️" : "🐉"}
                                </div>
                                <div className="font-mono font-bold text-xl text-white">
                                    {c.initiative}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase truncate w-16 text-center">
                                    {c.nom}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- 2. PLATEAU --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* HÉROS */}
                <div className="space-y-4">
                    <h2 className="text-lg font-serif font-bold text-amber-500 border-b border-amber-500/20 pb-2">
                        Héros ({heroes.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {heroes.map((hero) => (
                            <CombatantCard
                                key={hero._id}
                                entity={hero}
                                variant={getVariant(hero)}
                                isCombatStarted={isCombatStarted} // 👈 On passe l'état
                                onUpdateInit={(val: string) =>
                                    updateInitiative(hero, val)
                                }
                                onRemove={(e: React.MouseEvent) =>
                                    removeFromCombat(hero, e)
                                }
                                navigate={navigate}
                                isAuth={isAuthenticated}
                            />
                        ))}
                        {heroes.length === 0 && (
                            <p className="text-slate-600 italic text-sm">
                                La table est vide.
                            </p>
                        )}
                    </div>
                </div>

                {/* MONSTRES */}
                <div className="space-y-4">
                    <h2 className="text-lg font-serif font-bold text-red-500 border-b border-red-500/20 pb-2">
                        Monstres ({monsters.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {monsters.map((mob) => (
                            <CombatantCard
                                key={mob._id}
                                entity={mob}
                                variant={getVariant(mob)}
                                isCombatStarted={isCombatStarted} // 👈 On passe l'état
                                onUpdateInit={(val: string) =>
                                    updateInitiative(mob, val)
                                }
                                onRemove={(e: React.MouseEvent) =>
                                    removeFromCombat(mob, e)
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

// --- SOUS-COMPOSANT ---

const CombatantCard = ({
    entity,
    variant,
    isCombatStarted,
    onUpdateInit,
    onRemove,
    navigate,
    isAuth,
}: any) => {
    const isChar = (entity as ICharacter).classe !== undefined;
    const bonus = isChar
        ? (entity as ICharacter).stats.init
        : Math.floor(((entity as IMonster).dexterite - 10) / 2);
    const bonusDisplay = bonus >= 0 ? `+${bonus}` : `${bonus}`;

    return (
        <EntityCard
            title={entity.nom}
            subtitle={
                isChar
                    ? `Niv ${(entity as ICharacter).niveau}`
                    : `CR ${(entity as IMonster).challenge}`
            }
            variant={variant}
            icon={!isChar ? "🐉" : undefined}
            stats={[
                {
                    label: `Init (${bonusDisplay})`,
                    // Si combat non démarré : on affiche "--"
                    // Si combat démarré : on affiche l'INPUT
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
                            autoFocus={entity.initiative === 0} // Petit bonus UX : focus auto si 0 ? (Optionnel)
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
                    value: `${
                        isChar
                            ? (entity as ICharacter).stats.pv_actuel
                            : entity.pv
                    } / ${
                        isChar
                            ? (entity as ICharacter).stats.pv_max
                            : entity.pv_max
                    }`,
                    color: "text-green-400",
                },
            ]}
            bar={{
                current: isChar
                    ? (entity as ICharacter).stats.pv_actuel
                    : entity.pv,
                max: isChar
                    ? (entity as ICharacter).stats.pv_max
                    : entity.pv_max,
                label: "PV",
            }}
            onClick={() =>
                isChar
                    ? navigate(`/character/${entity._id}`)
                    : navigate(`/monster/${entity._id}`)
            }
            actions={
                isAuth ? (
                    <Button
                        variant="ghost"
                        className="text-xs px-2 py-1 text-slate-500 hover:text-red-400 w-full"
                        onClick={onRemove}
                    >
                        {isChar ? "Retirer" : "💀 Tuer"}
                    </Button>
                ) : null
            }
        />
    );
};
