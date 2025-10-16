import { Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import { IBlog } from "./blog.interface";

const createBlog = async (blogData: Partial<IBlog>) => {
  const dataToCreate: any = {
    title: blogData.title,
    descriptions: blogData.descriptions,
    category: blogData.category,
    secondaryImages: blogData.secondaryImages || [],
  };
  if (blogData.displayImage) {
    dataToCreate.displayImage = blogData.displayImage;
  }

  const blog = await prisma.blog.create({
    data: dataToCreate,
  });

  return blog;
};


const getSingle = async(id: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id
    }
  })

  if(!blog){
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const relatedBlog = await prisma.blog.findMany({
    where: {
      category: blog.category,
      NOT: {
        id
      }
    }
  })

  return {
    blog,
    relatedBlog
  }
}


const updateBlog = async(id: string, blogData: Partial<IBlog>) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id
    }
  })

  if(!blog){
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const updateBlog = await prisma.blog.update({
    where: {id},
    data: blogData
  })

  return updateBlog;
}


const getAllBlogs = async (  filters: {
  searchTerm?: string;
},
options: IPaginationOptions) => {

const { searchTerm } = filters;
const { page, skip, limit, sortBy, sortOrder } =
  paginationHelpers.calculatePagination(options);

const andConditions = [];

if (searchTerm) {
  andConditions.push({
    OR: ["title", "category"].map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    })),
  });
}

const whereConditions: Prisma.BlogWhereInput =
  andConditions.length > 0 ? { AND: andConditions } : {};

const blogs = await prisma.blog.findMany({
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

const total = await prisma.blog.count({
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
  data: blogs,
};
};



const deleteBlog = async(id: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id
    }
  })

  if(!blog){
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  await prisma.blog.delete({
    where: {
      id
    }
  })
}


export const BlogService = {
    createBlog,
    getSingle,
    updateBlog,
    getAllBlogs,
    deleteBlog
}