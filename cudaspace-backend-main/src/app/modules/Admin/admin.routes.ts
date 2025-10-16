import express from "express";
import multer from "multer";
import { createStorage } from "../../../helpars/fileUploader";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/get-all-user", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.patch(
  "/update-user-status/:id",
  auth(UserRole.ADMIN),
  AdminController.userManagement
);
router.get(
  "/user-service/:id",
  auth(UserRole.ADMIN),
  AdminController.userService
);
router.get(
  "/get-all-pending-task",
  auth(UserRole.ADMIN),
  AdminController.getPendingTask
);
router.get(
  "/get-admin-dashboard-cards",
  auth(UserRole.ADMIN),
  AdminController.getDashBoardCardsForAdmin
);

router.post(
  "/confirm-restart-or-stop/:pendingTaskId",
  auth(UserRole.ADMIN),
  AdminController.confirmRestartOrStop
);

router.patch(
  "/update-superadmin-email",
  auth(UserRole.ADMIN),
  AdminController.updateSuperAdminEmail
);

export const AdminRoutes = router;
