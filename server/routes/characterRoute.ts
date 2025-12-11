import express, { Request, Response } from 'express';
import * as characterController from "../controllers/characterController"
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post("/", protect, characterController.createCharacter);
router.get("/", characterController.getCharacters);
router.get("/:id", characterController.getCharacterById);
router.patch("/:id", protect, characterController.updateCharacter)
router.delete("/:id", protect, characterController.deleteCharacter)

export default router
