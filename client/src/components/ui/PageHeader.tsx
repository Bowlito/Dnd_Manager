import type { ReactNode } from "react";

interface Props {
    title: string;
    subtitle?: string; // ex: "Bibliothèque"
    action?: ReactNode; // Le bouton principal à droite
}

export const PageHeader = ({ title, subtitle, action }: Props) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
            <div>
                {subtitle && (
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 block">
                        {subtitle}
                    </span>
                )}
                <h1 className="text-3xl font-bold text-white font-serif tracking-tight">
                    {title}
                </h1>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
};
