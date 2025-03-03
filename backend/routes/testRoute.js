import express from "express";

import { getTest } from "../controllers/getTest.js";

const router = express.Router();

router.get("/", getTest);

export default router;
