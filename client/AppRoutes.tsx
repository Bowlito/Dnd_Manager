import { Routes, Route } from "react-router-dom";
import MainLayout from "./src/components/layout/MainLayout"; // Import du Layout

// Pages

import Dashboard from "./src/pages/Dashboard";
import PlayerDex from "./src/pages/characters/PlayerDex";
import CharacterCreate from "./src/pages/characters/CharacterCreate";
import CharacterSheet from "./src/pages/characters/CharacterSheet";
import Bestiary from "./src/pages/monsters/Bestiary";
import MonsterSheet from "./src/pages/monsters/MonsterSheet";
import Login from "./src/pages/Auth/Login";
import { ProtectedRoute } from "./src/components/layout/ProtectedRoute";

// Placeholders pour les futures pages

const NPCs = () => <div className="text-white">🚧 PNJ en construction</div>;

const AppRoutes = () => {
    return (
        <Routes>
            {/* Route parente avec le Layout */}
            <Route element={<MainLayout />}>
                {/* 1. La Table de Jeu (Accueil) */}
                <Route path="/" element={<Dashboard />} />

                {/* 2. L'authentification */}
                <Route path="login" element={<Login />} />
                {/* 3. Les Répertoires */}
                <Route path="/playerdex" element={<PlayerDex />} />
                <Route path="/bestiary" element={<Bestiary />} />
                <Route path="/npcs" element={<NPCs />} />

                {/* 4. Actions Spécifiques */}
                {/* Note : On garde la création et la fiche DANS le layout, ou on les sort ? 
            Souvent, on préfère les garder DANS le layout pour avoir le menu. */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/create" element={<CharacterCreate />} />
                </Route>
                <Route path="/character/:id" element={<CharacterSheet />} />
                <Route path="/monster/:id" element={<MonsterSheet />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
