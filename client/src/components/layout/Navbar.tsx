import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // On vérifie simplement la présence du token
    // (Comme on reload la page au login/logout, ça suffit pour l'instant sans Context complexe)
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
        window.location.reload();
    };

    // Helper pour styliser les liens actifs
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `text-sm font-bold transition-colors ${
            isActive ? "text-amber-400" : "text-slate-400 hover:text-white"
        }`;
    };

    return (
        <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* LOGO / HOME */}
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-xl font-black tracking-tighter text-white"
                    >
                        🐉 VTT<span className="text-amber-500">Manager</span>
                    </Link>

                    {/* MENU DE NAVIGATION */}
                    <div className="hidden md:flex gap-6">
                        <Link
                            to="/dashboard"
                            className={getLinkClass("/dashboard")}
                        >
                            Table de Jeu
                        </Link>
                        <Link
                            to="/playerdex"
                            className={getLinkClass("/playerdex")}
                        >
                            Héros
                        </Link>
                        <Link
                            to="/bestiary"
                            className={getLinkClass("/bestiary")}
                        >
                            Bestiaire
                        </Link>
                    </div>
                </div>

                {/* SECTION AUTH (DROITE) */}
                <div>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                className="text-xs border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-900/50"
                                onClick={handleLogout}
                            >
                                Déconnexion
                            </Button>
                        </div>
                    ) : (
                        // On masque le bouton login si on est déjà sur la page login
                        location.pathname !== "/login" && (
                            <Link to="/login">
                                <Button
                                    variant="primary"
                                    className="text-xs font-bold"
                                >
                                    Connexion Admin
                                </Button>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
};
