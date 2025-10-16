import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { NewsletterService } from "./newsletter.service";



const createNewsletter = catchAsync(async (req: Request, res: Response) => {

    const contact = await NewsletterService.createNewsletter(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Newsletter created successfully",
        data: contact,
      });
})



export const NewsletterController = {
    createNewsletter
}