import AppRoutes from "../AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="bg-[#0f172a] min-h-screen text-slate-200 font-sans">
                    <AppRoutes />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
