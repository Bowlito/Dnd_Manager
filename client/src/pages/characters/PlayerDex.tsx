import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    // Chargement

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

    // Helper pour déterminer la couleur (Variante)
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

    //Ajouter au combat

    const addToCombat = async (char: ICharacter, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            // 1. On met à jour la DB
            await api.patch(`/characters/${char._id}`, { est_actif: true });

            // 2. Feedback visuel (Optionnel : on peut afficher une notif ou changer le bouton)
            alert(`${char.nom} a rejoint le combat !`);
            fetchChars();

            // Optionnel : Si tu veux rediriger direct vers le dashboard
            // navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCombat = async (char: ICharacter, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.patch(`/characters/${char._id}`, { est_actif: false });
            alert(`${char.nom} quitte le combat !`);
            fetchChars();
        } catch (error) {
            console.error(error);
        }
    };

    // Suppression
    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Important : empêche d'ouvrir la fiche quand on clique sur supprimer

        if (!window.confirm("Supprimer ce héros définitivement ?")) return;

        try {
            await api.delete(`/characters/${id}`);
            // On met à jour l'état local pour le faire disparaître tout de suite
            setCharacters((prev) => prev.filter((c) => c._id !== id));
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
            {/* 1. En-tête Standardisé */}
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

            {/* 2. Grille de Cartes */}
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
                        variant={getVariant(char.classe)} // Couleur dynamique
                        // On passe les stats
                        stats={[
                            {
                                label: "Armure",
                                value: char.stats.ca,
                                icon: "🛡️",
                            },
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
                        // On passe la barre de vie
                        bar={{
                            current: char.stats.pv_actuel,
                            max: char.stats.pv_max,
                            label: "Points de Vie",
                        }}
                        onClick={() => navigate(`/character/${char._id}`)}
                        // On configure les boutons spécifiques à cette page
                        actions={
                            isAuthenticated ? (
                                <>
                                    {/* Bouton pour ajouter au combat (Futur Dashboard) */}
                                    {!char.est_actif ? (
                                        <Button
                                            variant="secondary"
                                            className="text-xs px-2 py-1"
                                            onClick={(e) =>
                                                addToCombat(char, e)
                                            }
                                        >
                                            ⚔️ Combat
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            className="text-xs px-2 py-1"
                                            onClick={(e) =>
                                                removeFromCombat(char, e)
                                            }
                                        >
                                            🏃 Retirer
                                        </Button>
                                    )}
                                    {/* Bouton Supprimer */}
                                    <Button
                                        variant="danger"
                                        className="text-xs"
                                        onClick={(e) =>
                                            handleDelete(char._id, e)
                                        }
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
