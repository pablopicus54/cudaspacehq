import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";


const router = express.Router();

router.post('/', auth('USER'), OrderController.createOrder);
router.post("/confirm-order/:id", auth('ADMIN'), OrderController.confirmOrder);
router.get('/', auth('ADMIN'), OrderController.getAllOrder);
router.get("/details-order/:orderId",auth('ADMIN'), OrderController.adminOrderDetails);
router.get('/customer-order', auth('USER'), OrderController.customerOrder);
router.patch("/update-order-status/:id",auth('ADMIN'), OrderController.updateOrderStatus);
router.patch("/extend-period-end/:id", auth('ADMIN'), OrderController.extendPeriodEnd);
router.delete('/:id',auth('ADMIN'), OrderController.deleteOrder);

export const OrderRoutes = router;