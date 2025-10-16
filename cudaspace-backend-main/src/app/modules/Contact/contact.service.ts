import { Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { IContact } from "./contact.interface";
import { paginationHelpers } from "../../../helpars/paginationHelper";


const createContact = async(contactData: IContact) =>{
  const contact = await prisma.contact.create({
    data: {
      ...contactData
    }
  })

  return contact;
}

const getAllContact = async (  filters: {
  searchTerm?: string;
},
options: IPaginationOptions) => {

const { searchTerm } = filters;
const { page, skip, limit, sortBy, sortOrder } =
  paginationHelpers.calculatePagination(options);

const andConditions = [];

if (searchTerm) {
  andConditions.push({
    OR: ["name", "email"].map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    })),
  });
}

const whereConditions: Prisma.ContactWhereInput =
  andConditions.length > 0 ? { AND: andConditions } : {};

const contact = await prisma.contact.findMany({
  where: {
    ...whereConditions,
  },
  skip,
  take: limit,
  orderBy:
    sortBy && sortOrder
      ? { [sortBy]: sortOrder }
      : {
          createdAt: "desc",
        },
});

const total = await prisma.contact.count({
  where: {
    ...whereConditions,
  },
});


return {
  meta: {
    page,
    limit,
    total,
  },
  data: contact,
};
};


const deleteContact = async(id: string) => {
  const contact = await prisma.contact.findUnique({
    where:{
      id
    }
  })

  if(!contact){
    throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
  }

  await prisma.contact.delete({
    where: {
      id
    }
  })
}


export const ContactService = {
  createContact,
  getAllContact,
  deleteContact
}