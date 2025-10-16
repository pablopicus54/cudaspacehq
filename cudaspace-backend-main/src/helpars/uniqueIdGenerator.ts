import prisma from "../shared/prisma";

export const generateUniqueProductId = async (idFor: string): Promise<string> => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';
    let isUnique = false;

    // Loop until a unique ID is found
    while (!isUnique) {
        uniqueId = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uniqueId += characters[randomIndex];
        }

        // Check if the generated productId already exists in the database
        let existingItem;

        try {
            switch (idFor) {
                case "order":
                    existingItem = await prisma.order.findFirst({
                        where: { orderId: uniqueId },
                    });
                    break;
                // case "orderDetails":
                //     existingItem = await prisma.orderedProductDetails.findFirst({
                //         where: { productDetailsId: uniqueId },
                //     });
                //     break;
                default:
                    throw new Error("Invalid idFor argument");
            }

            // If it doesn't exist, we found a unique ID
            isUnique = !existingItem;
        } catch (error) {
            console.error("Error checking uniqueness of ID:", error);
            throw new Error("Database check failed.");
        }
    }

    return uniqueId;
};