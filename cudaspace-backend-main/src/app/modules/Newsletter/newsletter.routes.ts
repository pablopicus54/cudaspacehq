import express from "express";
import { NewsletterController } from "./newsletter.controller";

const router = express.Router();

router.post('/', NewsletterController.createNewsletter)

export const NewsletterRoutes = router;