import prisma from "../../../shared/prisma";
import {
    EVENT_NOTIFICATION,
    getReciverSocketId,
    getSocketInstance,
} from "../../socket/socketHandler";
import {INotification} from "./notification.interface";
import ApiError from "../../../errors/ApiErrors";

const createNotification = async (payload: INotification) => {
    const io = getSocketInstance();

    const notification = await prisma.notification.create({
        data: {
            userId: payload.userId,
            message: payload.message,
            link: payload.link,
        },
    });

    if (!notification){
        throw new ApiError(404, "Notification not found");
    }



    const socketId = getReciverSocketId(payload.userId);

    if (socketId) {
        console.log(
            `Sending notification to socket ID: ${socketId} for id: ${payload.userId}`
        );

        io.to(socketId).emit(EVENT_NOTIFICATION, notification);
        console.log(notification?.message)
    }

    return notification;
};

const getNotification = async (userId: string) => {

    const notifications = await prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return notifications;
}

const updateNotificationStatus = async (userId: string, notId: string, isRead: boolean) => {

    const notifications = await prisma.notification.findUnique({
        where: {
            id: notId,
        },
    });

    if (!notifications) {
        throw new ApiError(404, "Notification not found");
    }

    const updateNot = await prisma.notification.update({
        where: {
            userId,
            id: notifications.id
        },
        data: {
            isRead,
        },
    });


    return updateNot;
}

const updateAllNotificationStatus = async (userId: string, isRead: boolean) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const updateNot = await prisma.notification.updateMany({
        where: {
            userId,
        },
        data: {
            isRead,
        },
    });


    return updateNot;
}

const deleteNotificationStatus = async (userId: string, notId: string) => {

    const notifications = await prisma.notification.findUnique({
        where: {
            id: notId,
        },
    });

    if (!notifications) {
        throw new ApiError(404, "Notification not found");
    }

    const updateNot = await prisma.notification.delete({
        where: {
            userId,
            id: notifications.id
        }
    });


    return updateNot;
}


// resetpass
// get notification by userId
// update the status
// update all the status
// delete notification

export const NotificationService = {
    createNotification,
    getNotification,
    updateNotificationStatus,
    updateAllNotificationStatus,
    deleteNotificationStatus
};
