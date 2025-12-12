import type { ReactNode } from "react";

// Modification ici : value accepte ReactNode (pour l'input Init)
interface StatProps {
    label: string;
    value: string | number | ReactNode;
    color?: string;
    icon?: string;
}

interface Props {
    title: string;
    subtitle: string;
    variant?: "red" | "blue" | "green" | "amber" | "slate";

    image?: string;
    icon?: string;

    stats?: StatProps[];

    // Modification ici : on ajoute le callback optionnel pour gérer les PV
    bar?: { current: number; max: number; label: string };
    onHpChange?: (amount: number) => void; // 👈 NOUVEAU CALLBACK

    actions?: ReactNode;
    onClick?: () => void;
}

export const EntityCard = ({
    title,
    subtitle,
    variant = "slate",
    image,
    icon,
    stats = [],
    bar,
    onHpChange, // 👈 On le récupère
    actions,
    onClick,
}: Props) => {
    const gradients = {
        red: "from-red-900 to-slate-900",
        blue: "from-blue-900 to-slate-900",
        green: "from-emerald-900 to-slate-900",
        amber: "from-amber-900 to-slate-900",
        slate: "from-slate-800 to-slate-950",
    };

    const bgGradient = gradients[variant];

    const renderAvatar = () => {
        if (image) {
            return (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            );
        }
        if (icon) {
            return <span className="text-4xl">{icon}</span>;
        }
        return (
            <img
                src="../public/portrait.png"
                alt={title}
                className="w-full h-full object-cover"
            />
        );
    };

    return (
        <div
            className="relative group w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-amber-500/20 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
            onClick={onClick}
        >
            {/* --- EN-TÊTE --- */}
            <div
                className={`h-24 bg-gradient-to-b ${bgGradient} relative shrink-0`}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded border border-white/10">
                    {subtitle.split("•").pop()?.trim() || subtitle}
                </div>
            </div>

            {/* --- CORPS --- */}
            <div className="px-5 relative flex-grow flex flex-col">
                <div className="-mt-12 mb-3 shrink-0">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-900 shadow-md bg-slate-800 flex items-center justify-center overflow-hidden">
                        {renderAvatar()}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-100 font-serif tracking-wide group-hover:text-amber-400 transition-colors truncate">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider text-xs truncate">
                        {subtitle}
                    </p>
                </div>

                {/* Grille de Stats */}
                {stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-center flex flex-col items-center justify-center min-h-[60px]"
                            >
                                <span className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                                    {stat.label}
                                </span>
                                <div
                                    className={`text-lg font-bold flex items-center gap-1 ${
                                        stat.color || "text-slate-200"
                                    }`}
                                >
                                    {stat.icon && <span>{stat.icon} </span>}
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Barre de Progression (Vie) + Boutons d'édition */}
                {bar && (
                    <div className="mb-5 mt-auto">
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 px-1">
                            <span>{bar.label}</span>
                            <span
                                className={
                                    bar.current < bar.max / 2
                                        ? "text-red-400"
                                        : "text-green-400"
                                }
                            >
                                {bar.current} / {bar.max}
                            </span>
                        </div>

                        {/* La Barre */}
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-2">
                            <div
                                className={`h-full transition-all duration-500 ${
                                    bar.current < bar.max / 2
                                        ? "bg-red-600"
                                        : "bg-green-600"
                                }`}
                                style={{
                                    width: `${Math.min(
                                        100,
                                        (bar.current / bar.max) * 100
                                    )}%`,
                                }}
                            ></div>
                        </div>

                        {/* 👇 Zone de contrôle PV (Uniquement si onHpChange est fourni) */}
                        {onHpChange && (
                            <div className="flex justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onHpChange(-1);
                                        }}
                                        className="bg-red-900/40 hover:bg-red-600 text-red-200 text-[10px] px-2 py-0.5 rounded border border-red-900/50 font-bold"
                                        title="-1 PV"
                                    >
                                        -1
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onHpChange(-5);
                                        }}
                                        className="bg-red-900/40 hover:bg-red-600 text-red-200 text-[10px] px-2 py-0.5 rounded border border-red-900/50 font-bold"
                                        title="-5 PV"
                                    >
                                        -5
                                    </button>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onHpChange(1);
                                        }}
                                        className="bg-green-900/40 hover:bg-green-600 text-green-200 text-[10px] px-2 py-0.5 rounded border border-green-900/50 font-bold"
                                        title="+1 PV"
                                    >
                                        +1
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onHpChange(5);
                                        }}
                                        className="bg-green-900/40 hover:bg-green-600 text-green-200 text-[10px] px-2 py-0.5 rounded border border-green-900/50 font-bold"
                                        title="+5 PV"
                                    >
                                        +5
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- ACTIONS --- */}
            {actions && (
                <div
                    className="px-4 py-3 bg-slate-950/50 border-t border-slate-800 flex gap-2 justify-end mt-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {actions}
                </div>
            )}
        </div>
    );
};
