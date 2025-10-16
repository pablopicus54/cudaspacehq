 
import { baseApi } from '../../api/baseApi';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `admin/get-all-user`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['users'],
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `admin/user-service/${id}`,
        method: 'GET',
      }),
      providesTags: ['users'],
    }),

    // createExample: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: "example",
    //       method: "POST",
    //       body: data,
    //     };
    //   },
    //   invalidatesTags: ["example"],
    // }),

    updateUserStatus: builder.mutation({
      query: (data) => {
        return {
          url: `admin/update-user-status/${data?.id}`,
          method: 'PATCH',
          body: data?.formData,
        };
      },
      invalidatesTags: ['users'],
    }),
    // deleteExample: builder.mutation({
    //   query: (id) => {
    //     return {
    //       url: `example/${id}`,
    //       method: "DELETE",
    //     };
    //   },
    //   invalidatesTags: ["example"],
    // }),
  }),
});

export const {
useGetAllUserQuery,
useGetSingleUserQuery,
useUpdateUserStatusMutation,
} = userApi;
