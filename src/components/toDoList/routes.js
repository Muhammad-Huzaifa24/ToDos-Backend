import { Router } from "express";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js"

const router = Router();

router.post("/get-todos", authMiddleware, getTodos); // get all items based on filter
router.post("/todos", authMiddleware, createTodo);
router.put("/todos/:id", authMiddleware, updateTodo);
router.delete("/todos/:id", authMiddleware, deleteTodo);

export { router };