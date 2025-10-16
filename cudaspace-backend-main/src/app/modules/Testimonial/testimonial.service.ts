import { Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";


const createTestimonial = async(id: string,testimonialData: ITestimonial) =>{
    const testimonial = await prisma.testimonial.create({
        data: {
            userId: id,
            message: testimonialData.message
        }
    })

    return testimonial;
}


const getAllTestimonial = async() => {
    const testimonial = await prisma.testimonial.findMany({
        where: {
            isApproved: true
        },
        select: {
            message: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    profileImage: true
                }
            }
        }
    });

    return{
        testimonial
    }
}


const deleteTestimonial =  async(id: string) =>{
    const testimonial = await prisma.testimonial.delete({
        where: {
            id
        }
    })

    return testimonial;
}

const approvedTestimonial = async(id: string, isApproved: boolean) => {
    const testimonial = await prisma.testimonial.update({
        where: {
            id
        },
        data: {
            isApproved: isApproved
        }
    })
    return testimonial;
}

export const TestimonialService = {
    createTestimonial,
    getAllTestimonial,
    deleteTestimonial,
    approvedTestimonial
}