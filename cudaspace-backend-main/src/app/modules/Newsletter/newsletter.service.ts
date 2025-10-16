import { Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { paginationHelpers } from "../../../helpars/paginationHelper";


const createNewsletter = async(data: {
    email: string
}) => {

    const isResponse = await prisma.newsletter.findFirst({
        where: {
            email: data.email
        }
    })

    if(isResponse){
        return;
    }

    const news = await prisma.newsletter.create({
        data: {
            email: data.email
        }
    })

    return news;
}


export const NewsletterService = {
    createNewsletter
}