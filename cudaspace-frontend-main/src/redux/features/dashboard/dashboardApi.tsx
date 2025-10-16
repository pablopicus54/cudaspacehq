 
import { baseApi } from '../../api/baseApi';

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDashboardCounts: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `admin/get-admin-dashboard-cards`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['dashboard'],
    }),
    getAllPendingTask: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `admin/get-all-pending-task`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['dashboard'],
    }),
    // getSingleExample: builder.query({
    //   query: (id) => ({
    //     url: `example/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["example"],
    // }),

    confirmRestartOrStop: builder.mutation({
      query: (id) => {
        return {
          url: `admin/confirm-restart-or-stop/${id}`,
          method: 'POST',
        };
      },
      invalidatesTags: ['dashboard'],
    }),

    // updateExample: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: `example/${data?.id}`,
    //       method: "POST",
    //       body: data?.formData,
    //     };
    //   },
    //   invalidatesTags: ["example"],
    // }),
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
  useGetAllDashboardCountsQuery,
  useGetAllPendingTaskQuery,
  useConfirmRestartOrStopMutation,
} = dashboardApi;
