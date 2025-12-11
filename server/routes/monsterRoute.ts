import express from "express";
import * as monsterController from "../controllers/monsterController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", monsterController.getMonsters);
router.get("/:id", monsterController.getMonsterById);
router.patch("/:id", protect, monsterController.updateMonster);
router.post("/:id/instance", protect, monsterController.createInstance);
router.delete('/:id',protect, monsterController.deleteMonster);

export default router;
