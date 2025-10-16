import ApiError from "../../../errors/ApiErrors";
import {IPaginationOptions} from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import {paginationHelpers} from "../../../helpars/paginationHelper";
import {IOrder} from "./order.validation";
import {generateOrderId} from "../../../helpars/generateUniqueId";
import {IPackageCredentials} from "./order.interface";
import {NotificationService} from "../Notification/notification.service";
import config from "../../../config";
import fs from "fs";
import { generateInvoiceForOrder } from "../../../helpars/invoice/generateInvoice";
import emailSender from "../../../helpars/emailSender/emailSender";
import buildPackageDeliveredEmail from "../../../helpars/emailSender/templates/packageDelivered";
import { IExtendPeriodEnd } from "./order.validation";

const createOrder = async (orderData: Omit<IOrder, "orderId">) => {
    const order = await prisma.order.create({
        data: {
            orderId: generateOrderId(),
            ...orderData,
        },
    });

    return order;
};

const getAllOrder = async (
    filters: {
        searchTerm?: string;
    },
    options: IPaginationOptions
) => {
    const {searchTerm} = filters;
    const {page, skip, limit, sortBy, sortOrder} =
        paginationHelpers.calculatePagination(options);

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: ["orderId"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

    const blogs = await prisma.order.findMany({
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
            user: {
                select: {
                    name: true,
                },
            },
            package: {
                select: {
                    packageType: true,
                },
            },
        },
    });

    // Enrich orders with currentPeriodEnd from UserPerchasedPackage (Stripe/Crypto) and ensure billingCycle is present
    type OrderWithRelationsBasic = {
        stripeSubId?: string | null;
        cryptoSubId?: string | null;
        billingCycle?: any;
        package?: { packageType?: string | null; serviceName?: string | null } | null;
        user?: { name?: string | null } | null;
    } & Record<string, any>;

    const enrichedOrders = await Promise.all(
        blogs.map(async (order: OrderWithRelationsBasic) => {
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
                        where: { OR: orClauses },
                        select: { currentPeriodEnd: true },
                    });
                    currentPeriodEnd = upp?.currentPeriodEnd ?? null;
                }
            } catch (e) {
                currentPeriodEnd = null; // non-blocking enrichment
            }

            return {
                ...order,
                // billingCycle is already on order model, keep it exposed
                billingCycle: order.billingCycle,
                currentPeriodEnd,
            };
        })
    );

    const total = await prisma.order.count({
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
        data: enrichedOrders,
    };
};

const orderDelete = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    await prisma.order.delete({
        where: {
            id: orderId,
        },
    });
};

const customerOrder = async (userId: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const order = await prisma.order.findMany({
        where: {
            userId,
        },
    });

    return {
        order,
    };
};

const adminOrderDetails = async (orderId: string) => {
    const orderExist = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!orderExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    const OldOrder = await prisma.order.findUnique({
        where: {
            id: orderExist.id,
        },
        select: {
            id:true,
            createdAt: true,
            amount: true,
            orderId: true,
            operatingSystem: true,
            rootPassword: true,
            userName: true,
            user: {
                select: {
                    name: true,
                    number: true,
                },
            },
            package: {
                select: {
                    serviceName: true,
                    packageType: true,
                    serviceDetails: true,
                },
            },
        },
    });

    const packageCred = await prisma.packageCredentials.findFirst({
        where: {
            orderId:OldOrder?.id,
        },
        select: {
            primaryIp: true,
            accessPort: true,
        },
    })

    const order = {
        ...OldOrder,
        primaryIp: packageCred?.primaryIp,
        accessPort: packageCred?.accessPort,
    }

    return {
        order,
    };
};

const updateOrderStatus = async (orderId: string, status: string) => {
    const orderExist = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!orderExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    console.log(orderExist);

    const order = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status,
        },
    });

    // Automatically generate or repair invoice URL when order transitions to Running
    if (status === "Running") {
        try {
            const refreshed = await prisma.order.findUnique({
                where: { id: orderId },
                select: { invoiceUrl: true },
            });

            const localFile = `uploads/invoices/${orderId}.html`;
            const expectedUrl = `${config.backend_image_url}/invoices/${orderId}.html`;

            if (!refreshed?.invoiceUrl) {
                await generateInvoiceForOrder(orderId);
            } else if (refreshed.invoiceUrl !== expectedUrl) {
                // If the invoice exists locally, repair the URL; otherwise regenerate
                if (fs.existsSync(localFile)) {
                    await prisma.order.update({
                        where: { id: orderId },
                        data: { invoiceUrl: expectedUrl },
                    });
                } else {
                    await generateInvoiceForOrder(orderId);
                }
            }
        } catch (e) {
            // Do not block status update on invoice generation errors
            console.error('Invoice generation failed during status update', orderId, e);
        }
    }

    return order;
};

const confirmOrder = async (orderId: string, creds: IPackageCredentials) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            package: {
                select: {
                    packageType: true,
                    serviceName: true,
                },
            },
        },
    });

    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    if (!order.userId) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order user not found");
    }

    if (!order.packageId) {
        throw new ApiError(httpStatus.NOT_FOUND, "Oder package not found");
    }

    const packageCredentials = await prisma.packageCredentials.upsert({
        where: {
            orderId: order.id, // uses the unique constraint on orderId
        },
        update: {
            // these fields will be updated if a record already exists
            primaryIp: creds.primaryIp,
            loginPassword: creds.loginPassword,
            accessPort: creds.accessPort,
            loginName: creds.loginName,
            operatingSystem: creds.operatingSystem,
            updatedAt: new Date(),
        },
        create: {
            // these fields will be used to create a new record if none exists
            orderId: order.id,
            userId: order.userId,
            packageId: order.packageId,
            primaryIp: creds.primaryIp,
            loginPassword: creds.loginPassword,
            accessPort: creds.accessPort,
            loginName: creds.loginName,
            operatingSystem: creds.operatingSystem,
        },
    });

    await prisma.order.update({
        where: {
            id: order.id,
        },
        data: {
            status: "Running",
        },
    });

    let serverName;
    if (order.package?.packageType === 'GPU_HOSTING') {
        serverName = "gpu-servers";
    }
    if (order.package?.packageType === 'VPS_HOSTING') {
        serverName = "virtual-servers";
    }

    if (order.package?.packageType === 'DEDICATED_SERVER') {
        serverName = "dedicated-servers";
    }

    let notificationData;

    if (creds.isCreate) {
        notificationData = {
            userId: order.userId,
            message: `Your order with ID ${order.orderId} has been delivered.`,
            link: `${config.frontend_url}/user/${serverName}/overview?serverId=${order.id}`,
        };

        // Send delivery email to user with overview link
        try {
            const user = await prisma.user.findUnique({
                where: { id: order.userId },
                select: { name: true, email: true },
            });

            if (user?.email) {
                const overviewUrl = `${config.frontend_url}/user/${serverName}/overview?serverId=${order.id}`;
                const html = buildPackageDeliveredEmail({
                    userName: user.name || undefined,
                    orderId: order.orderId,
                    packageName: order.package?.serviceName || undefined,
                    overviewUrl,
                });

                await emailSender("Your package is delivered", user.email, html);
            }
        } catch (e) {
            // Log and continue; email failures should not block delivery
            console.error("Failed to send delivery email for order", order.id, e);
        }
    } else {
        const pendingTask = await prisma.pendingTask.findFirst({
            where: {
                userId: order.userId,
                orderId,
                issueType: "resetPass",
                isResolved: false,
            },
        });

        if (!pendingTask) {
            throw new ApiError(httpStatus.NOT_FOUND, "Already changed the password");
        }

        await prisma.pendingTask.update({
            where: {
                id: pendingTask?.id,
            },
            data: {
                isResolved: true,
            },
        });

        notificationData = {
            userId: order.userId,
            message: `Your password has been successfully changed for order ID ${order.orderId}`,
            link: `${config.frontend_url}/user/${serverName}/overview?serverId=${order.id}`,
        };
    }

    await NotificationService.createNotification(notificationData);

    try {
        await generateInvoiceForOrder(order.id);
    } catch (e) {
        // swallow invoice generation errors; delivery proceeds
        console.error('Invoice generation failed for order', order.id, e);
    }

    return packageCredentials;
};

// Extend or set the subscription period end for the order's associated UserPerchasedPackage
const extendPeriodEnd = async (orderId: string, payload: IExtendPeriodEnd) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }

    const orClauses: any[] = [];
    if (order.stripeSubId) {
        orClauses.push({ stripeSubId: order.stripeSubId });
    }
    if (order.cryptoSubId) {
        orClauses.push({ cryptoSubId: order.cryptoSubId });
    }

    if (orClauses.length === 0) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Order has no linked subscription (stripeSubId/cryptoSubId)"
        );
    }

    const upp = await prisma.userPerchasedPackage.findFirst({
        where: { OR: orClauses },
        select: { id: true, currentPeriodEnd: true },
    });

    if (!upp) {
        throw new ApiError(httpStatus.NOT_FOUND, "Linked subscription not found");
    }

    let nextEnd: Date;
    if (payload.newEndDate) {
        nextEnd = new Date(payload.newEndDate);
        if (isNaN(nextEnd.getTime())) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid newEndDate");
        }
    } else if (payload.extendDays) {
        const base = upp.currentPeriodEnd && new Date(upp.currentPeriodEnd) > new Date()
            ? new Date(upp.currentPeriodEnd as Date)
            : new Date();
        nextEnd = new Date(base.getTime());
        nextEnd.setDate(nextEnd.getDate() + payload.extendDays);
    } else {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Provide either extendDays or newEndDate"
        );
    }

    const updated = await prisma.userPerchasedPackage.update({
        where: { id: upp.id },
        data: { currentPeriodEnd: nextEnd },
    });

    // Return updated end date along with order metadata for convenience
    return {
        orderId: order.orderId,
        subscriptionId: upp.id,
        currentPeriodEnd: updated.currentPeriodEnd,
    };
};

export const OrderService = {
    createOrder,
    getAllOrder,
    orderDelete,
    customerOrder,
    adminOrderDetails,
    updateOrderStatus,
    confirmOrder,
    extendPeriodEnd,
};
