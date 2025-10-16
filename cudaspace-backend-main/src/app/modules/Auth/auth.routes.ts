import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {AuthController} from "./auth.controller";
import {authValidation} from "./auth.validation";
import multer from "multer";
import { createStorage } from "../../../helpars/fileUploader";


const router = express.Router();

const upload = multer({ storage: createStorage("profile") });
const fileUpload = upload.single("profile");

// user login route
router.post("/create-customer", validateRequest(authValidation.CustomerSchema), AuthController.customerRegistration);
router.get("/get-my-profile", auth(), AuthController.getMyProfile);

router.post("/login-with-email", AuthController.loginUserWithEmail);



router.post("/otp-enter", AuthController.enterOtp);

// user logout route
router.post("/logout", AuthController.logoutUser);


router.put(
    "/change-password",
    auth(),
    validateRequest(authValidation.changePasswordValidationSchema),
    AuthController.changePassword
);
;

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

router.patch('/update-profile', auth(), fileUpload, AuthController.updateProfile);

// refresh token route
router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;