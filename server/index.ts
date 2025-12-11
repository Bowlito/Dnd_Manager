import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import characterRoutes from "./routes/characterRoute.js";
import optionsRoutes from "./routes/optionsRoute.js";
import monsterRoutes from "./routes/monsterRoute.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API du Maître du jeu en ligne ! 🐉");
});

app.use("/api/characters", characterRoutes);
app.use("/api/options", optionsRoutes);
app.use("/api/monsters", monsterRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
