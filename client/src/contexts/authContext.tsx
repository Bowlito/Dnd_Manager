import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import api from "../api/axios";
// 👇 On importe depuis ton nouveau fichier
import type { IUser } from "../types/userType";

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    login: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("userRole");

        // On restaure une session minimale si le token est là
        if (storedToken && storedRole) {
            setToken(storedToken);
            // On force le type pour correspondre à IUser (on simule l'objet complet)
            setUser({
                _id: "stored",
                email: "admin@dnd.com",
                role: storedRole,
            } as IUser);
        }
        setLoading(false);
    }, []);

    const login = async (formData: any) => {
        const res = await api.post("/auth/login", formData);

        const newToken = res.data.token;
        const newUser = res.data.user; // Le backend renvoie déjà un objet correspondant à IUser

        setToken(newToken);
        setUser(newUser);

        localStorage.setItem("token", newToken);
        localStorage.setItem("userRole", newUser.role);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return context;
};
