import cron from "node-cron";
import prisma from "../../shared/prisma";
import axios from "axios";
import { generateUniqueProductId } from "../../helpars/uniqueIdGenerator";

export function generateStripeSubId() {
  return `${crypto.randomUUID()}`;
}

const downgradeExpiredSubscriptions = async () => {
  console.log("Checking for expired subscriptions to downgrade...");
  const now = new Date();

  try {
    const expiredSubscriptions = await prisma.userPerchasedPackage.findMany({
      where: {
        shouldDowngradeRole: true,
        currentPeriodEnd: { lte: now },
      },
      // include: {
      //   user: true
      // }
    });

    console.log(
      `Found ${expiredSubscriptions.length} subscriptions to process`
    );

    for (const sub of expiredSubscriptions) {
      try {
        await prisma.order.update({
          where: { id: sub.stripeSubId as string },
          data: { status: "Pending" },
        });

        await prisma.userPerchasedPackage.update({
          where: { id: sub.id },
          data: { status: "canceled", shouldDowngradeRole: false },
        });

        console.log(`Downgraded order ${sub.stripeSubId} to pending`);
      } catch (error) {
        console.error(
          `Failed to downgrade ${sub.stripeSubId} to pending:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error processing expired subscriptions:", error);
  }
};

const cryptopaymentStatusUpdate = async () => {
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
      currentPeriodEnd: true,
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

        // ✅ If payment is successful, extend currentPeriodEnd according to billing cycle
        if (["finished", "confirmed"].includes(String(result.status))) {
          const addMonths = (date: Date, months: number) => {
            const d = new Date(date.getTime());
            const day = d.getDate();
            d.setMonth(d.getMonth() + months);
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

          const base = sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) > new Date()
            ? new Date(sub.currentPeriodEnd)
            : new Date();

          let nextEnd: Date = base;
          if (sub.billingCycle === "MONTH") {
            nextEnd = addMonths(base, 1);
          } else if (sub.billingCycle === "QUARTER") {
            nextEnd = addMonths(base, 3);
          } else if (sub.billingCycle === "YEAR") {
            nextEnd = addYears(base, 1);
          }

          await prisma.userPerchasedPackage.update({
            where: { id: sub.id },
            data: { currentPeriodEnd: nextEnd },
          });
        }

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

export function initializeCronJobs() {
  // Schedule the cron job to run daily at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    // Runs at midnight daily
    await downgradeExpiredSubscriptions();
    console.log("Gift cards validity check completed!");
  });

  // Run twice daily at 8:00 AM and 8:00 PM
  cron.schedule("0 8,20 * * *", async () => {
    await cryptopaymentStatusUpdate();
  });
}
