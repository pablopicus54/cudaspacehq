import express from "express";
import { TestimonialController } from "./testimonial.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get('/', TestimonialController.getAllTestimonial);
router.post('/', auth(), TestimonialController.createTestimonial);
router.delete('/:id',auth(UserRole.ADMIN), TestimonialController.deleteTestimonial);
router.patch('/:id',auth(UserRole.ADMIN), TestimonialController.approvedTestimonial);

export const TestimonialRoutes = router;