 
'use client';
import MyButton from '@/components/ui/MyButton/MyButton';
import MyFormImageUpload from '@/components/ui/MyForm/MyFormImageUpload/MyFormImageUpload';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import { useCreateBlogMutation } from '@/redux/features/blog/blog.user.api';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentToken } from '@/redux/features/auth/authSlice';
import { useState } from 'react';
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
    ['link', 'image'],
    // ['align', 'list', 'lineHeight'],
    // ['table', 'link', 'image'],
    // ["link", "image"],
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
  // description: z.string({
  //   required_error: "Description is required",
  // }),
  displayImage: z
    .union([
      z.string(),
      z.instanceof(File).refine((file) => (file ? file.size <= 50 * 1024 * 1024 : true), {
        message: 'Image size must be less than 50MB',
      }),
    ])
    .optional(),
});

const CreateBlog = () => {
  const [content, setContent] = useState('');
  const router = useRouter();
  const [createBlogMutation] = useCreateBlogMutation();
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
    const formData = new FormData();
    const body = {
      title: data.title,
      descriptions: content,
      category: data.category,
    };

    formData.append('data', JSON.stringify(body));

    if (data.displayImage instanceof File) {
      formData.append('displayImage', data.displayImage);
    }
    // Secondary images removed; only front image (displayImage) is uploaded

    const bannerResponse = await handleAsyncWithToast(async () => {
      return createBlogMutation(formData);
    });

    if (bannerResponse?.data?.success) {
      reset();
      router.push(`/dashboard/blog-management`);
    }
  };

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
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MyFormInput
            name="category"
            label="Category "
            placeHolder="e.g. Technology, Health, etc."
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* <MyFormTextArea
            name="description"
            label="Description"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}
          <div className="space-y-2">
            <label className="">
              Description{' '}
              <span className="text-[#808080]">
                (Write your blog content here)
              </span>
            </label>
            <SunEditor
              onChange={(data: string) => {
                setContent(data);
              }}
              onImageUploadBefore={onImageUploadBefore}
              setOptions={options}
              setContents={content}
            />
          </div>
          <MyFormImageUpload
            name="displayImage"
            label="Front Image"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            previewImageClassName="h-96  overflow-hidden"
            multiple={false}
            maxImages={1}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button className="py-2 mb-4" type="default" htmlType="submit">
            Create
          </Button>
        </div>
      </MyFormWrapper>
    </div>
  );
};

export default CreateBlog;
