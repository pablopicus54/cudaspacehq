import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import ApiError from "../../../../errors/ApiErrors";
import config from "../../../../config";
import pick from "../../../../shared/pick";
import { paginationFields } from "../../../../constants/pagination";
import { UserService } from "./services.service";
import { PackageType } from "@prisma/client";

const createUserService = catchAsync(async (req: Request, res: Response) => {
  const userService = await UserService.createUserService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Testimonial created successfully",
    data: userService,
  });
});

const getDashBoardCards = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const userService = await UserService.getDashBoardCards(userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Cards fetched successfully",
    data: userService,
  });
});

const getAllServers = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const filters = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    packageType: req.query.packageType as PackageType,
  };

  const userService = await UserService.getAllServers(userId, filters);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Server fetched successfully",
    data: userService,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const filters = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  };

  const userService = await UserService.getAllOrders(userId, filters);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "orders fetched successfully",
    data: userService,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;

  const userService = await UserService.getOrderById(userId, orderId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order fetched successfully",
    data: userService,
  });
});

const getMyPurchasedPackage = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const userService = await UserService.getMyPurchasedPackage(userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "All purchased package fetched successfully",
      data: userService,
    });
  }
);

const getPackageCredentials = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const orderId = req.params.orderId;
    const result = await UserService.getPackageCredentials(userId, orderId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Credentials fetched successfully",
      data: result,
    });
  }
);

const getServerCurrentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const id = req.params.id;
    const result = await UserService.getServerCurrentStatus(userId, id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Server current status fetched successfully",
      data: result,
    });
  }
);

const setResetPasswordNotification = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const orderId = req.params.orderId;
    const issueType = req.body.issueType;
    const result = await UserService.setResetPasswordNotification(
      userId,
      orderId,
      issueType
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Notification sends successfully",
      data: result,
    });
  }
);

const updateHostname = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;
  const { userName } = req.body as { userName: string };

  if (!userName || typeof userName !== 'string' || !userName.trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Hostname (userName) is required');
  }

  const result = await UserService.updateHostname(userId, orderId, userName.trim());

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Hostname updated successfully',
    data: result,
  });
});

export const UserServiceController = {
  createUserService,
  getDashBoardCards,
  getAllServers,
  getAllOrders,
  getMyPurchasedPackage,
  getOrderById,
  getPackageCredentials,
  getServerCurrentStatus,
  setResetPasswordNotification,
  updateHostname,
};
