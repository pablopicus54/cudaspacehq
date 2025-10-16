import {PackageType, Prisma, UserRole, UserStatus} from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import {IPaginationOptions} from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import {paginationHelpers} from "../../../helpars/paginationHelper";
import config from "../../../config";
import {NotificationService} from "../Notification/notification.service";

const getAllUsers = async (
    filters: { searchTerm?: string },
    options: IPaginationOptions
) => {
    const {searchTerm} = filters;
    const {page, skip, limit, sortBy, sortOrder} =
        paginationHelpers.calculatePagination(options);

    const andConditions = [];

    andConditions.push({
        role: UserRole.USER,
    });

    if (searchTerm) {
        andConditions.push({
            OR: ["name", "email"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    // Fetch users and include the related userServices to calculate the service count
    const users = await prisma.user.findMany({
        where: {
            ...whereConditions,
        },
        skip,
        take: limit,
        orderBy:
            sortBy && sortOrder
                ? {[sortBy]: sortOrder}
                : {
                    createdAt: "desc",
                },

        include: {
            userServices: true,
        },
    });

    // Calculate the number of services for each user
    const usersWithServiceCount = users.map((user) => ({
        ...user,
        services: user.userServices.length, // Count the number of services associated with the user
    }));

    // Get total count for pagination
    const total = await prisma.user.count({
        where: {
            ...whereConditions,
        },
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: usersWithServiceCount,
    };
};

const userManagement = async (id: string, userStatus: UserStatus) => {
    const existUser = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!existUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const updateStatus = await prisma.user.update({
        where: {
            id,
        },
        data: {
            status: userStatus,
        },
    });

    return {
        updateStatus,
    };
};

const userService = async (userId: string) => {
    const isExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            name: true,
            email: true,
            status: true,
        },
    });

    const userService = await prisma.userPerchasedPackage.findMany({
        where: {
            userId,
        },
        select: {
            package: {
                select: {
                    serviceName: true,
                    serviceDetails: true,
                },
            },
        },
    });

    const serviceUses = await prisma.userPerchasedPackage.count({
        where: {
            userId,
        },
    });

    return {
        user,
        serviceUses,
        userService,
    };
};

const getDashBoardCardsForAdmin = async () => {
    const totalUser = await prisma.user.count({
        where: {
            role: {notIn: [UserRole.ADMIN]},
        },
    });

    const activeServer = await prisma.order.count({
        where: {
            status: "Running",
        },
    });

    const totalInvest = await prisma.packagePaymentForUser.findMany();

    const total = totalInvest.reduce((sum, transaction) => {
        return sum + transaction.amount; // Convert string to float
    }, 0);

    const pendingTickets = await prisma.contact.count({
        where: {
            status: "Pending",
        },
    });

    return {
        totalUser,
        activeServer,
        total,
        pendingTickets,
    };
};

const getPendingTask = async (filter: { page: number; limit: number }) => {
    const {page, limit, skip} = paginationHelpers.calculatePagination(filter);

    const total = await prisma.pendingTask.count({
        where: {isResolved: false},
    });

    const challenges = await prisma.pendingTask.findMany({
        orderBy: {createdAt: "desc"},
        where: {isResolved: false},
        select: {
            id: true,
            issueType: true,
            link: true,
            packageName: true,
            primaryIp: true,
            loginPassword: true,
            loginName: true,
            isResolved: true,
            userId: true,
        },
        skip,
        take: limit,
    });

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: challenges,
    };
};

const confirmRestartOrStop = async (pendingTaskId: string) => {
    const isPendingTaskExits = await prisma.pendingTask.findUnique({
        where: {
            id: pendingTaskId,
        },
    });

    if (!isPendingTaskExits) {
        throw new ApiError(httpStatus.NOT_FOUND, "Pending task not found");
    }

    const isOrderExits = await prisma.order.findUnique({
        where: {
            id: isPendingTaskExits.orderId,
        },
        include: {
            package: {
                select: {
                    id: true,
                    serviceName: true,
                    packageType: true,
                },
            },
        },
    });

    if (!isOrderExits) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    await prisma.pendingTask.update({
        where: {
            id: pendingTaskId,
        },
        data: {
            isResolved: true,
        },
    });

    let serverName;
    if (isOrderExits.package?.packageType === PackageType.GPU_HOSTING) {
        serverName = "gpu-servers";
    }
    if (isOrderExits.package?.packageType === PackageType.VPS_HOSTING) {
        serverName = "virtual-servers";
    }

    if (isOrderExits.package?.packageType === PackageType.DEDICATED_SERVER) {
        serverName = "dedicated-servers";
    }

    let notificationData;

    if (isPendingTaskExits.issueType === "restart") {
        notificationData = {
            userId: isPendingTaskExits.userId as string,
            message: `Your server with ID ${isOrderExits.package?.id} has been restarted.`,
            // http://localhost:3001/user/virtual-servers/overview?serverId=682d5de73990122f13e34d29&tab=management
            link: `${config.frontend_url}/user/${serverName}/overview?serverId=${isOrderExits.id}&tab=management`,
        };
    } else if (isPendingTaskExits.issueType === "stop") {
        await prisma.order.update({
            where: {
                id: isOrderExits.id,
            },
            data: {
                status: "Stopped",
            },
        });

        notificationData = {
            userId: isPendingTaskExits.userId as string,
            message: `Your server with ID ${isOrderExits.package?.id} has been stopped.`,
            link: `${config.frontend_url}/user/${serverName}/overview?serverId=${isOrderExits.id}&tab=management`,
        };
    } else {
        return;
    }

    await NotificationService.createNotification(notificationData);

    return {
        issueType: isPendingTaskExits.issueType,
    };
};

export const AdminService = {
    userManagement,
    getAllUsers,
    userService,
    getDashBoardCardsForAdmin,
    getPendingTask,
    confirmRestartOrStop,
    updateSuperAdminEmail: async (newEmail: string) => {
        if (!newEmail) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
        }

        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email: newEmail },
        });

        if (existing) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Email already in use");
        }

        // Find the current super admin (first ADMIN user)
        const superAdmin = await prisma.user.findFirst({
            where: { role: UserRole.ADMIN },
        });

        if (!superAdmin) {
            throw new ApiError(httpStatus.NOT_FOUND, "Super admin not found");
        }

        const updated = await prisma.user.update({
            where: { id: superAdmin.id },
            data: { email: newEmail },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                number: true,
            },
        });

        return { updated };
    },
};
