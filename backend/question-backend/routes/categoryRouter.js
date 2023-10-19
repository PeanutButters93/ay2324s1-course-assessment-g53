import express from "express";

import { checkLogin } from "../middleware/checkLogin.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

import { getCategories } from "../controller/getCategories.js";
import { addCategory } from "../controller/addCategory.js";
import { deleteCategory } from "../controller/deleteCategory.js";
import { updateCategory } from "../controller/updateCategory.js";

const router = express.Router();

router.get("/", [checkLogin], getCategories);
router.post("/", [checkLogin, checkAdmin], addCategory);
router.put("/", [checkLogin, checkAdmin], updateCategory);
router.delete("/:id", [checkLogin, checkAdmin], deleteCategory);

export default router;
