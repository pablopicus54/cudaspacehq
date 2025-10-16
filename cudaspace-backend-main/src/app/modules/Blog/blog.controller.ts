import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BlogService } from "./blog.service";
import ApiError from "../../../errors/ApiErrors";
import { IBlog } from "./blog.interface";
import { BlogValidation } from "./blog.validation";
import config from "../../../config";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

const createBlog = catchAsync(async (req: Request, res: Response) => {
  if (!req.files || typeof req.files !== "object" || Array.isArray(req.files)) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      "Invalid file upload data."
    );
  }

  const displayImage = req.files["displayImage"] as
    | Express.Multer.File[]
    | undefined;
  const secondaryImage = (req.files["secondaryImage"] as Express.Multer.File[]) || [];
  let displayImg: string | undefined = undefined;
  if (displayImage && displayImage.length > 0) {
    displayImg = `${config.backend_image_url}/blog/${displayImage[0].filename}`;
  }

  const secondaryImages =
    secondaryImage?.map(
      (file) => `${config.backend_image_url}/blog/${file.filename}`
    ) || [];


  const parseData = req.body.data && JSON.parse(req.body.data)

  const data: Partial<IBlog> = {
    secondaryImages,
    ...parseData,
  };
  if (displayImg) {
    data.displayImage = displayImg;
  }

    const validationResult = BlogValidation.BlogSchema.safeParse(data);

    if (!validationResult.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Validation Error",
        errors: validationResult.error.errors,
      });
    }

    const blog = await BlogService.createBlog(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});


const getSingle = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;

  const blog = await BlogService.getSingle(id)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Retrive single blog successfully",
    data: blog,
  });
})


const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const blogId = req.params.id;

  let displayImg = req.body.displayImage || "";
  let secondaryImg: string[] = [];

  // Ensure secondaryImg is an array
  if (typeof req.body.secondaryImage === 'string') {
    secondaryImg = [req.body.secondaryImage];
  } else if (Array.isArray(req.body.secondaryImage)) {
    secondaryImg = req.body.secondaryImage;
  }

  let secondaryUploadImg: string[] = [];

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  if (files?.["displayImage"] && files["displayImage"].length > 0) {
    displayImg = `${config.backend_image_url}/blog/${files["displayImage"][0].filename}`;
  }

  if (files?.["secondaryImage"] && files["secondaryImage"].length > 0) {
    secondaryUploadImg = files["secondaryImage"].map(
      (file) => `${config.backend_image_url}/blog/${file.filename}`
    );
  }

  if (secondaryUploadImg.length > 0) {
    secondaryImg = [...secondaryImg, ...secondaryUploadImg];
  }

  const { title, descriptions, category } = req.body;

  const data: IBlog = {
    displayImage: displayImg,
    secondaryImages: secondaryImg,
    title,
    descriptions,
    category
  };

  const validationResult = BlogValidation.updateBlogSchema.safeParse(data);

  if (!validationResult.success) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Validation Error",
      errors: validationResult.error.errors,
    });
  }

  const updatedBlog = await BlogService.updateBlog(blogId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully",
    data: updatedBlog,
  });
});






const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, paginationFields);

  const blogs = await BlogService.getAllBlogs(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully",
    data: blogs,
  });
});


const deleteBlog = catchAsync(async(req: Request, res: Response) => {
  const {id} = req.params;

  const deleteBlog = await BlogService.deleteBlog(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully",
    data: deleteBlog,
  });
})

// Upload editor image for SunEditor
const uploadEditorImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No image file uploaded.");
  }

  const url = `${config.backend_image_url}/blog/${file.filename}`;
  return res.status(httpStatus.OK).json({
    success: true,
    result: [
      {
        url,
        name: file.originalname || file.filename,
        size: file.size,
      },
    ],
  });
});

export const BlogController = {
  createBlog,
  getSingle,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  uploadEditorImage
};
