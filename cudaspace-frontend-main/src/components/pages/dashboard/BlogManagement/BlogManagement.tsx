 
'use client';


import { useDeleteBlogMutation, useGetAllBlogQuery } from '@/redux/features/blog/blog.user.api';
import { getImageSrc } from '@/utils/getImageSrc';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { Button, Pagination } from 'antd';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


const   BlogManagement = () => {
  const [deleteBlogMutation] = useDeleteBlogMutation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: any }[]
  >([
    { name: 'page', value: page },
    { name: 'limit', value: pageSize },
  ]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllBlogQuery(objectQuery);

  useEffect(() => {
    setObjectQuery([
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
    ]);
  }, [page, pageSize]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const response = await handleAsyncWithToast(async () => {
        return deleteBlogMutation(id);
      });

      if (response?.data?.success) {
        setPage(1);
        Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
      }
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex  items-center justify-between mb-4 border-b pb-5">
        <div className="text-lg md:text-xl font-medium w-full  ">
          Blog Management
        </div>
        <Link href={'/dashboard/blog-management/create-blog'}>
          <button className="flex items-center gap-2 text-blue-primary border border-blue-primary px-3 py-2 rounded-md text-base font-medium whitespace-nowrap">
            <Plus /> <p>Add New</p>
          </button>
        </Link>
      </div>
      {/* <button >Update Content</button> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:col-span-4 gap-4">
        {response?.data?.data?.map((blog: any) => (
          <div key={blog.id} className="border p-4 rounded-lg shadow-md">
            <div className="relative w-full h-60 rounded-md overflow-hidden ">
              {/* <Image
                src={blog?.displayImage}
                alt={blog?.title}
                fill
                className="object-fill"
                priority
              /> */}
               <img
                        src={getImageSrc(blog?.displayImage)}
                              alt={blog?.title}
                           className="object-fill rounded-lg h-60"
                      />
            </div>
         <div className="flex flex-col justify-between  h-36">
             <h2 className="text-lg font-semibold mt-2 ">{blog.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Admin - {new Date(blog?.createdAt).toDateString()}
            </p>
            <div className="flex gap-2 mt-4">
              <Link className="w-fit" href={`/blogs/${blog?.id}`}>
                <Button className="" icon={<Eye size={16} />}>
                  View
                </Button>
              </Link>
              <Link href={`/dashboard/blog-management/${blog.id}`}>
                <Button type="default" icon={<Edit size={16} />}>
                  Edit
                </Button>
              </Link>
              <Button
                type="dashed"
                danger
                icon={<Trash2 size={16} />}
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </Button>
            </div>
         </div>
          </div>
        ))}
      </div>
      <div className="p-4 w-full flex justify-end">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={response?.data?.meta?.total}
          onChange={handlePaginationChange}
          // showSizeChanger
          // pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
};

export default BlogManagement;
