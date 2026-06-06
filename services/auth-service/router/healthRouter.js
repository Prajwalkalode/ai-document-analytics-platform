import express from "express";
import { health } from "../controller/healthController.js";

const router = express.Router();

router.get("/health", health);

export default router;