import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // 1. On attend que l'auth soit initialisée (évite les kicks injustifiés au refresh)
    if (loading) {
        return (
            <div className="text-white text-center mt-20">
                Chargement des accès...
            </div>
        );
    }

    // 2. Si connecté : on affiche la page demandée (Outlet)
    // 3. Sinon : on redirige vers le login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
