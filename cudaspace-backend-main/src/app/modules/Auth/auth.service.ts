import { Provider, UserRole, UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import emailSender from "../../../helpars/emailSender/emailSender";
import {
  comparePassword,
  hashPassword,
} from "../../../helpars/passwordHelpers";
import { ICustomer } from "./auth.validation";

const customerRegistration = async (payload: ICustomer) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  if (!payload.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  if (payload.role === UserRole.ADMIN) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Super admin already created!");
  }

  const hashedPassword = await hashPassword(payload.password);

  const createCustomer = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      provider: Provider.EMAIL,
      role: UserRole.USER,
      number: payload.number,
    },
  });

  const { password, ...user } = createCustomer;

  return user;
};

const loginUserWithEmail = async (payload: {
  email: string;
  password: string;
  keepMeLogin: boolean;
}) => {
  if (!payload.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
  }

  if (!payload.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No record found with this email");
  }

  if (userData.provider !== Provider.EMAIL) {
    throw new ApiError(400, `Please login with your ${userData.provider}`);
  }

  if (userData.status === UserStatus.INACTIVE) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Your account is temporarily block"
    );
  }

  const isCorrectPassword = await comparePassword(
    payload.password,
    userData?.password as string
  );

  // Verify password
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    payload.keepMeLogin as boolean
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return { accessToken, refreshToken };
};

// user login
const forgotPassword = async (payload: { email: string }) => {
  if (!payload.email) {
    throw new ApiError(httpStatus.FORBIDDEN, "Email is required");
  }

  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No record found with this email");
  }

  if (userData.provider !== Provider.EMAIL) {
    throw new ApiError(400, `Please login with your ${userData.provider}`);
  }

  const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #FF7600; background-image: linear-gradient(135deg, #FF7600, #45a049); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">OTP Verification</h1>
        </div>
        <div style="padding: 20px 12px; text-align: center;">
            <p style="font-size: 18px; color: #333333; margin-bottom: 10px;">Hello,</p>
            <p style="font-size: 18px; color: #333333; margin-bottom: 20px;">Your OTP for verifying your account is:</p>
            <p style="font-size: 36px; font-weight: bold; color: #FF7600; margin: 20px 0; padding: 10px 20px; background-color: #f0f8f0; border-radius: 8px; display: inline-block; letter-spacing: 5px;">${randomOtp}</p>
            <p style="font-size: 16px; color: #555555; margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto;">Please enter this OTP to complete the verification process. This OTP is valid for 5 minutes.</p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 14px; color: #888888; margin-bottom: 4px;">Thank you for choosing our service!</p>
                <p style="font-size: 14px; color: #888888; margin-bottom: 0;">If you didn't request this OTP, please ignore this email.</p>
            </div>
        </div>
        <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #999999;">
            <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

  await emailSender("OTP", userData?.email as string, html);

  await prisma.user.update({
    where: {
      id: userData?.id,
    },
    data: {
      otp: randomOtp,
      otpExpiry: otpExpiry,
    },
  });

  return { email: payload.email };
};

const enterOtp = async (payload: { email: string; otp: string }) => {
  if (!payload.email) {
    throw new ApiError(httpStatus.FORBIDDEN, "Email is required");
  }

  if (!payload.otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP is required");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      otp: payload.otp,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Your otp is incorrect");
  }

  if (userData?.otpExpiry && userData?.otpExpiry < new Date()) {
    throw new ApiError(400, "Your otp has been expired");
  }

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  await prisma.user.update({
    where: {
      id: userData?.id,
    },
    data: {
      otp: null,
      otpExpiry: null,
    },
  });

  return { resetPassToken };
};

const resetPassword = async (payload: {
  resetPassToken: string;
  password: string;
}) => {
  if (!payload.resetPassToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Token is required");
  }

  if (!payload.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const isValidToken = jwtHelpers.verifyToken(
    payload.resetPassToken,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  const userData = await prisma.user.findUnique({
    where: { email: isValidToken.email },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No record found with this email");
  }

  if (userData.provider !== Provider.EMAIL) {
    throw new ApiError(400, `Please login with your ${userData.provider}`);
  }

  const password = await hashPassword(payload.password);

  // update into database
  await prisma.user.update({
    where: {
      id: userData?.id,
    },
    data: {
      password,
    },
  });

  return;
};

const changePassword = async (
  id: string,
  newPassword: string,
  oldPassword: string
) => {
  if (!oldPassword) {
    throw new ApiError(httpStatus.FORBIDDEN, "Old Password is required");
  }

  if (!newPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "New Password is required");
  }

  const userData = await prisma.user.findUnique({
    where: { id },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No record found with this email");
  }

  const isCorrectPassword = await comparePassword(
    oldPassword,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect old password!");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: {
      id: userData?.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return;
};

// get user profile
const getMyProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (result?.role === UserRole.USER) {
    const rslt = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        role: true,
        status: true,
        // createdAt: true,
        // updatedAt: true,
        number: true,
        provider: true,
      },
    });
    return rslt;
  }

  if (result?.role === UserRole.ADMIN) {
    const rslt = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        number: true,
        profileImage: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return rslt;
  }
};

// change password

// reset password
const updateProfile = async (userId: string, data: IUpdateUser) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...data
    },
    select:{
      name: true,
      email: true,
      number: true,
      profileImage: true,
      status: true
    }
  });

  return { updatedUser };
};

// Issue a new access token using a valid refresh token
const refreshToken = async (token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const decoded = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_token_secret as Secret
  );

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new ApiError(httpStatus.FORBIDDEN, "This user is inactive !");
  }

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { token: accessToken };
};

export const AuthServices = {
  loginUserWithEmail,
  enterOtp,
  getMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  customerRegistration,
  updateProfile,
  refreshToken,
};
