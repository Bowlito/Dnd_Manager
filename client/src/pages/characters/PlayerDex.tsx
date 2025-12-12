import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../api/axios";
import type { ICharacter } from "../../types/characterType";
import { useAuth } from "../../contexts/authContext";

// UI Components
import { PageHeader } from "../../components/ui/PageHeader";
import { EntityCard } from "../../components/ui/EntityCard";
import { Button } from "../../components/ui/Button";

export default function PlayerDex() {
    const [characters, setCharacters] = useState<ICharacter[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const fetchChars = async () => {
        try {
            const res = await api.get("/characters");
            setCharacters(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChars();
    }, []);

    const getVariant = (classe: string) => {
        const cls = classe.toLowerCase();
        if (cls.includes("guerrier") || cls.includes("barbare")) return "red";
        if (
            cls.includes("magicien") ||
            cls.includes("sorcier") ||
            cls.includes("ensorceleur")
        )
            return "blue";
        if (
            cls.includes("voleur") ||
            cls.includes("roublard") ||
            cls.includes("rôdeur") ||
            cls.includes("druide")
        )
            return "green";
        if (
            cls.includes("clerc") ||
            cls.includes("paladin") ||
            cls.includes("barde")
        )
            return "amber";
        return "slate";
    };

    const toggleDeployment = async (char: ICharacter, e: React.MouseEvent) => {
        e.stopPropagation();

        const newState = !char.est_actif;

        // Optimistic Update
        setCharacters((prev) =>
            prev.map((c) =>
                c._id === char._id ? { ...c, est_actif: newState } : c
            )
        );

        try {
            await api.patch(`/characters/${char._id}`, { est_actif: newState });

            if (newState) {
                enqueueSnackbar(`${char.nom} rejoint la table !`, {
                    variant: "success",
                    autoHideDuration: 2000,
                });
            } else {
                enqueueSnackbar(`${char.nom} retourne en réserve.`, {
                    variant: "info",
                    autoHideDuration: 2000,
                });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Erreur de synchronisation", { variant: "error" });
            setCharacters((prev) =>
                prev.map((c) =>
                    c._id === char._id ? { ...c, est_actif: !newState } : c
                )
            );
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Supprimer ce héros définitivement ?")) return;

        try {
            await api.delete(`/characters/${id}`);
            setCharacters((prev) => prev.filter((c) => c._id !== id));
            enqueueSnackbar("Héros supprimé.", { variant: "warning" });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading)
        return (
            <div className="text-white p-10">Chargement du PlayerDex...</div>
        );

    return (
        <div>
            <PageHeader
                title="PlayerDex"
                subtitle="Bibliothèque des Héros"
                action={
                    isAuthenticated ? (
                        <Link to="/create">
                            <Button variant="primary">
                                + Nouveau Personnage
                            </Button>
                        </Link>
                    ) : null
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {characters.length === 0 && (
                    <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                        Aucun héros dans le registre. Créez-en un !
                    </div>
                )}

                {characters.map((char) => (
                    <EntityCard
                        key={char._id}
                        title={char.nom}
                        subtitle={`${char.race} • ${char.classe}`}
                        variant={getVariant(char.classe)}
                        stats={[
                            { label: "CA", value: char.stats.ca, icon: "🛡️" },
                            {
                                label: "Init",
                                value:
                                    char.stats.init >= 0
                                        ? `+${char.stats.init}`
                                        : char.stats.init,
                                color: "text-amber-400",
                            },
                            {
                                label: "P.P",
                                value: char.stats.perception_passive,
                                icon: "👁️",
                                color: "text-purple-400",
                            },
                        ]}
                        bar={{
                            current: char.stats.pv_actuel,
                            max: char.stats.pv_max,
                            label: "Points de Vie",
                        }}
                        onClick={() => navigate(`/character/${char._id}`)}
                        actions={
                            isAuthenticated ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        className={`text-xs px-3 py-1 flex-1 transition-all duration-300 font-bold flex items-center justify-center gap-2 ${
                                            char.est_actif
                                                ? // Fond sombre + Bordure Orange + Texte Blanc
                                                  "bg-slate-900 border border-[#F59E09] text-white shadow-[0_0_10px_rgba(245,158,9,0.2)]"
                                                : "bg-slate-800 text-slate-500 border border-transparent hover:bg-slate-700"
                                        }`}
                                        onClick={(e) =>
                                            toggleDeployment(char, e)
                                        }
                                    >
                                        {/* 👇 ICI : La pastille CSS qui remplace l'emoji */}
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full shadow-[0_0_5px_currentColor] ${
                                                char.est_actif
                                                    ? "bg-[#F59E09]"
                                                    : "bg-slate-500"
                                            }`}
                                        ></span>

                                        {char.est_actif ? "DÉPLOYÉ" : "RÉSERVE"}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="text-xs text-slate-600 hover:text-red-500 px-2"
                                        onClick={(e) =>
                                            handleDelete(char._id, e)
                                        }
                                        title="Supprimer définitivement"
                                    >
                                        🗑️
                                    </Button>
                                </>
                            ) : null
                        }
                    />
                ))}
            </div>
        </div>
    );
}
