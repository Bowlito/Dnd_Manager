import express from "express";
import * as optionsController from "../controllers/optionsController.js";

const router = express.Router();

router.get("/races", optionsController.getRaces);
router.get("/classes", optionsController.getClasses);

export default router;
