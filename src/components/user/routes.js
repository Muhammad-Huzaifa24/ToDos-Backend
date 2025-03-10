import { Router } from "express";
import { signUp, login } from "./controller.js";

const router = Router();

router.post("/login", login); // get all items based on filter
router.post("/signUp", signUp);


export {router};