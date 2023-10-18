import express from "express";

import { getCategories } from "../controller/getCategories.js";
import { addCategory } from "../controller/addCategory.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);

export default router;
