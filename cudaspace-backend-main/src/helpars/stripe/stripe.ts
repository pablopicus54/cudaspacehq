import Stripe from "stripe";
import config from "../../config";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import {BillingCycle} from "@prisma/client";


const stripe = new Stripe(config.stripe_secret_key as string, {
    apiVersion: "2024-12-18.acacia",
});


export const createStripeCustomer = async (email: string, name: string, paymentMethodId: string) => {
    try {
        const customer = await stripe.customers.create({
            email,
            name,
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return customer;
    } catch (error) {
        console.error("Error creating Stripe customer account:", error);
        throw new Error("Failed to create Stripe customer account");
    }
};


export const attachPaymentMethod = async (paymentMethodId: string, stripeCustomerId: string) => {
    try {
        // Remove special handling for pm_card_ tokens
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        // Handle payment method ownership
        if (paymentMethod.customer && paymentMethod.customer !== stripeCustomerId) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "This card is already used by another account"
            );
        }

        // Attach if not linked to any customer
        if (!paymentMethod.customer) {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: stripeCustomerId
            });
        }

        // Update default payment method
        await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {default_payment_method: paymentMethodId}
        });

    } catch (error: any) {
        // Enhanced error handling
        if (error.code === 'payment_method_already_attached') {
            return; // No action needed if already attached
        }

        if (error.code === 'resource_missing') {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Invalid card details. Please check your information"
            );
        }

        throw new ApiError(
            error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
            error.raw?.message || "Payment processing failed. Please try again"
        );
    }
};


export const createPaymentIntent = async (stripeCustomerId: string,
                                          paymentMethodId: string, amount: number) => {
    try {
        // Convert amount to cents
        const amountInCents = Math.round(amount * 100);

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,  // Pass amount in cents
            currency: "usd",
            customer: stripeCustomerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
            metadata: {}
        });

        return paymentIntent;
    } catch (error) {
        console.error("Error creating payment intent:", error);
        throw new Error(`Failed to create payment intent: ${error}`);
    }
};


export const getChargeId = async (paymentIntentId: string) => {
    try {
        // Fetch all charges
        const charges = await stripe.charges.list();

        // Find the charge that matches the given paymentIntentId
        const charge = charges.data.find(charge => charge.payment_intent === paymentIntentId);

        // Return the charge ID if found, otherwise return null
        return charge ? charge.id : null;
    } catch (error) {
        console.error("Error fetching charge ID:", error);
        throw new Error("Failed to fetch charge ID");
    }
};


export const createStripeProduct = async (planName: string) => {
    try {
        const product = await stripe.products.create({
            name: planName,
        });
        return product
    } catch (e) {
        console.error("Error creating product:", e);
        throw new Error("Failed to create product");
    }
}

export const updateStripeProduct = async (productId: string, planType?: string) => {
    try {
        const updatedProduct = await stripe.products.update(productId, {
            name: planType
        });
        return updatedProduct;
    } catch (e) {
        console.error("Error updating product:", e);
        throw new Error("Failed to update product");
    }
};


export const createStripeProductPrice = async (
    amount: number,
    productId: string,
    interval: "day" | "week" | "month" | "year",
    intervalCount: number = 1 // default to 1
) => {
    try {
        const price = await stripe.prices.create({
            unit_amount: amount * 100,
            currency: "usd",
            product: productId,
            recurring: {
                interval,
                interval_count: intervalCount,
            },
        });
        return price;
    } catch (e) {
        console.error("Error creating price:", e);
        throw new Error("Failed to create price");
    }
};


export const updateStripeProductPrice = async (
    oldPriceId: string,
    newAmount: number,
    productId: string,
    interval: "day" | "week" | "month" | "year",
    intervalCount: number = 1 // default to 1 (monthly, yearly, etc.)
) => {
    try {
        // Deactivate the old price
        await stripe.prices.update(oldPriceId, {active: false});

        // Create a new price with optional interval_count
        const newPrice = await stripe.prices.create({
            unit_amount: newAmount * 100,
            currency: "usd",
            product: productId,
            recurring: {
                interval,
                interval_count: intervalCount,
            },
        });

        return newPrice;
    } catch (e) {
        console.error("Error updating price:", e);
        throw new Error("Failed to update price");
    }
};


export const purchasePackageByUser = async (customerId: string, stripePriceId: string,
                                            userId: string, packageId: string,
                                            serviceName: string, amount: number, billingCycle: BillingCycle,userName:string,
                                            operatingSystem: string, rootPassword: string, orderId?: string) => {
    try {
        console.log(amount)
        const stripeSubscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{price: stripePriceId}],
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
            metadata: {userId, packageId, serviceName, amount, billingCycle, userName, operatingSystem, rootPassword, ...(orderId ? { orderId } : {})}
        });

        return stripeSubscription;
    } catch (e) {
        console.error("Failed subscription:", e);
        // throw new Error( e);
    }
};


export const updateStripeSubscription = async (stripeSubId: string, stripePriceId: string, userId: string, planId: string, planName: string) => {
    try {
        // First retrieve the subscription to get existing items
        const currentSubscription = await stripe.subscriptions.retrieve(stripeSubId);

        // Get the first subscription item ID
        const subscriptionItemId = currentSubscription.items.data[0].id;

        // Update the subscription with the correct item ID
        const updatedSubscription = await stripe.subscriptions.update(stripeSubId, {
            items: [{
                id: subscriptionItemId, // Use SUBSCRIPTION ITEM ID here
                price: stripePriceId
            }],
            proration_behavior: 'always_invoice',
            expand: ['latest_invoice.payment_intent'],
            cancel_at_period_end: false,
            metadata: {planId, planName, userId}
        });

        return updatedSubscription;
    } catch (e) {
        console.error("Subscription update failed:", e);
        throw new Error(`Failed to update subscription`);
    }
};

export const cancelStripeSubscription = async (stripeSubId: string, userId: string) => {
    try {
        const stripeSubscription = await stripe.subscriptions.update(
            stripeSubId,
            {
                cancel_at_period_end: true,
                metadata: {userId}// Cancel at period end instead of immediate
            }
        );

        return stripeSubscription;
    } catch (e) {
        console.error("Error cancel subscription:", e);
        throw new Error("Failed cancel subscription");
    }
};


export default stripe;