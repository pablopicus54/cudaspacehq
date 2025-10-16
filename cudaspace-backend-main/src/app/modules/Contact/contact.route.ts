import express from "express";
import { ContactController } from "./conract.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get('/', auth(UserRole.ADMIN), ContactController.getAllContact);

router.post('/', ContactController.createContact);

router.delete("/:id", auth(UserRole.ADMIN), ContactController.deleteContact);

export const ContactRoutes = router;