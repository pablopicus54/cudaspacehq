 
'use client';
import MyButton from '@/components/ui/MyButton/MyButton';
import MyFormImageUpload from '@/components/ui/MyForm/MyFormImageUpload/MyFormImageUpload';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import { useGetSingleBlogQuery, useUpdateBlogMutation } from '@/redux/features/blog/blog.user.api';

import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'antd';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentToken } from '@/redux/features/auth/authSlice';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import 'suneditor/dist/css/suneditor.min.css';
import { z } from 'zod';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

const options = {
  buttonList: [
    ['undo', 'redo'],
    ['fontSize', 'formatBlock'],
    // ["bold", "underline", "italic", "strike", "subscript", "superscript"],
    ['bold', 'underline', 'italic'],
    ['removeFormat'],
    ['fontColor', 'hiliteColor'],
    ['indent', 'outdent'],
    // ['align', 'list', 'lineHeight'],
    // ['table', 'link', 'image'],
    ['link', 'image'],
    // ['fullScreen', 'showBlocks', 'codeView'],
  ],
  minHeight: '200px',
  font: [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Impact',
    'Tahoma',
    'Times New Roman',
    'Verdana',
    'Roboto', // Add your custom fonts here
    'Open Sans',
  ],
  fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 64], // Add or customize font sizes
  defaultStyle: 'font-family: Arial; font-size: 14px;', // Set default font and font size
};

const validationSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),
  category: z.string({
    required_error: 'Category is required',
  }),
  displayImage: z
    .union([
      z.string(),
      z.instanceof(File).refine((file) => (file ? file.size <= 50 * 1024 * 1024 : true), {
        message: 'Image size must be less than 50MB',
      }),
    ])
    .optional(),
  secondaryImage: z
    .array(
      z.union([
        z.string(), // For existing images (URLs)
        z.instanceof(File).refine((file) => file.size <= 50 * 1024 * 1024, {
          message: 'Each image must be less than 50MB',
        }),
      ]),
    )
    .max(3, { message: 'Maximum 3 images allowed' })
    .optional(),
});
const UpdateBlog = () => {
  const [content, setContent] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params?.blogId;
  const [updateBlogMutation] = useUpdateBlogMutation();
  const { data: getSingleBlogQuery, isLoading } = useGetSingleBlogQuery(id);
  const accessToken = useAppSelector(selectCurrentToken);

  type SunUploadResult = { result: Array<{ url: string; name?: string; size?: number }> };
  type SunUploadHandler = (data?: SunUploadResult | string) => void;

  const onImageUploadBefore = (
    files: File[],
    _info: object,
    uploadHandler: SunUploadHandler,
  ): boolean => {
    try {
      (async () => {
        const formData = new FormData();
        formData.append('image', files[0]);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/editor/upload`, {
          method: 'POST',
          headers: {
            ...(accessToken ? { authorization: `${accessToken}` } : {}),
          },
          body: formData,
          credentials: 'include',
        });

        const data = await res.json();
        if (data?.result) {
          uploadHandler({ result: data.result });
        } else {
          uploadHandler('Image upload failed');
        }
      })();
    } catch (e) {
      uploadHandler('Image upload failed');
    }
    // Prevent default base64 insertion; we'll handle via uploadHandler
    return false;
  };
  const handleSubmit = async (data: any, reset: any) => {
    console.log(data.secondaryImage, 'data.secondaryImage');
    const formData = new FormData();
    const body = {
      title: data.title,
      descriptions: content,
      category: data.category,
    };

    formData.append('data', JSON.stringify(body));

    if (data.displayImage) {
      formData.append('displayImage', data.displayImage);
    }
    if (data.secondaryImage) {
      data.secondaryImage.forEach((image: any) => {
        formData.append('secondaryImage', image);
      });
    }

    const bannerResponse = await handleAsyncWithToast(async () => {
      return updateBlogMutation({ id, formData });
    });

    if (bannerResponse?.data?.success) {
      reset();
      router.push(`/dashboard/blog-management`);
    }
  };

  useEffect(() => {
    if (getSingleBlogQuery?.data?.blog?.descriptions) {
      setContent(getSingleBlogQuery?.data?.blog?.descriptions);
    }
  }, [getSingleBlogQuery?.data]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <div>
      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="space-y-6"
      >
        <div className="bg-[#F9F8FF] p-3 md:p-6 rounded-lg space-y-4">
          <MyFormInput
            name="title"
            label="Title "
            value={getSingleBlogQuery?.data?.blog?.title}
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <MyFormInput
            name="category"
            label="Category "
            placeHolder="e.g. Technology, Health, etc."
      value={getSingleBlogQuery?.data?.blog?.category}
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="">
            <SunEditor
              onChange={(data: string) => {
                setContent(data);
              }}
              onImageUploadBefore={onImageUploadBefore}
              setOptions={options}
              setContents={content}
            />
          </div>
          {/* <MyFormImageUpload
            name="image"
            defaultValue={getSingleBlogQuery?.data?.image}
            label="Image"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            previewImageClassName="max-h-96"
          /> */}

    <MyFormImageUpload
            name="displayImage"
            label="Display Image"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            previewImageClassName="h-96  overflow-hidden"
            multiple={false}
            maxImages={1}
               defaultValue={    getSingleBlogQuery?.data?.blog?.displayImage}
               />
          <MyFormImageUpload
            name="secondaryImage"
            label="Secondary Image"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            previewImageClassName="h-96  overflow-hidden"
            maxImages={3}
            defaultValue={getSingleBlogQuery?.data?.blog?.secondaryImages}

          />
        </div>

        <div className="flex flex-col items-center gap-4">
      <Button className="py-2 mb-4" type="default" htmlType="submit">
            Update
          </Button>
        </div>
      </MyFormWrapper>
    </div>
  );
};

export default UpdateBlog;
