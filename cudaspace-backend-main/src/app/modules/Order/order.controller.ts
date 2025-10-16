import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { OrderService } from "./order.service";
import { orderValidation, ExtendPeriodEndSchema } from "./order.validation";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const data = {
    userId,
    ...req.body,
  };

  const validationResult = orderValidation.OrderSchema.safeParse(data);

  if (!validationResult.success) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Validation Error",
      errors: validationResult.error?.issues,
    });
  }



  const order = await OrderService.createOrder(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, paginationFields);

  const orders = await OrderService.getAllOrder(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieved all order successfully",
    data: orders,
  });
});


const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;

   const order = await OrderService.orderDelete(orderId as string)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete order successfully",
    data: order,
  });
})


const customerOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

   const order = await OrderService.customerOrder(userId as string)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrive order successfully",
    data: order,
  });
})

const adminOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const {orderId} = req.params;


  const orderDetails = await OrderService.adminOrderDetails(orderId)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrive order successfully",
    data: orderDetails,
  });
})

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const {status} = req.body;

  const orderDetails = await OrderService.updateOrderStatus(orderId, status)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status update successfully",
    data: orderDetails,
  });
})


const confirmOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;

   const order = await OrderService.confirmOrder(orderId as string, req.body)

   sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order confirm successfully",
    data: order,
  });
})

const extendPeriodEnd = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;

  const validationResult = ExtendPeriodEndSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Validation Error",
      errors: validationResult.error?.issues,
    });
  }

  const result = await OrderService.extendPeriodEnd(orderId, validationResult.data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription period updated successfully",
    data: result,
  });
});


export const OrderController = {
  createOrder,
  getAllOrder,
  deleteOrder,
  customerOrder,
  adminOrderDetails,
  updateOrderStatus,
  confirmOrder,
  extendPeriodEnd
};
