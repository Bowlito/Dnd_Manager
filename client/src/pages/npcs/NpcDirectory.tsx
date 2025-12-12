import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import api from "../../api/axios";
import type { INpc } from "../../types/npcType";
import { useAuth } from "../../contexts/authContext";

// UI Components
import { PageHeader } from "../../components/ui/PageHeader";
import { EntityCard } from "../../components/ui/EntityCard";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function NpcDirectory() {
    const [npcs, setNpcs] = useState<INpc[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    // Chargement
    const fetchNpcs = async () => {
        try {
            const res = await api.get("/npcs");
            setNpcs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNpcs();
    }, []);

    // Toggle Déploiement (Copie conforme du PlayerDex)
    const toggleDeployment = async (npc: INpc, e: React.MouseEvent) => {
        e.stopPropagation();

        const newState = !npc.est_actif;

        // Optimistic UI
        setNpcs((prev) =>
            prev.map((n) =>
                n._id === npc._id ? { ...n, est_actif: newState } : n
            )
        );

        try {
            await api.patch(`/npcs/${npc._id}`, { est_actif: newState });

            if (newState) {
                enqueueSnackbar(`${npc.nom} entre en scène !`, {
                    variant: "success",
                    autoHideDuration: 2000,
                });
            } else {
                enqueueSnackbar(`${npc.nom} quitte la scène.`, {
                    variant: "info",
                    autoHideDuration: 2000,
                });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Erreur de synchronisation", { variant: "error" });
            // Rollback
            setNpcs((prev) =>
                prev.map((n) =>
                    n._id === npc._id ? { ...n, est_actif: !newState } : n
                )
            );
        }
    };

    if (loading)
        return <div className="text-white p-10">Chargement des PNJ...</div>;

    return (
        <div>
            <PageHeader
                title="Dramatis Personae"
                subtitle="Personnages Non-Joueurs"
                action={
                    isAuthenticated ? (
                        // Placeholder pour le bouton création
                        <Button
                            variant="primary"
                            onClick={() => navigate("/npcs/create")}
                        >
                            + Nouveau PNJ
                        </Button>
                    ) : null
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {npcs.length === 0 && (
                    <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                        Aucun PNJ connu.
                    </div>
                )}

                {npcs.map((npc) => (
                    <EntityCard
                        key={npc._id}
                        title={npc.nom}
                        subtitle={`${npc.race} • ${npc.occupation}`}
                        variant="slate" // Couleur neutre pour les PNJ
                        icon="🎭"
                        stats={[
                            {
                                label: "PV",
                                value: `${npc.pv}/${npc.pv_max}`,
                                color: "text-green-400",
                            },
                            { label: "CA", value: npc.ca, icon: "🛡️" },
                        ]}
                        onClick={() => navigate(`/npc/${npc._id}`)}
                        actions={
                            isAuthenticated ? (
                                <Button
                                    variant="secondary"
                                    className={`text-xs px-3 py-1 w-full transition-all duration-300 font-bold flex items-center justify-center gap-2 ${
                                        npc.est_actif
                                            ? // STYLE TOGGLE ACTIF (Orange #F59E09)
                                              "bg-slate-900 border border-[#F59E09] text-white shadow-[0_0_10px_rgba(245,158,9,0.2)]"
                                            : "bg-slate-800 text-slate-500 border border-transparent hover:bg-slate-700"
                                    }`}
                                    onClick={(e) => toggleDeployment(npc, e)}
                                >
                                    {/* La pastille de couleur */}
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full shadow-[0_0_5px_currentColor] ${
                                            npc.est_actif
                                                ? "bg-[#F59E09]"
                                                : "bg-slate-500"
                                        }`}
                                    ></span>

                                    {npc.est_actif ? "DÉPLOYÉ" : "RÉSERVE"}
                                </Button>
                            ) : null
                        }
                    />
                ))}
            </div>
        </div>
    );
}
