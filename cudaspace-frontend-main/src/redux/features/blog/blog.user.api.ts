 
import { baseApi } from '../../api/baseApi';

const blogUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlog: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `blog`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['blog'],
    }),
    getSingleBlog: builder.query({
      query: (id) => ({
        url: `blog/${id}`,
        method: 'GET',
      }),
      providesTags: ['blog'],
    }),
    createBlog: builder.mutation({
      query: (data) => {
        return {
          url: 'blog',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['blog'],
    }),

    updateBlog: builder.mutation({
      query: (data) => {
        return {
          url: `blog/${data?.id}`,
          method: 'PATCH',
          body: data?.formData,
        };
      },
      invalidatesTags: ['blog'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => {
        return {
          url: `blog/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['blog'],
    }),
  }),
});

export const {
  useGetAllBlogQuery,
  useGetSingleBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogUserApi;
