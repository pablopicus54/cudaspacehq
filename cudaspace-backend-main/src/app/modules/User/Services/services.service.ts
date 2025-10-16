import ApiError from "../../../../errors/ApiErrors";
import prisma from "../../../../shared/prisma";
import httpStatus from "http-status";
import {ICart} from "./service.interface";
import {PackageType, UserRole} from "@prisma/client";
import {paginationHelpers} from "../../../../helpars/paginationHelper";
import {NotificationService} from "../../Notification/notification.service";
import config from "../../../../config";

const createUserService = async (serviceData: ICart) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: serviceData.userId,
        },
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not exist");
    }

    const isPackageExist = await prisma.package.findUnique({
        where: {
            id: serviceData.packageId,
        },
    });

    if (!isPackageExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
    }

    const service = await prisma.userServices.create({
        data: {
            ...serviceData,
        },
    });

    return service;
};

const getDashBoardCards = async (userId: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const activeServer = await prisma.order.count({
        where: {
            userId,
            status: "Running",
        },
    });

    const pendingOrder = await prisma.order.count({
        where: {
            userId,
            status: "Pending",
        },
    });

    const totalInvest = await prisma.packagePaymentForUser.findMany({
        where: {
            userId,
        },
    });
    const total = totalInvest.reduce((sum, transaction) => {
        return sum + transaction.amount; // Convert string to float
    }, 0);

    return {
        activeServer,
        pendingOrder,
        total,
    };
};

const getAllServers = async (userId: string, filters: {
    page: number,
    limit: number,
    packageType: PackageType
}) => {

    const {page, limit, skip} = paginationHelpers.calculatePagination(filters);

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const whereCondition: any = {
        userId,
        package: {
            packageType: filters.packageType
        },
    };

    const total = await prisma.order.count({where: whereCondition});

    let allServers = await prisma.order.findMany({
        where: whereCondition,

        orderBy: {createdAt: 'desc'},
        select: {
            id: true,
            orderId: true,
            status: true,
            amount: true,
            package: {
                select: {
                    id: true,
                    serviceName: true,
                }
            },
            PackageCredentials: {
                select: {
                    loginName: true
                }
            }
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
        data: allServers,
    };
}


const getAllOrders = async (
    userId: string,
    filters: {
        page: number;
        limit: number;
    }
) => {
    const {page, limit, skip} = paginationHelpers.calculatePagination(filters);

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const whereCondition: any = {
        userId,
    };

    const total = await prisma.order.count({where: whereCondition});

    let allServers = await prisma.order.findMany({
        where: whereCondition,

        orderBy: {createdAt: "desc"},
        select: {
            id: true,
            orderId: true,
            status: true,
            amount: true,
            invoiceUrl: true,
            createdAt: true,
            package: {
                select: {
                    id: true,
                },
            },
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
        data: allServers,
    };
};

const getOrderById = async (userId: string, orderId: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const order = await prisma.order.findUnique({
        where: {
            userId,
            id: orderId,
        },
        include: {
            package: true,
        },
    });

    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    // Try to enrich with currentPeriodEnd from UserPerchasedPackage (Stripe/Crypto)
    let currentPeriodEnd: Date | null = null;
    try {
        const orClauses: any[] = [];
        if (order.stripeSubId) {
            orClauses.push({ stripeSubId: order.stripeSubId });
        }
        if (order.cryptoSubId) {
            orClauses.push({ cryptoSubId: order.cryptoSubId });
        }

        if (orClauses.length > 0) {
            const upp = await prisma.userPerchasedPackage.findFirst({
                where: {
                    userId,
                    OR: orClauses,
                },
                select: {
                    currentPeriodEnd: true,
                },
            });
            currentPeriodEnd = upp?.currentPeriodEnd ?? null;
        }
    } catch (e) {
        // Non-blocking enrichment; if it fails, continue without period end
        currentPeriodEnd = null;
    }

    const enriched = {
        ...order,
        currentPeriodEnd,
    } as typeof order & { currentPeriodEnd: Date | null };

    return enriched;
};

const getMyPurchasedPackage = async (userId: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const myPurchasedPackage = await prisma.userPerchasedPackage.findMany({
        where: {
            userId,
        },
        select: {
            package: true,
        },
    });

    return myPurchasedPackage;
};

const getPackageCredentials = async (userId: string, orderId: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const credentials = await prisma.packageCredentials.findUnique({
        where: {
            userId,
            orderId,
        },
        select: {
            id: true,
            orderId: true,
            primaryIp: true,
            loginPassword: true,
            accessPort: true,
            loginName: true,
            operatingSystem: true,
        },
    });
    if (!credentials) {
        throw new ApiError(httpStatus.NOT_FOUND, "Credentials not found");
    }

    return credentials;
};

const getServerCurrentStatus = async (userId: string, id: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const credentials = await prisma.packageCredentials.findUnique({
        where: {
            id,
            userId,
        },
    });
    if (!credentials) {
        throw new ApiError(httpStatus.NOT_FOUND, "Credentials not found");
    }
    const order = await prisma.order.findUnique({
        where: {
            id: credentials.orderId,
            userId,
        },
        select: {
            id: true,
            package: {
                select: {
                    serviceName: true,
                },
            },
            status: true,
        },
    });
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    // const userPurchasedPackage = await prisma.userPerchasedPackage.findUnique({
    //   where: {
    //     stripeSubId: order.stripeSubId as string,
    //     userId,
    //   },
    //   select: {
    //     id: true,
    //     package: {
    //       select: {
    //         serviceName: true,
    //       },
    //     },
    //     status: true,
    //   },
    // });

    // const purchasePackageWithCredId = {
    //   ...userPurchasedPackage,
    //   credentialId: credentials.id,
    // };

    return order;
};

const setResetPasswordNotification = async (
    userId: string,
    orderId: string,
    issueType: string
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            package: {
                select: {
                    serviceName: true,
                },
            },
        },
    });
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const adminId = await prisma.user.findFirst({
        where: {
            role: UserRole.ADMIN,
        },
    });

    if (!adminId) {
        throw new ApiError(404, "Admin not found");
    }

    if (!issueType) {
        throw new ApiError(404, "Issue type is not provided");
    }

    let notificationData;
    let link

    if (issueType === "restart") {
        link = `${config.frontend_url}/dashboard/pending-task`;
        notificationData = {
            userId: adminId.id,
            message: `User with id ${user.id} wants to restart his server`,
            link: link,
        };
    } else if (issueType === "stop") {
        link = `${config.frontend_url}/dashboard/pending-task`;
        notificationData = {
            userId: adminId.id,
            message: `User with id ${user.id} wants to stop his server`,
            link: link,
        };
    } else {
        link = `${config.frontend_url}/dashboard/manage-orders?id=${order.id}`;
        const pendingTask = await prisma.pendingTask.findFirst({
            where: {
                userId: order.userId,
                orderId,
                issueType: "resetPass",
                isResolved: false,
            },
        });

        if (pendingTask) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                "Request for changing password is already in processing"
            );
        }

        notificationData = {
            userId: adminId.id,
            message: `User with id ${user.id} wants to change his password`,
            link: link,
        };
    }

    await NotificationService.createNotification(notificationData);

    const getCred = await prisma.packageCredentials.findUnique({
        where: {
            orderId,
        },
    });

    if (!getCred) {
        throw new ApiError(404, "Admin not found");
    }

    await prisma.pendingTask.create({
        data: {
            userId: userId,
            issueType: issueType,
            link: link,
            packageName: order?.package?.serviceName as string,
            primaryIp: getCred?.primaryIp,
            loginPassword: getCred?.loginPassword,
            loginName: getCred?.loginName as string,
            orderId: order.id,
        },
    });
};

const updateHostname = async (
    userId: string,
    orderId: string,
    userName: string,
) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId, userId },
        select: { id: true },
    });
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    const updated = await prisma.order.update({
        where: { id: orderId },
        data: { userName },
        select: {
            id: true,
            userName: true,
        },
    });

    return updated;
};

export const UserService = {
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
