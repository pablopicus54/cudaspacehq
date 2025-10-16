import express from "express";
import auth from "../../../middlewares/auth";
import { UserServiceController } from "./services.controller";


const router = express.Router();

router.post('/', auth(), UserServiceController.createUserService)
router.get('/dashboard-cards',auth(), UserServiceController.getDashBoardCards)
router.get('/get-all-servers',auth(), UserServiceController.getAllServers)
router.get('/get-all-orders',auth(), UserServiceController.getAllOrders)
router.get('/get-all-purchased-package',auth(), UserServiceController.getMyPurchasedPackage)
router.get('/get-single-order/:orderId',auth(), UserServiceController.getOrderById)
router.get('/get-credentials/:orderId',auth(), UserServiceController.getPackageCredentials)
router.get('/get-server-current-status/:id',auth(), UserServiceController.getServerCurrentStatus)
router.post('/send-reset-password-notification/:orderId',auth(), UserServiceController.setResetPasswordNotification)
router.patch('/update-hostname/:orderId', auth(), UserServiceController.updateHostname)

export const UserServiceRoutes = router;