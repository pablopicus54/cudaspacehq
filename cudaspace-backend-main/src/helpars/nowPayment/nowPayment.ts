import axios from "axios";
import prisma from "../../shared/prisma";
import { BillingCycle } from "@prisma/client";

function generateStripeSubId() {
  return `${crypto.randomUUID()}`;
}

export const createSubscriptionPlan = async (
  title: string,
  interval_day: number,
  amount: number,
  token: string
) => {
  const planResponse = await axios.post(
    "https://api.nowpayments.io/v1/subscriptions/plans",
    {
      title,
      interval_day,
      amount: amount,
      currency: "usd",
      ipn_callback_url: `${process.env.BACKEND_URL || "http://localhost:5001"}/api/v1/package/webhook`,
      success_url: null,
      cancel_url: null,
      partially_paid_url: null,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return planResponse.data;
};

export const purchaseCryptoplan = async (
  userId: string,
  cryptoSubId: string,
  cryptoPlanId: string,
  status: string,
  packageId: string,
  billingCycle: string,
  userName: string,
  operatingSystem: string,
  rootPassword: string
) => {
  const purchesPaln = await prisma.userPerchasedPackage.create({
    data: {
      userId: userId,
      cryptoSubId: cryptoSubId,
      cryptoPlanId: cryptoPlanId,
      cryptoPayment: true,
      status: status,
      packageId: packageId,
      stripeSubId: generateStripeSubId(),
      // VPS Info
      billingCycle: billingCycle as BillingCycle,
      userName: userName,
      operatingSystem: operatingSystem,
      rootPassword: rootPassword,
    },
  });

  return purchesPaln;
};
