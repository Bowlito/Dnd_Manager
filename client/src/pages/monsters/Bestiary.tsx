import { useEffect, useState } from "react";
import { useSnackbar } from "notistack"; // 👈 Import notistack
import api from "../../api/axios";
import type { IMonster } from "../../types/monsterType";

// UI Components
import { PageHeader } from "../../components/ui/PageHeader";
import { EntityCard } from "../../components/ui/EntityCard";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/authContext";

export default function Bestiary() {
    const [monsters, setMonsters] = useState<IMonster[]>([]);
    const [loading, setLoading] = useState(true);

    // État local pour gérer les quantités de chaque carte : { "id_du_monstre": 5, ... }
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const { isAuthenticated } = useAuth();
    const { enqueueSnackbar } = useSnackbar(); // 👈 Hook Notification

    // 1. Chargement des Modèles
    const fetchMonsters = async () => {
        try {
            const res = await api.get("/monsters");
            // On ne garde que les "Templates" (ceux du livre)
            const templates = res.data.filter(
                (m: IMonster) => m.est_modele === true
            );
            setMonsters(templates);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonsters();
    }, []);

    // Helper Couleurs
    const getVariant = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes("dragon") || t.includes("démon") || t.includes("diable"))
            return "red";
        if (t.includes("bête") || t.includes("plante")) return "green";
        if (
            t.includes("céleste") ||
            t.includes("fée") ||
            t.includes("élémentaire")
        )
            return "blue";
        return "slate";
    };

    // Helper pour mettre à jour la quantité d'un monstre spécifique
    const handleQuantityChange = (id: string, val: string) => {
        const qty = Math.max(1, parseInt(val) || 1); // Minimum 1
        setQuantities((prev) => ({ ...prev, [id]: qty }));
    };

    // 3. CLONAGE MULTIPLE (Spawn)
    const spawnMonsters = async (monster: IMonster, e: React.MouseEvent) => {
        e.stopPropagation();

        // Récupère la quantité choisie (ou 1 par défaut)
        const qty = quantities[monster._id] || 1;
        let successCount = 0;

        try {
            // Boucle séquentielle pour garantir le bon nommage (Gobelin 1, Gobelin 2...)
            // Si on fait du parallèle (Promise.all), le backend risque de donner le même nom à tous.
            for (let i = 0; i < qty; i++) {
                await api.post(`/monsters/${monster._id}/instance`);
                successCount++;
            }

            // Notification Succès
            enqueueSnackbar(
                `${successCount} ${monster.nom}${successCount > 1 ? "s" : ""} ${
                    successCount > 1 ? "rejoignent" : "rejoint"
                } le combat !`,
                { variant: "success", autoHideDuration: 3000 }
            );

            // On remet le compteur à 1 pour ce monstre
            setQuantities((prev) => ({ ...prev, [monster._id]: 1 }));
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Erreur lors de l'invocation.", {
                variant: "error",
            });
        }
    };

    if (loading)
        return <div className="text-white p-10">Ouverture du Bestiaire...</div>;

    return (
        <div>
            <PageHeader title="Bestiaire" subtitle="Créatures & Monstres" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {monsters.length === 0 && (
                    <div className="col-span-full text-slate-500 text-center border-2 border-dashed border-slate-700 p-10 rounded-xl">
                        Le bestiaire est vide.
                    </div>
                )}

                {monsters.map((mob) => (
                    <EntityCard
                        key={mob._id}
                        title={mob.nom}
                        subtitle={`${mob.taille} • ${mob.type} • CR ${mob.challenge}`}
                        variant={getVariant(mob.type)}
                        icon="🐉"
                        stats={[
                            { label: "CA", value: mob.ca, icon: "🛡️" },
                            {
                                label: "PV Moyens",
                                value: mob.pv_max,
                                icon: "♥",
                                color: "text-green-400",
                            },
                            {
                                label: "Vitesse",
                                value: `${mob.vitesse}m`,
                                icon: "🦶",
                                color: "text-amber-400",
                            },
                        ]}
                        onClick={() => {}} // Pas d'action au clic sur la carte modèle pour l'instant
                        actions={
                            isAuthenticated ? (
                                <div className="flex w-full gap-2 items-center">
                                    {/* Champ Quantité */}
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-14 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-center text-white text-xs font-bold focus:border-amber-500 outline-none h-8"
                                        value={quantities[mob._id] || 1}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                mob._id,
                                                e.target.value
                                            )
                                        }
                                    />

                                    {/* Bouton Ajouter */}
                                    <Button
                                        variant="secondary"
                                        className="text-xs px-2 py-1 flex-1 h-8"
                                        onClick={(e) => spawnMonsters(mob, e)}
                                    >
                                        ⚔️ Invoquer
                                    </Button>
                                </div>
                            ) : null
                        }
                    />
                ))}
            </div>
        </div>
    );
}
