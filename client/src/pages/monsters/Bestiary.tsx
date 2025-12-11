import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { IMonster } from "../../types";


// UI Components

import { PageHeader } from "../../components/ui/PageHeader";
import { EntityCard } from "../../components/ui/EntityCard";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/authContext";

export default function Bestiary() {
    const [monsters, setMonsters] = useState<IMonster[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    

    // 1. Chargement des Modèles uniquement
    const fetchMonsters = async () => {
        try {
            const res = await api.get("/monsters");
            // On garde uniquement les "Templates" (ceux qui sont dans le livre)
            // Les copies (Gobelin 1, Gobelin 2...) n'apparaissent pas ici
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

    // 2. Helper Couleurs
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

    // 3. CLONAGE (Spawn)
    const spawnMonster = async (monster: IMonster, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            // On appelle la route de création d'instance
            await api.post(`/monsters/${monster._id}/instance`);

            alert(`Un nouveau ${monster.nom} rejoint le combat !`);
            // Note : Pas besoin de recharger cette page, le clone apparaîtra sur le Dashboard
        } catch (error) {
            console.error(error);
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
                            }, // On affiche le PV Max théorique
                            {
                                label: "Vitesse",
                                value: `${mob.vitesse}m`,
                                icon: "🦶",
                                color: "text-amber-400",
                            },
                        ]}
                        // Pas de barre de vie ici, c'est le modèle théorique

                        // On ne peut pas "ouvrir" un modèle pour le modifier (pour l'instant),
                        // donc on laisse le onClick vide ou on redirige vers une fiche en lecture seule.
                        // Pour l'instant on garde la redirection standard.
                        onClick={() => {}}
                        actions={
                            isAuthenticated ? (
                                <Button
                                    variant="secondary"
                                    className="text-xs px-2 py-1 w-full"
                                    onClick={(e) => spawnMonster(mob, e)}
                                >
                                    ⚔️ Ajouter (Clone)
                                </Button>
                            ) : null
                        }
                    />
                ))}
            </div>
        </div>
    );
}
