import express from "express";

import { getCategories } from "../controller/getCategories.js";
import { addCategory } from "../controller/addCategory.js";
import { deleteCategory } from "../controller/deleteCategory.js";
import { updateCategory } from "../controller/updateCategory.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.put("/", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
