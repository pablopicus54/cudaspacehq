import express from "express";
import multer from "multer";
import { createStorage } from "../../../helpars/fileUploader";
import { BlogController } from "./blog.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

const upload = multer({ storage: createStorage("blog") });
const uploadBlog = upload.fields([
  { name: "displayImage", maxCount: 1 },
  { name: "secondaryImage", maxCount: 3 },
]);
const uploadEditor = upload.single("image");


router.get("/:id", BlogController.getSingle);
router.get('/', BlogController.getAllBlogs);
router.post("/", uploadBlog, auth(UserRole.ADMIN), BlogController.createBlog);
router.patch('/:id', uploadBlog, auth(UserRole.ADMIN), BlogController.updateBlog);
router.delete('/:id',auth(UserRole.ADMIN), BlogController.deleteBlog);
router.post('/editor/upload', uploadEditor, auth(UserRole.ADMIN), BlogController.uploadEditorImage);


export const BlogRoutes = router;