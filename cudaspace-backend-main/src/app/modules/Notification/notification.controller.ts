import {Request, Response} from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {NotificationService} from "./notification.service";

const getNotification = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user.id;

    const orders = await NotificationService.getNotification(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrieved all user notification successfully",
        data: orders,
    });
});

const updateNotificationStatus = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user.id;
    const isRead = req.body.isRead;
    const notId = req.body.notId;

    const orders = await NotificationService.updateNotificationStatus(userId, notId, isRead);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Notification status updated successfully",
        data: orders,
    });
});

const updateAllNotificationStatus = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user.id;
    const isRead = req.body.isRead;

    const orders = await NotificationService.updateAllNotificationStatus(userId, isRead);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Notifications status updated successfully",
        data: orders,
    });
});


const deleteNotificationStatus = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user.id;
    const notId = req.body.notId;

    const orders = await NotificationService.deleteNotificationStatus(userId, notId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrieved all user notification successfully",
        data: orders,
    });
});

export const NotificationController = {
    getNotification,
    updateNotificationStatus,
    updateAllNotificationStatus,
    deleteNotificationStatus
};