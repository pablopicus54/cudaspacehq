import express from "express";
import { PackageController } from "./Package.controller";
import multer from "multer";
import { createStorage } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

const upload = multer({ storage: createStorage("package") });
const fileUpload = upload.single("package");

router.get('/display-packages', PackageController.getUserPackages);
// Public endpoint to return Stripe client configuration (publishable key & mode)
router.get('/stripe-client', PackageController.getStripeClientConfig);
router.get('/all-crypyto-subscription', PackageController.allCryptoSubscriptions);
router.get('/:id', PackageController.singlePackage);
router.get('/', auth(UserRole.ADMIN), PackageController.getAllPackages);
router.post('/', auth(UserRole.ADMIN), fileUpload, PackageController.createPackage);
router.patch("/:id",auth(UserRole.ADMIN), fileUpload, PackageController.updatePackage);
router.patch("/update-package-status/:id", auth(UserRole.ADMIN), PackageController.updatePackageStatus);
router.delete("/:id",auth(UserRole.ADMIN), PackageController.deletePackage);
router.post("/purchase-package", auth(), PackageController.purchasePackage);
router.post("/cancel-purchase-package", auth(), PackageController.cancelPurchasePackage);

router.post('/crypto-subscription', auth(), PackageController.cryptoSubscription);
router.get('/user-crypto-subscription/:subscriptionId', auth(), PackageController.getUserSunscription); // <--- subscription id get details
router.post('/webhook', () =>{console.log("webhook --> 55")}, PackageController.handleWebhook);



export const PackageRoutes = router;