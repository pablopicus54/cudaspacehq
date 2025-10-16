import express from "express";
import auth from "../../middlewares/auth";
import {NotificationController} from "./notification.controller";


const router = express.Router();


router.get('/get-notification', auth(), NotificationController.getNotification);
router.put('/update-notification', auth(), NotificationController.updateNotificationStatus);
router.put('/update-all-notification', auth(), NotificationController.updateAllNotificationStatus);
router.delete('/delete-notification', auth(), NotificationController.deleteNotificationStatus);


export const NotificationRoutes = router;