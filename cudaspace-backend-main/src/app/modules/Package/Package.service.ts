import {
  BillingCycle,
  PackageStatus,
  PackageType,
  Prisma,
  ServerType,
  VpsType,
} from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import { IPackage } from "./package.interface";
import {
  cancelStripeSubscription,
  createStripeCustomer,
  createStripeProduct,
  createStripeProductPrice,
  purchasePackageByUser,
  updateStripeProduct,
  updateStripeProductPrice,
} from "../../../helpars/stripe/stripe";
import {
  createSubscriptionPlan,
  purchaseCryptoplan,
} from "../../../helpars/nowPayment/nowPayment";
import axios from "axios";
import { generateUniqueProductId } from "../../../helpars/uniqueIdGenerator";
import { generateStripeSubId } from "../../jobs";

// Helper to ensure NOWPayments plan title is ≤ 50 chars
const makeNowPaymentsTitle = (base: string, suffix: string) => {
  const cleanBase = (base || "").trim();
  const safeSuffix = suffix || "";
  const maxBaseLen = Math.max(0, 50 - safeSuffix.length);
  const truncatedBase = cleanBase.length > maxBaseLen ? cleanBase.slice(0, maxBaseLen) : cleanBase;
  return `${truncatedBase}${safeSuffix}`;
};

const createPackage = async (packageData: IPackage) => {
  const product = await createStripeProduct(
    packageData.serviceName.toUpperCase()
  );

  const perMonthPrice = await createStripeProductPrice(
    packageData.perMonthPrice,
    product.id,
    "month"
  );

  const perYearPrice = await createStripeProductPrice(
    packageData.perYearPrice,
    product.id,
    "year"
  );

  const perQuarterPrice = await createStripeProductPrice(
    packageData.perQuarterPrice, // Make sure this is provided in `IPackage`
    product.id,
    "month",
    3
  );

  const loginResponse = await axios.post("https://api.nowpayments.io/v1/auth", {
    email: `${process.env.EMAIL_NOW_PAYMENTS}`,
    password: `${process.env.PASSWORD_NOW_PAYMENTS}`,
  });

  const token = loginResponse.data.token;

  // Enforce NOWPayments title length (≤ 50) and keep uniqueness per interval
  const monthTitle = makeNowPaymentsTitle(packageData.serviceName, "-M");
  const yearTitle = makeNowPaymentsTitle(packageData.serviceName, "-Y");
  const quarterTitle = makeNowPaymentsTitle(packageData.serviceName, "-Q");

  const perMonthPriceCrypto = await createSubscriptionPlan(
    monthTitle,
    31,
    packageData.perMonthPrice,
    token
  );
  const perYearPriceCrypto = await createSubscriptionPlan(
    yearTitle,
    365,
    packageData.perYearPrice,
    token
  );
  const perQuarterPriceCrypto = await createSubscriptionPlan(
    quarterTitle,
    92,
    packageData.perQuarterPrice,
    token
  );

  const data = await prisma.package.create({
    data: {
      monthlyPlanId: perMonthPriceCrypto?.result?.id,
      quaterlyPlanId: perQuarterPriceCrypto?.result?.id,
      yearlyPlanId: perYearPriceCrypto?.result?.id,
      packageType: packageData.packageType,
      serviceName: packageData.serviceName,
      perMonthPrice: packageData.perMonthPrice,
      perYearPrice: packageData.perYearPrice,
      perQuarterPrice: packageData.perQuarterPrice, // Add this field in your schema
      serviceDetails: packageData.serviceDetails,
      promotianal: packageData.promotianal,
      vpsType: packageData.vpsType,
      serverType: packageData.serverType,
      packageImage: packageData.packageImage,
      packageStatus: packageData.packageStatus,
      stripePriceIdPerMonth: perMonthPrice.id,
      stripePriceIdPerYear: perYearPrice.id,
      stripePriceIdPerQuarter: perQuarterPrice.id, // Add this to your schema
      productId: product.id,
    },
  });

  return data;
};

const singlePackage = async (id: string) => {
  const packageData = await prisma.package.findUnique({
    where: {
      id,
    },
  });

  if (!packageData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  return packageData;
};

const deletePackage = async (id: string) => {
  const packageData = await prisma.package.findUnique({
    where: {
      id,
    },
  });

  if (!packageData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  await prisma.package.delete({
    where: {
      id,
    },
  });
};

const getAllPackages = async (
  filters: {
    packageType?: string;
    promotional?: boolean;
    newArrivals?: boolean;
    vpsType?: string;
  },
  options: IPaginationOptions
) => {
  const { packageType, promotional, newArrivals } = filters;
  let { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const promotionalBoolean =
    typeof promotional === "string" ? JSON.parse(promotional) : promotional;
  const newArrivalsBoolean =
    typeof newArrivals === "string" ? JSON.parse(newArrivals) : newArrivals;

  const andConditions: Prisma.PackageWhereInput[] = [];

  const validVpsTypes = Object.values(VpsType);
  const validPackageTypes = Object.values(PackageType);
  const validServerTypes = Object.values(ServerType);

  // Always include packageStatus as true
  //  andConditions.push({ packageStatus: { equals: 'PUBLISHED' } });

  if (packageType) {
    const orConditions: Prisma.PackageWhereInput[] = [];

    orConditions.push(
      { serviceName: { contains: packageType, mode: "insensitive" } },
      { packageImage: { contains: packageType, mode: "insensitive" } }
    );

    if (validPackageTypes.includes(packageType as PackageType)) {
      orConditions.push({
        packageType: { equals: packageType as PackageType },
      });
    }

    if (validVpsTypes.includes(packageType as VpsType)) {
      orConditions.push({ vpsType: { equals: packageType as VpsType } });
    }

    if (validServerTypes.includes(packageType as ServerType)) {
      orConditions.push({ serverType: { equals: packageType as ServerType } });
    }

    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }

  if (typeof promotionalBoolean === "boolean") {
    andConditions.push({ promotianal: { equals: promotionalBoolean } });
  }

  if (typeof newArrivalsBoolean === "boolean") {
    limit = 1;
  }

  const whereConditions: Prisma.PackageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const packages = await prisma.package.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.package.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: packages,
  };
};

const getUserPackages = async (
  filters: {
    packageType?: string;
    promotional?: boolean;
    newArrivals?: boolean;
    vpsType?: string;
    serverType?: string;
    serviceDetails?: string;
  },
  options: IPaginationOptions
) => {
  const { packageType, promotional, newArrivals, vpsType, serverType } =
    filters;
  let { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const promotionalBoolean =
    typeof promotional === "string" ? JSON.parse(promotional) : promotional;
  const newArrivalsBoolean =
    typeof newArrivals === "string" ? JSON.parse(newArrivals) : newArrivals;

  const andConditions: Prisma.PackageWhereInput[] = [];

  const validVpsTypes = Object.values(VpsType);
  const validPackageTypes = Object.values(PackageType);
  const validServerTypes = Object.values(ServerType);

  // Always include published packages
  andConditions.push({ packageStatus: { equals: "PUBLISHED" } });

  if (filters.serviceDetails) {
    const patterns = Array.isArray(filters.serviceDetails)
      ? filters.serviceDetails
      : [filters.serviceDetails];

    const patternConditions = patterns.map((pattern) => {
      // Only allow simple wildcard * matching
      if (pattern.includes("*")) {
        const regexPattern = pattern.replace(/\*/g, ".*");
        return {
          serviceDetails: {
            some: {
              matches: regexPattern,
              mode: "insensitive",
            },
          },
        };
      }
      // Default to exact match
      return {
        serviceDetails: {
          has: pattern,
        },
      };
    });

    andConditions.push({
      AND: patternConditions,
    });
  }

  if (packageType) {
    const orConditions: Prisma.PackageWhereInput[] = [];

    orConditions.push(
      { serviceName: { contains: packageType, mode: "insensitive" } },
      { packageImage: { contains: packageType, mode: "insensitive" } }
    );

    if (validPackageTypes.includes(packageType as PackageType)) {
      orConditions.push({
        packageType: { equals: packageType as PackageType },
      });
    }

    if (validVpsTypes.includes(packageType as VpsType)) {
      orConditions.push({ vpsType: { equals: packageType as VpsType } });
    }

    if (validServerTypes.includes(packageType as ServerType)) {
      orConditions.push({ serverType: { equals: packageType as ServerType } });
    }

    andConditions.push({ OR: orConditions });
  }

  if (vpsType && validVpsTypes.includes(vpsType as VpsType)) {
    andConditions.push({ vpsType: { equals: vpsType as VpsType } });
  }

  if (serverType && validServerTypes.includes(serverType as ServerType)) {
    andConditions.push({ serverType: { equals: serverType as ServerType } });
  }

  if (typeof promotionalBoolean === "boolean") {
    andConditions.push({ promotianal: { equals: promotionalBoolean } });
  }

  if (typeof newArrivalsBoolean === "boolean") {
    limit = 6;
  }

  const whereConditions: Prisma.PackageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const packages = await prisma.package.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.package.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: packages,
  };
};

const updatePackage = async (id: string, getPackage: any, data: IPackage) => {
  let newPerMonthPrice;
  let newPerYearPrice;
  let newPerQuarterPrice;

  if (data.serviceName) {
    await updateStripeProduct(
      getPackage.productId,
      data.serviceName.toUpperCase() ?? getPackage.serviceName.toUpperCase()
    );
  }

  if (data.perMonthPrice && data.perMonthPrice !== getPackage.perMonthPrice) {
    newPerMonthPrice = await updateStripeProductPrice(
      getPackage.stripePriceIdPerMonth,
      data.perMonthPrice,
      getPackage.productId,
      "month"
    );
  }

  if (data.perYearPrice && data.perYearPrice !== getPackage.perYearPrice) {
    newPerYearPrice = await updateStripeProductPrice(
      getPackage.stripePriceIdPerYear,
      data.perYearPrice,
      getPackage.productId,
      "year"
    );
  }

  if (
    data.perQuarterPrice &&
    data.perQuarterPrice !== getPackage.perQuarterPrice
  ) {
    newPerQuarterPrice = await updateStripeProductPrice(
      getPackage.stripePriceIdPerQuarter,
      data.perQuarterPrice,
      getPackage.productId,
      "month",
      3 // interval_count = 3 for quarterly
    );
  }

  const packageData = await prisma.package.update({
    where: { id },
    data: {
      ...data,
      stripePriceIdPerMonth:
        newPerMonthPrice?.id || getPackage.stripePriceIdPerMonth,
      stripePriceIdPerYear:
        newPerYearPrice?.id || getPackage.stripePriceIdPerYear,
      stripePriceIdPerQuarter:
        newPerQuarterPrice?.id || getPackage.stripePriceIdPerQuarter,
    },
  });

  return packageData;
};

const updatePackageStatus = async (id: string, status: PackageStatus) => {
  const packageData = await prisma.package.findUnique({
    where: {
      id,
    },
  });

  if (!packageData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  const updatePackage = await prisma.package.update({
    where: {
      id,
    },
    data: {
      packageStatus: status,
    },
  });

  return updatePackage;
};

const purchasePackage = async (
  userId: string,
  packageId: string,
  paymentMethodId: string,
  billingCycle: BillingCycle,
  userName: string,
  operatingSystem: string,
  rootPassword: string,
  orderId?: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  const newPackage = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!newPackage)
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");

  let stripePriceId;
  let price;
  if (billingCycle === BillingCycle.MONTH) {
    stripePriceId = newPackage.stripePriceIdPerMonth;
    price = newPackage.perMonthPrice;
  }

  if (billingCycle === BillingCycle.YEAR) {
    stripePriceId = newPackage.stripePriceIdPerYear;
    price = newPackage.perYearPrice;
  }

  if (billingCycle === BillingCycle.QUARTER) {
    stripePriceId = newPackage.stripePriceIdPerQuarter;
    price = newPackage.perQuarterPrice;
  }

  // Create or get Stripe customer
  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await createStripeCustomer(
      user.email,
      user.name,
      paymentMethodId
    );

    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });
  }
  // else {
  //
  //     // Attach new payment method to existing customer
  //     await attachPaymentMethod(paymentMethodId, customerId)
  //
  // }

  const isUserPurchasedPackageExists =
    await prisma.userPerchasedPackage.findFirst({
      where: { userId, packageId, status: "active" },
    });

  // if (isUserPurchasedPackageExists?.packageId === packageId) throw new ApiError(httpStatus.CONFLICT, "You already have this package")

  const purchaseNewPackage = await purchasePackageByUser(
    customerId,
    stripePriceId as string,
    userId,
    newPackage.id,
    newPackage.serviceName,
    price as number,
    billingCycle,
    userName,
    operatingSystem,
    rootPassword,
    orderId
  );

  if (!purchaseNewPackage)
    throw new ApiError(httpStatus.NOT_FOUND, "Package purchase failed");

  return purchaseNewPackage;
};

const cancelPurchasePackage = async (
  userId: string,
  subscriptionId: string
) => {
  const purchasedPackage = await prisma.userPerchasedPackage.findFirst({
    where: {
      id: subscriptionId,
      userId,
      status: "active",
    },
  });

  if (!purchasedPackage)
    throw new ApiError(httpStatus.NOT_FOUND, "User purchase package not found");

  const cancel = await cancelStripeSubscription(
    purchasedPackage.stripeSubId as string,
    userId
  );

  if (!cancel)
    throw new ApiError(httpStatus.NOT_FOUND, "Package cancel failed");
};

const cryptoSubscription = async (
  userId: string,
  planId: string,
  packageId: string,
  billingCycle: string,
  userName: string,
  operatingSystem: string,
  rootPassword: string,
  orderId?: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Fetch package for price calculation
  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  // Determine amount and interval days based on billing cycle
  let amount: number | undefined;
  let intervalDay: number | undefined;
  if (billingCycle === BillingCycle.MONTH) {
    amount = pkg.perMonthPrice as number;
    intervalDay = 31; // match plan generation used elsewhere
  } else if (billingCycle === BillingCycle.YEAR) {
    amount = (pkg.perYearPrice ?? 0) as number;
    intervalDay = 365;
  } else if (billingCycle === BillingCycle.QUARTER) {
    amount = (pkg.perQuarterPrice ?? 0) as number;
    intervalDay = 92; // quarter in days
  }

  if (!amount || !intervalDay) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Price or interval not configured for selected billing cycle"
    );
  }

  const loginResponse = await axios.post("https://api.nowpayments.io/v1/auth", {
    email: `${process.env.EMAIL_NOW_PAYMENTS}`,
    password: `${process.env.PASSWORD_NOW_PAYMENTS}`,
  });

  const token = loginResponse.data.token;

  try {
    // Always create a unique plan per order to allow multiple purchases
    const cycleAbbrev =
      billingCycle === BillingCycle.MONTH
        ? "M"
        : billingCycle === BillingCycle.YEAR
        ? "Y"
        : billingCycle === BillingCycle.QUARTER
        ? "Q"
        : billingCycle;
    const uid = orderId ?? generateUniqueProductId("order");
    const suffix = `-${cycleAbbrev}-${uid}`;
    const planTitle = makeNowPaymentsTitle(pkg.serviceName, suffix);
    const createdPlan = await createSubscriptionPlan(
      planTitle,
      intervalDay,
      amount,
      token
    );
    const uniquePlanId = createdPlan?.result?.id ?? planId;

    const cryptoSub = await axios.post(
      "https://api.nowpayments.io/v1/subscriptions",
      {
        subscription_plan_id: uniquePlanId,
        email: user.email,
        // ipn_callback_url must be set at plan creation, not here
      },
      {
        headers: {
          "x-api-key": `${process.env.NOWPAYMENTS_API_KEY}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = cryptoSub.data.result[0];

    // Purchas Plan
    purchaseCryptoplan(
      user.id,
      result.id,
      uniquePlanId,
      result.status,
      packageId,
      billingCycle,
      userName,
      operatingSystem,
      rootPassword
    );

    // Link to pre-created order if orderId provided
    if (orderId) {
      const existingOrder = await prisma.order.findUnique({
        where: { orderId },
      });

      if (existingOrder) {
        await prisma.order.update({
          where: { orderId },
          data: {
            status: result.status,
            userId: user.id,
            packageId,
            cryptoSubId: result.id,
            stripeSubId: generateStripeSubId(),
            billingCycle: billingCycle as BillingCycle,
            userName,
            operatingSystem,
            rootPassword,
          },
        });

        // Increment totalSales for the package
        await prisma.package.update({
          where: { id: packageId },
          data: { totalSales: { increment: 1 } },
        });
      }
    }

    return {
      result,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to create crypto subscription";
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
};

const getUserSunscription = async (userId: string, subscriptionId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const response = await axios.get(
    `https://api.nowpayments.io/v1/subscriptions/${subscriptionId}`,
    {
      headers: {
        "x-api-key": `${process.env.NOWPAYMENTS_API_KEY}`,
      },
    }
  );

  return response.data;
};

const allCryptoSubscriptions = async () => {
  console.log("⏰ Running scheduled crypto subscription sync...");

  const allSubscriptions = await prisma.userPerchasedPackage.findMany({
    where: { cryptoPayment: true },
    select: {
      id: true,
      cryptoSubId: true,
      packageId: true,
      userId: true,
      billingCycle: true,
      userName: true,
      operatingSystem: true,
      rootPassword: true,
    },
  });

  for (const sub of allSubscriptions) {
    // Skip if cryptoSubId is missing
    if (!sub.cryptoSubId) continue;

    try {
      const { data } = await axios.get(
        `https://api.nowpayments.io/v1/subscriptions/${sub.cryptoSubId}`,
        {
          headers: {
            "x-api-key": `${process.env.NOWPAYMENTS_API_KEY}`,
          },
        }
      );

      const result = data?.result;

      console.log("sub: ", sub);
      console.log("result: ", result);

      if (result) {
        // ✅ Update subscription status in userPerchasedPackage
        await prisma.userPerchasedPackage.update({
          where: { id: sub.id },
          data: {
            status: result.status,
            updatedAt: new Date(result.updated_at),
          },
        });

        // 🔍 Check if order already exists
        const order = await prisma.order.findFirst({
          where: {
            userId: sub.userId,
            cryptoSubId: sub.cryptoSubId,
          },
        });

        console.log("order: ", order);
        
        // If order exist update order status
        if (order) {
          await prisma.order.update({
            where: {
              id: order?.id,
            },
            data: {
              status: result.status,
            },
          });
        }

        if (!order) {
          const orderId = await generateUniqueProductId("order");

          // ✅ Create new order
          await prisma.order.create({
            data: {
              orderId,
              status: result.status,
              userId: sub.userId,
              stripeSubId: generateStripeSubId(),
              packageId: sub.packageId,
              cryptoSubId: sub.cryptoSubId,
              // VPS
              billingCycle: sub.billingCycle,
              userName: sub.userName,
              operatingSystem: sub.operatingSystem,
              rootPassword: sub.rootPassword,
            },
          });

          // ✅ Increment totalSales in related package
          if (sub.packageId) {
            await prisma.package.update({
              where: { id: sub.packageId },
              data: {
                totalSales: {
                  increment: 1,
                },
              },
            });
          } else {
            console.warn(
              `⚠️ Cannot update package sales — Missing packageId for userPerchasedPackage ID: ${sub.id}`
            );
          }
        }

        console.log(`✅ Synced subscription  success`);
      }
    } catch (err: any) {
      console.error(
        `❌ Failed to fetch/update cryptoSubId ${sub.cryptoSubId}`,
        err?.response?.data || err.message
      );
    }
  }

  console.log("✅ Crypto subscription sync completed.");
};

export const PackageService = {
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
  allCryptoSubscriptions,
};
