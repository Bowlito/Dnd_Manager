import axios from "axios";

// 1. Ta configuration existante (on garde tout)
const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 2. L'Intercepteur (L'ajout nécessaire pour l'Auth)
api.interceptors.request.use(
    (config) => {
        // On regarde dans la poche du navigateur s'il y a un badge
        const token = localStorage.getItem("token");

        // S'il y a un token, on l'agrafe à la requête
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
