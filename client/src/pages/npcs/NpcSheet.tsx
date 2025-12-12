import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { INpc } from "../../types/npcType";
import { Button } from "../../components/ui/Button";

export default function NpcSheet() {
    const [npc, setNpc] = useState<INpc | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Chargement
    useEffect(() => {
        if (!id) return;
        api.get<INpc>(`/npcs/${id}`)
            .then((res) => setNpc(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    // Gestion PV Rapide
    const adjustPV = async (amount: number) => {
        if (!npc) return;
        const newPv = Math.min(npc.pv_max, Math.max(0, npc.pv + amount));

        // Optimistic Update
        setNpc({ ...npc, pv: newPv });

        try {
            await api.patch(`/npcs/${npc._id}`, { pv: newPv });
        } catch (error) {
            console.error("Erreur PV", error);
        }
    };

    // Suppression
    const handleDelete = async () => {
        if (!npc || !window.confirm("Supprimer ce PNJ définitivement ?"))
            return;
        try {
            await api.delete(`/npcs/${npc._id}`);
            navigate("/npcs");
        } catch (error) {
            console.error(error);
        }
    };

    if (!npc)
        return (
            <div className="p-10 text-white animate-pulse">
                Invocation du PNJ...
            </div>
        );

    // Calculs d'affichage
    const getMod = (val: number) => Math.floor((val - 10) / 2);
    const formatMod = (val: number) => {
        const mod = getMod(val);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    const pvPercent = (npc.pv / npc.pv_max) * 100;
    const barColor =
        pvPercent < 30
            ? "bg-red-600"
            : pvPercent < 60
            ? "bg-amber-500"
            : "bg-green-600";

    return (
        <div className="min-h-screen pb-20 space-y-6">
            {/* NAVIGATION */}
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <Link
                    to="/npcs"
                    className="text-slate-400 hover:text-amber-500 font-bold text-sm flex items-center gap-2 transition-colors"
                >
                    <span>←</span> Retour Annuaire
                </Link>
                <div className="flex gap-2">
                    <Button
                        variant="danger"
                        className="text-xs"
                        onClick={handleDelete}
                    >
                        Supprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* --- COLONNE GAUCHE : ROLEPLAY (7 cols) --- */}
                <div className="lg:col-span-7 space-y-6">
                    {/* En-tête Identité */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">
                            🎭
                        </div>
                        <h1 className="text-4xl font-extrabold text-white font-serif tracking-tight mb-2">
                            {npc.nom}
                        </h1>
                        <p className="text-xl text-amber-500 font-medium mb-4">
                            {npc.occupation} • {npc.race}
                        </p>

                        <div className="inline-block bg-slate-950 px-3 py-1 rounded text-xs font-bold text-slate-400 border border-slate-700">
                            {npc.alignement || "Alignement inconnu"}
                        </div>
                    </div>

                    {/* Bloc "Aide de Jeu" */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
                                🗣️ Voix & Ton
                            </h3>
                            <p className="text-slate-300 italic">
                                "{npc.voix || "Normal"}"
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                                👁️ Apparence
                            </h3>
                            <p className="text-slate-300">
                                {npc.apparence || "Ordinaire"}
                            </p>
                        </div>
                    </div>

                    {/* Bloc "Secrets & Buts" (Marqué visuellement) */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border-l-4 border-l-purple-500 border border-slate-700 shadow-lg">
                        <h3 className="text-lg font-serif font-bold text-purple-400 mb-4 flex items-center gap-2">
                            <span>🤫</span> Secrets & Motivations
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                    Motivation Principale
                                </span>
                                <p className="text-slate-200">
                                    {npc.but || "Vivre sa vie tranquillement."}
                                </p>
                            </div>
                            <div className="bg-purple-900/10 p-3 rounded border border-purple-500/20">
                                <span className="text-xs font-bold text-purple-400 uppercase block mb-1">
                                    Le Secret du MJ
                                </span>
                                <p className="text-purple-200 italic font-medium">
                                    {npc.secret || "Aucun secret particulier."}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                    Personnalité
                                </span>
                                <p className="text-slate-400 text-sm">
                                    {npc.personnalite}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLONNE DROITE : STATBLOCK (5 cols) --- */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Panneau de Combat */}
                    <div className="bg-[#1e293b] border-2 border-slate-600 rounded-lg shadow-xl overflow-hidden">
                        <div className="bg-slate-950 p-3 border-b border-slate-700 flex justify-between items-center">
                            <span className="font-bold text-slate-400 text-sm uppercase">
                                Fiche Technique
                            </span>
                            <span className="text-xs font-mono text-slate-600">
                                ID: {npc._id.slice(-4)}
                            </span>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Stats Vitales */}
                            <div className="flex justify-around text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">
                                        🛡️ {npc.ca}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                                        Classe d'Armure
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        🦶 {npc.vitesse}m
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                                        Vitesse
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-amber-500">
                                        ⚡ {formatMod(npc.dexterite)}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                                        Init
                                    </div>
                                </div>
                            </div>

                            {/* Barre de Vie Interactive */}
                            <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-slate-400 text-xs uppercase">
                                        Points de Vie
                                    </span>
                                    <span className="font-bold text-white">
                                        {npc.pv}{" "}
                                        <span className="text-slate-500">
                                            / {npc.pv_max}
                                        </span>
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-600 mb-3">
                                    <div
                                        className={`h-full transition-all duration-300 ${barColor}`}
                                        style={{ width: `${pvPercent}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => adjustPV(-1)}
                                        className="w-8 h-8 rounded bg-slate-700 hover:bg-red-500 text-white font-bold transition-colors"
                                    >
                                        -1
                                    </button>
                                    <button
                                        onClick={() => adjustPV(-5)}
                                        className="w-8 h-8 rounded bg-slate-700 hover:bg-red-600 text-white font-bold transition-colors"
                                    >
                                        -5
                                    </button>
                                    <button
                                        onClick={() => adjustPV(1)}
                                        className="w-8 h-8 rounded bg-slate-700 hover:bg-green-500 text-white font-bold transition-colors"
                                    >
                                        +1
                                    </button>
                                    <button
                                        onClick={() => adjustPV(5)}
                                        className="w-8 h-8 rounded bg-slate-700 hover:bg-green-600 text-white font-bold transition-colors"
                                    >
                                        +5
                                    </button>
                                </div>
                            </div>

                            {/* Caractéristiques */}
                            <div className="grid grid-cols-6 gap-1 text-center">
                                {[
                                    { l: "FOR", v: npc.force },
                                    { l: "DEX", v: npc.dexterite },
                                    { l: "CON", v: npc.constitution },
                                    { l: "INT", v: npc.intelligence },
                                    { l: "SAG", v: npc.sagesse },
                                    { l: "CHA", v: npc.charisme },
                                ].map((s) => (
                                    <div
                                        key={s.l}
                                        className="flex flex-col bg-slate-800 p-1 rounded"
                                    >
                                        <span className="text-[9px] font-bold text-slate-500">
                                            {s.l}
                                        </span>
                                        <span className="font-bold text-white text-sm">
                                            {formatMod(s.v)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Attaques */}
                            <div>
                                <h3 className="text-sm font-bold text-amber-500 border-b border-slate-700 pb-1 mb-3">
                                    Actions
                                </h3>
                                {npc.attaques.length === 0 && (
                                    <p className="text-slate-500 italic text-xs">
                                        Aucune attaque.
                                    </p>
                                )}
                                <div className="space-y-3">
                                    {npc.attaques.map((att, idx) => (
                                        <div key={idx} className="text-sm">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-white">
                                                    ⚔️ {att.nom}
                                                </span>
                                                <span className="text-amber-400 font-mono font-bold">
                                                    +{att.bonus}
                                                </span>
                                            </div>
                                            <div className="text-slate-400 text-xs pl-5">
                                                {att.degats} dégâts
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
