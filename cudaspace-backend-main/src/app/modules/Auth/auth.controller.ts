import {Request, Response} from "express";
import httpStatus from "http-status";
import {string} from "zod";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {AuthServices} from "./auth.service";
import ApiError from "../../../errors/ApiErrors";


const customerRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.customerRegistration(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Customer created successfully",
    data: result,
  });
});


const loginUserWithEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserWithEmail(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {

  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Otp sent to your email!",
    data: result,
  });
});

const enterOtp = catchAsync(async (req: Request, res: Response) => {

  const result = await AuthServices.enterOtp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Otp verified successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {

  await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset successfully!",
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {

  // @ts-ignore
  const id = req.user.id;
  const {oldPassword, newPassword} = req.body;

  await AuthServices.changePassword(
      id,
      newPassword,
      oldPassword
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Password changed successfully",
    data: null,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear the token cookie
  // res.clearCookie("token", {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  // });
  //
  // res.redirect("http://204.197.173.249:3004")
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Successfully logged out",
    data: null,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;

  console.log("ID", userId)

  const result = await AuthServices.getMyProfile(userId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const result = await AuthServices.refreshToken(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

// change password

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;

  let profileImage="";

  if(req.file){
    profileImage =  `${config.backend_image_url}/profile/${req.file.filename}`;
  }


  const parseData = req.body.data && JSON.parse(req.body.data);

  const body = {
    profileImage,
    ...parseData
  }

  const updatedUser = await AuthServices.updateProfile(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update user successfully",
    data: updatedUser,
  });
});

export const AuthController = {
  loginUserWithEmail,
  enterOtp,
  logoutUser,
  // getMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  customerRegistration,
  getMyProfile,
  updateProfile,
  refreshToken,
};