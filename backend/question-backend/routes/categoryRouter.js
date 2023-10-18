import express from "express";

import { getCategories } from "../controller/getCategories.js";

const router = express.Router();

router.get("/", getCategories);

export default router;
