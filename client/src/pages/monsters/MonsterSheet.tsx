import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import type { IMonster } from "../../types";

export default function MonsterSheet() {
    const [mob, setMob] = useState<IMonster | null>(null);
    const { id } = useParams();

    // 1. Chargement
    useEffect(() => {
        if (!id) return;
        api.get<IMonster>(`/monsters/${id}`)
            .then((res) => {
                setMob(res.data);
            })
            .catch((err) => console.error(err));
    }, [id]);

    // 2. Gestion des PV
    const adjustPV = async (amount: number) => {
        if (!mob) return;

        // Bornes : Pas moins de 0, pas plus que le Max initial (Optionnel, mais logique)
        const newPv = Math.min(mob.pv_max, Math.max(0, mob.pv + amount));

        // Update Optimiste
        const updatedMob = { ...mob, pv: newPv };
        setMob(updatedMob);

        // Sauvegarde
        try {
            await api.patch(`/monsters/${mob._id}`, { pv: newPv });
        } catch (error) {
            console.error("Erreur sauvegarde PV", error);
        }
    };

    if (!mob)
        return (
            <div className="p-10 text-white animate-pulse">
                Invocation de la créature...
            </div>
        );

    // Calculs
    const getMod = (val: number) => Math.floor((val - 10) / 2);
    const formatMod = (val: number) => {
        const mod = getMod(val);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    // Calcul du pourcentage pour la barre
    const pvPercent = mob.pv_max > 0 ? (mob.pv / mob.pv_max) * 100 : 0;
    const barColor =
        pvPercent < 30
            ? "bg-red-600"
            : pvPercent < 60
            ? "bg-amber-500"
            : "bg-green-600";

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans pb-20">
            {/* Navigation */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20 flex justify-between items-center shadow-md">
                <Link
                    to="/bestiary"
                    className="text-slate-400 hover:text-white font-bold text-sm flex items-center gap-2 transition-colors"
                >
                    <span>←</span> Retour Bestiaire
                </Link>
                <span className="text-xs font-mono text-slate-600">
                    ID: {mob._id}
                </span>
            </div>

            <div className="max-w-3xl mx-auto p-4 md:p-10">
                <div className="bg-[#1e293b] border-2 border-slate-600 rounded-lg shadow-2xl overflow-hidden relative">
                    <div className="h-2 bg-amber-600 w-full"></div>

                    <div className="p-6 md:p-8 space-y-5">
                        {/* EN-TÊTE */}
                        <div>
                            <h1 className="text-4xl font-extrabold text-white font-serif tracking-tight mb-1">
                                {mob.nom}
                            </h1>
                            <p className="text-slate-400 italic text-lg capitalize">
                                {mob.taille} {mob.type},{" "}
                                {mob.alignement || "Non aligné"}
                            </p>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-amber-900 to-transparent my-4"></div>

                        {/* STATS VITALES */}
                        <div className="space-y-3 text-slate-300">
                            <div className="flex gap-8">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-amber-500 uppercase text-sm">
                                        CA
                                    </span>
                                    <span className="text-xl font-bold text-white">
                                        🛡️ {mob.ca}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-amber-500 uppercase text-sm">
                                        Vitesse
                                    </span>
                                    <span className="text-lg">
                                        🦶 {mob.vitesse}m
                                    </span>
                                </div>
                            </div>

                            {/* --- ZONE PV AVEC BARRE --- */}
                            <div className="bg-slate-800/80 p-4 rounded border border-slate-700 mt-2">
                                {/* Chiffres et Titre */}
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-amber-500 uppercase text-sm">
                                        Points de Vie
                                    </span>
                                    <div className="text-2xl font-bold text-white">
                                        <span
                                            className={
                                                mob.pv === 0
                                                    ? "text-red-500 animate-pulse"
                                                    : ""
                                            }
                                        >
                                            {mob.pv}
                                        </span>
                                        <span className="text-slate-500 text-lg">
                                            {" "}
                                            / {mob.pv_max}
                                        </span>
                                    </div>
                                </div>

                                {/* La Barre Visuelle */}
                                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-600 mb-4 relative shadow-inner">
                                    <div
                                        className={`h-full transition-all duration-500 ease-out ${barColor}`}
                                        style={{ width: `${pvPercent}%` }}
                                    ></div>
                                </div>

                                {/* Boutons */}
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => adjustPV(-1)}
                                        className="w-12 py-1 bg-red-900/30 text-red-400 border border-red-800 rounded hover:bg-red-500 hover:text-white font-bold transition-all"
                                    >
                                        -1
                                    </button>
                                    <button
                                        onClick={() => adjustPV(-5)}
                                        className="w-12 py-1 bg-red-900/50 text-red-400 border border-red-800 rounded hover:bg-red-600 hover:text-white font-bold transition-all"
                                    >
                                        -5
                                    </button>
                                    <div className="w-px bg-slate-600 mx-2"></div>
                                    <button
                                        onClick={() => adjustPV(1)}
                                        className="w-12 py-1 bg-green-900/30 text-green-400 border border-green-800 rounded hover:bg-green-500 hover:text-white font-bold transition-all"
                                    >
                                        +1
                                    </button>
                                    <button
                                        onClick={() => adjustPV(5)}
                                        className="w-12 py-1 bg-green-900/50 text-green-400 border border-green-800 rounded hover:bg-green-600 hover:text-white font-bold transition-all"
                                    >
                                        +5
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-amber-900 to-transparent my-4"></div>

                        {/* CARACTÉRISTIQUES */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                            {[
                                { label: "FOR", val: mob.force },
                                { label: "DEX", val: mob.dexterite },
                                { label: "CON", val: mob.constitution },
                                { label: "INT", val: mob.intelligence },
                                { label: "SAG", val: mob.sagesse },
                                { label: "CHA", val: mob.charisme },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex flex-col group cursor-help"
                                    title={`Score: ${stat.val}`}
                                >
                                    <span className="font-bold text-slate-500 text-xs mb-1">
                                        {stat.label}
                                    </span>
                                    <span className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                                        {formatMod(stat.val)}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        {stat.val}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-amber-900 to-transparent my-4"></div>

                        {/* INFOS + ACTIONS */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <span className="font-bold text-slate-500 block mb-1">
                                    Challenge
                                </span>
                                <div className="text-white text-lg font-bold flex items-center gap-2">
                                    <span>💀 {mob.challenge}</span>
                                    <span className="text-slate-500 text-xs font-normal">
                                        ({mob.challenge * 200} XP)
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-serif text-amber-500 border-b border-amber-900/50 pb-2 mb-4">
                                    Actions
                                </h3>
                                <div className="space-y-6">
                                    {mob.actions.map((action, idx) => (
                                        <div
                                            key={idx}
                                            className="text-slate-300"
                                        >
                                            <span className="font-bold text-white text-lg text-amber-100">
                                                {action.nom}.
                                            </span>{" "}
                                            <span className="text-slate-400 leading-relaxed block mt-1 pl-4 border-l-2 border-slate-700">
                                                {action.desc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-2 bg-amber-600 w-full"></div>
                </div>
            </div>
        </div>
    );
}
