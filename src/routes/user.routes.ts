import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../index";
import jwt from "jsonwebtoken";
import { userSchema } from "../validators/userValidation";
import { SALT } from "../constants/constants";
import { handleUser } from "../controllers/users.controllers";
const router: Router = express.Router();

router.post("/", handleUser);

export default router;
