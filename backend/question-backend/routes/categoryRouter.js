import express from "express";

import { getCategories } from "../controller/getCategories.js";
import { addCategory } from "../controller/addCategory.js";
import { deleteCategory } from "../controller/deleteCategory.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);

export default router;
