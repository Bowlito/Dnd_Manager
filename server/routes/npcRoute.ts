import express from "express";
import * as npcController from "../controllers/npcController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", npcController.getNpcs);
router.get("/:id", npcController.getNpcById);
router.post("/", protect, npcController.createNpc);
router.patch("/:id", protect, npcController.updateNpc);
router.delete("/:id", protect, npcController.deleteNpc);

export default router;
