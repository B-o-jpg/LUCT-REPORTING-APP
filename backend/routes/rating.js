import express from "express";
import { getRatings } from "../controllers/Rating.js";

const router = express.Router();

router.get("/", getRatings);

export default router;