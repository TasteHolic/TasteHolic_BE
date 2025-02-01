import express from "express";
import {
  handleMyBarPost,
  handleMyBarGet,
  handleMyBarDelete,
} from "../controllers/mybar.controller.js";

const router = express.Router();

router.post("/post", handleMyBarPost);
router.get("/view", handleMyBarGet);
router.delete("/delete/:barId", handleMyBarDelete);

export default router;
