import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
// 👇 1. Import du Hook
import { useAuth } from "../../contexts/authContext";

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // 👇 2. On récupère l'état et l'action depuis le Context
    // Plus besoin de lire le localStorage à la main !
    const { isAuthenticated, logout } = useAuth();

    // Fonction de déconnexion propre
    const handleLogout = () => {
        logout(); // Le context nettoie tout (token, user, state)
        navigate("/login"); // On redirige
        // ✨ PLUS DE RELOAD NÉCESSAIRE
    };

    const linkStyle = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-bold ${
            isActive
                ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`;

    const actionButtonStyle =
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-bold text-slate-400 hover:bg-slate-800 hover:text-red-400 cursor-pointer";

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center font-bold text-slate-900">
                        D
                    </div>
                    <h1 className="font-serif font-bold text-xl tracking-wide text-slate-100">
                        Dnd Manager
                    </h1>
                </div>

                <nav className="flex-1 p-4 flex flex-col">
                    <div className="space-y-2 flex-1">
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 mt-2 px-2">
                            Campagne
                        </div>
                        <NavLink to="/" className={linkStyle}>
                            <span>⚔️</span> Dashboard
                        </NavLink>

                        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 mt-8 px-2">
                            Bibliothèques
                        </div>
                        <NavLink to="/playerdex" className={linkStyle}>
                            <span>🧙‍♂️</span> PlayerDex
                        </NavLink>
                        <NavLink to="/bestiary" className={linkStyle}>
                            <span>🐉</span> Bestiaire
                        </NavLink>
                        <NavLink to="/npcs" className={linkStyle}>
                            <span>🎭</span> PNJ
                        </NavLink>
                    </div>

                    {/* Zone Auth Dynamique */}
                    <div className="border-t border-slate-800 pt-4 mt-4 text-center">
                        {/* 👇 3. Utilisation de la variable du context */}
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className={actionButtonStyle}
                                >
                                    <span>🚪</span> Déconnexion
                                </button>
                            </>
                        ) : (
                            location.pathname !== "/login" && (
                                <NavLink to="/login" className={linkStyle}>
                                    <span>🔐</span> Connexion
                                </NavLink>
                            )
                        )}
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                    v0.2.1 • Alpha
                </div>
            </aside>

            {/* --- CONTENU --- */}
            <main className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
