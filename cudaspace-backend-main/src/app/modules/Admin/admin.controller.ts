import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { AdminService } from "./admin.service";

const userManagement = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const { userStatus } = req.body;

  const updateStatus = await AdminService.userManagement(id, userStatus);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update user status successfully",
    data: updateStatus,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, paginationFields);

  const blogs = await AdminService.getAllUsers(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: blogs,
  });
});

const userService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedUser = await AdminService.userService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrive user services sucessfull",
    data: updatedUser,
  });
});

const getDashBoardCardsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const updatedUser = await AdminService.getDashBoardCardsForAdmin();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Retrieve admin dashboard cards successfully",
      data: updatedUser,
    });
  }
);

const getPendingTask = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };

  const updatedUser = await AdminService.getPendingTask(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieve all pending tasks successfully",
    data: updatedUser,
  });
});

const confirmRestartOrStop = catchAsync(async (req: Request, res: Response) => {
  const pendingTaskId = req.params.pendingTaskId;

  const result = await AdminService.confirmRestartOrStop(pendingTaskId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Server successfully ${
      result?.issueType === "restart" ? "restarted" : "stopped"
    }`,
    data: null,
  });
});

export const AdminController = {
  userManagement,
  getAllUsers,
  userService,
  getDashBoardCardsForAdmin,
  getPendingTask,
  confirmRestartOrStop,
  updateSuperAdminEmail: catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };

    const result = await AdminService.updateSuperAdminEmail(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Super admin email updated successfully",
      data: result,
    });
  })
};
