import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import pick from "../../../shared/pick";
import { TestimonialService } from "./testimonial.service";




const createTestimonial = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

    const testimonial = await TestimonialService.createTestimonial(user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Testimonial created successfully",
        data: testimonial,
      });
})

const getAllTestimonial = catchAsync(async (req: Request, res: Response) => {

    const testimonial = await TestimonialService.getAllTestimonial();


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Testimonial retrive successfully",
        data: testimonial,
      });
})


const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const testimonial = await TestimonialService.deleteTestimonial(id)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Testimonial deleted successfully",
        data: testimonial,
      });
})

const approvedTestimonial =  catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const {isApproved} = req.body

    const testimonial = await TestimonialService.approvedTestimonial(id, isApproved)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Approved testimonial successfully",
        data: testimonial,
      });
})


export const TestimonialController = {
    createTestimonial,
    getAllTestimonial,
    deleteTestimonial,
    approvedTestimonial
}