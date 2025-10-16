 
import { baseApi } from '../../api/baseApi';

const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `package`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['services'],
    }),

    getSingleService: builder.query({
      query: (id) => ({
        url: `package/${id}`,
        method: 'GET',
      }),
      providesTags: ['services'],
    }),

    createService: builder.mutation({
      query: (data) => {
        return {
          url: 'package',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['services'],
    }),

    updateService: builder.mutation({
      query: (data) => {
        return {
          url: `package/${data?.id}`,
          method: 'PATCH',
          body: data?.formData,
        };
      },
      invalidatesTags: ['services'],
    }),
    deleteService: builder.mutation({
      query: (id) => {
        return {
          url: `package/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['services'],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetSingleServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = exampleApi;
