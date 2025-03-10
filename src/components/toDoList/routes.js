import { Router } from "express";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./controller.js";

const router = Router();

router.post("/get-todos", getTodos); // get all items based on filter
router.post("/todos", createTodo);
router.put("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

export {router};