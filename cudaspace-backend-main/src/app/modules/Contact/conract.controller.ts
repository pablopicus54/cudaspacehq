import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { ContactService } from "./contact.service";


const createContact = catchAsync(async (req: Request, res: Response) => {

    const contact = await ContactService.createContact(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Contact created successfully",
        data: contact,
      });
})


const getAllContact = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["searchTerm"]);
    const options = pick(req.query, paginationFields);
  
    const contact = await ContactService.getAllContact(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Contacts retrieved successfully",
      data: contact,
    });
  });


const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const contact = await ContactService.deleteContact(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact deleted successfully",
    data: contact,
  });
})

export const ContactController = {
    createContact,
    getAllContact,
    deleteContact
}