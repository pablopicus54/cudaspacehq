 
import { baseApi } from '../../api/baseApi';

const userDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllUser: builder.query({
    //   query: (data) => {
    //     const params = new URLSearchParams();
    //     if (data) {
    //       data?.forEach((item: any) => {
    //         params.append(item.name, item.value as string);
    //       });
    //     }
    //     return {
    //       url: `admin/get-all-user`,
    //       method: "GET",
    //       params: params,
    //     };
    //   },
    //   providesTags: ["users"],
    // }),
    getUserDashboardStats: builder.query({
      query: () => {
        return {
          url: `user-service/dashboard-cards`,
          method: 'GET',
        };
      },
      providesTags: ['users', 'package'],
    }),
    getPurchasedServersForCurrentUser: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `user-service/get-all-servers`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['users', 'package'],
    }),
    getAllPurchasedServersForCurrentUser: builder.query({
      query: () => {
        return {
          url: `user-service/get-all-purchased-package`,
          method: 'GET',
        };
      },
      providesTags: ['users', 'package'],
    }),
    getCredentials: builder.query({
      query: (serverId) => {
        return {
          url: `user-service/get-credentials/${serverId}`,
          method: 'GET',
        };
      },
      providesTags: ['users', 'package'],
    }),
    getServerCurrentStatus: builder.query({
      query: (id) => {
        return {
          url: `user-service/get-server-current-status/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['users', 'package'],
    }),
    getAllOrder: builder.query({
      query: () => {
        return {
          url: `user-service/get-all-orders`,
          method: 'GET',
        };
      },
      providesTags: ['users', 'package'],
    }),
    getSingleOrder: builder.query({
      query: (id) => {
        return {
          url: `user-service/get-single-order/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['users', 'package'],
    }),
    updateOrderHostname: builder.mutation({
      query: ({ orderId, userName }: { orderId: string; userName: string }) => {
        return {
          url: `user-service/update-hostname/${orderId}`,
          method: 'PATCH',
          body: { userName },
        };
      },
      invalidatesTags: ['users', 'package'],
    }),
    sendRequestToAdmin: builder.mutation({
      query: ({ orderId, action }) => {
        console.log(orderId, action);
        return {
          url: `user-service/send-reset-password-notification/${orderId}`,
          method: 'POST',
          body: {
            issueType: action,
          },
        };
      },
      invalidatesTags: ['users'],
      // getSingleExample: builder.query({
      //   query: (id) => ({
      //     url: `example/${id}`,
      //     method: "GET",
      //   }),
      //   providesTags: ["example"],
      // }),
    }),
    // updateUserStatus: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: `admin/update-user-status/${data?.id}`,
    //       method: "PATCH",
    //       body: data?.formData,
    //     };
    //   },
    //   invalidatesTags: ["users"],
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
  useGetUserDashboardStatsQuery,
  useGetPurchasedServersForCurrentUserQuery,
  useGetCredentialsQuery,
  useGetServerCurrentStatusQuery,
  useGetAllPurchasedServersForCurrentUserQuery,
  useGetAllOrderQuery,
  useGetSingleOrderQuery,
  useSendRequestToAdminMutation,
  useUpdateOrderHostnameMutation,
} = userDashboardApi;
