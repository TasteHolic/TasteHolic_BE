import express from "express";
import myBarRoutes from "./mybar.js";

const router = express.Router();

// 공통 API 경로 `/api/v1`
router.use("/users/my-bar", myBarRoutes);

export default router;
