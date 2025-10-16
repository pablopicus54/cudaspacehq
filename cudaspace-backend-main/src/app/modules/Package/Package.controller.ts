import {Request, Response} from "express";
import axios from "axios";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import pick from "../../../shared/pick";
import {paginationFields} from "../../../constants/pagination";
import {PackageService} from "./Package.service";
import {packageValidation} from "./Package.validation";
import prisma from "../../../shared/prisma";

const createPackage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new ApiError(httpStatus.NOT_FOUND, "Please upload package image");
    }

    let packageImage = "";

    if (req.file) {
        packageImage = `${config.backend_image_url}/package/${req.file.filename}`;
    }

    const parseData = req.body.data && JSON.parse(req.body.data);

    const data = {
        packageImage,
        ...parseData,
    };

    const validationResult = packageValidation.PackageSchema.safeParse(data);

    if (!validationResult.success) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Validation Error",
            errors: validationResult.error.errors,
        });
    }

    const createPackage = await PackageService.createPackage(data);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Create package successfully",
        data: createPackage,
    });
});

const singlePackage = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const packageData = await PackageService.singlePackage(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrive package successfully",
        data: packageData,
    });
});


const deletePackage = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const packageData = await PackageService.deletePackage(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete package successfully",
        data: packageData,
    });
});


const getAllPackages = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["packageType", "promotional", "newArrivals"]);
    const options = pick(req.query, paginationFields);

    const packageData = await PackageService.getAllPackages(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrive all  packages successfully",
        data: packageData,
    });
});


const getUserPackages = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["packageType", "promotional", "newArrivals", "vpsType", "serverType", "serviceDetails"]);
    const options = pick(req.query, paginationFields);

    const packageData = await PackageService.getUserPackages(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Retrieved all packages successfully",
        data: packageData,
    });
});


const updatePackage = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    let packageImage = "";

    if (!id) {
        throw new ApiError(httpStatus.NOT_FOUND, "Package id not found");
    }

    const getPackage = await PackageService.singlePackage(id);

    if (!getPackage) {
        throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
    }

    if (req.file) {
        packageImage = `${config.backend_image_url}/package/${req.file.filename}`;
    }
    const fieldsToClear = {
        promotianal: false,
        vpsType: null,
        serverType: null,
        packageType: null,
    }

    const parseData = req.body.data && JSON.parse(req.body.data);

    const data = {
        packageImage,
        ...fieldsToClear,
        ...parseData
    }

    const packageData = await PackageService.updatePackage(id, getPackage,
        data);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Update package successfully",
        data: packageData,
    });
});


const updatePackageStatus = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;
    const {status} = req.body;

    const packageData = await PackageService.updatePackageStatus(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete package successfully",
        data: packageData,
    });
});


const purchasePackage = catchAsync(async (req: Request, res: Response) => {
    const id = req.user.id;
    const {packageId, paymentMethodId, billingCycle,userName, operatingSystem, rootPassword, orderId} = req.body;

    const packageData = await PackageService.purchasePackage(id, packageId, paymentMethodId, billingCycle,userName, operatingSystem, rootPassword, orderId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Purchased package successfully",
        data: packageData,
    });
});

const cancelPurchasePackage = catchAsync(async (req: Request, res: Response) => {
    const id = req.user.id;
    const {subscriptionId} = req.body;

    const packageData = await PackageService.cancelPurchasePackage(id, subscriptionId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Purchased package cancelled successfully",
        data: packageData,
    });
});

const cryptoSubscription = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const {planId, packageId, billingCycle, userName, operatingSystem, rootPassword, orderId} = req.body;

    const subscription = await PackageService.cryptoSubscription(userId, planId, packageId, billingCycle, userName, operatingSystem, rootPassword, orderId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "A payment link has been sent to your email. Please complete the payment to activate your package.",
        data: subscription,
    });
})


const getUserSunscription = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const subscriptionId = req.params.subscriptionId;

    console.log(userId, subscriptionId)

    const packageData = await PackageService.getUserSunscription(userId, subscriptionId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Retrive subscription suceess",
        data: packageData,
    });
})

// Return Stripe client side configuration (publishable key and mode)
const getStripeClientConfig = catchAsync(async (req: Request, res: Response) => {
    const publishableKey = config.stripe_publishable_key || "";
    // Infer mode from key prefix; default to 'test' if unknown
    const mode = publishableKey.includes("pk_live") ? "live" : "test";

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Stripe client config",
        data: {
            publishableKey,
            mode,
        },
    });
});

const allCryptoSubscriptions = catchAsync(async (req: Request, res: Response) => {


    const packageData = await PackageService.allCryptoSubscriptions();

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Retrive crypto subscription suceess",
        data: packageData,
    });
})


const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  // NOWPayments IPN webhook payload
  const event = req.body as any;

  // Common fields: payment_status, subscription_id, payment_id, id
  const subscriptionId = event?.subscription_id || event?.id || event?.payment_id;

  if (!subscriptionId) {
    // Accept the webhook but note missing identifier
    return res.status(200).json({ received: true, message: "No subscription id in webhook" });
  }

  try {
    // Fetch the latest subscription state from NOWPayments
    const { data } = await axios.get(
      `https://api.nowpayments.io/v1/subscriptions/${subscriptionId}`,
      {
        headers: {
          "x-api-key": `${process.env.NOWPAYMENTS_API_KEY}`,
        },
      }
    );

    const result = data?.result;

    if (!result) {
      return res.status(200).json({ received: true, message: "No subscription result returned" });
    }

    const newStatus = result.status; // e.g., finished, waiting, failed, confirmed
    const updatedAt = result.updated_at ? new Date(result.updated_at) : new Date();

    // Update user purchased package linked to this subscription
    await prisma.userPerchasedPackage.updateMany({
      where: { cryptoSubId: subscriptionId },
      data: { status: newStatus, updatedAt },
    });

    // If payment is successful, extend currentPeriodEnd according to billing cycle
    if (["finished", "confirmed"].includes(String(newStatus))) {
      const upp = await prisma.userPerchasedPackage.findFirst({
        where: { cryptoSubId: subscriptionId },
        select: {
          id: true,
          billingCycle: true,
          currentPeriodEnd: true,
        },
      });

      if (upp) {
        const addMonths = (date: Date, months: number) => {
          const d = new Date(date.getTime());
          const day = d.getDate();
          d.setMonth(d.getMonth() + months);
          // Adjust for month rollover (e.g., Jan 31 + 1 month)
          if (d.getDate() !== day) {
            d.setDate(0);
          }
          return d;
        };

        const addYears = (date: Date, years: number) => {
          const d = new Date(date.getTime());
          d.setFullYear(d.getFullYear() + years);
          return d;
        };

        const base = upp.currentPeriodEnd && new Date(upp.currentPeriodEnd) > new Date()
          ? new Date(upp.currentPeriodEnd)
          : new Date();

        let nextEnd: Date = base;
        if (upp.billingCycle === "MONTH") {
          nextEnd = addMonths(base, 1);
        } else if (upp.billingCycle === "QUARTER") {
          nextEnd = addMonths(base, 3);
        } else if (upp.billingCycle === "YEAR") {
          nextEnd = addYears(base, 1);
        }

        await prisma.userPerchasedPackage.update({
          where: { id: upp.id },
          data: { currentPeriodEnd: nextEnd },
        });
      }
    }

    // Update existing order associated with this crypto subscription (if any)
    const existingOrder = await prisma.order.findFirst({
      where: { cryptoSubId: subscriptionId },
    });

    if (existingOrder) {
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          status: newStatus,
          // keep other fields as-is; status is the critical change
        },
      });
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    // Log but acknowledge webhook so NOWPayments doesn't retry excessively
    console.error("NOWPayments webhook processing error:", err?.message || err);
    return res.status(200).json({ received: true, error: true });
  }
});


export const PackageController = {
    createPackage,
    singlePackage,
    deletePackage,
    getAllPackages,
    updatePackage,
    updatePackageStatus,
    getUserPackages,
    purchasePackage,
    cancelPurchasePackage,
    cryptoSubscription,
    getUserSunscription,
    handleWebhook,
    allCryptoSubscriptions,
    getStripeClientConfig,
};
