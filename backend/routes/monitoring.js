import express from "express";
import { getMonitoringData } from "../controllers/Monitoring.js";

const router = express.Router();

router.get("/", getMonitoringData);

export default router;