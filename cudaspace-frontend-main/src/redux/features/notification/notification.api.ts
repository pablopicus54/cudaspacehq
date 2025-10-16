 
import { baseApi } from '../../api/baseApi';

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `notification/get-notification`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['notification'],
    }),
    // getSingleExample: builder.query({
    //   query: (id) => ({
    //     url: `example/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["example"],
    // }),

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

    markAsReadSingleNotification: builder.mutation({
      query: (data) => {
        return {
          url: `notification/update-notification`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['notification'],
    }),
    markAsReadAllNotification: builder.mutation({
      query: (data) => {
        return {
          url: `notification/update-all-notification`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['notification'],
    }),
    deleteNotification: builder.mutation({
      query: (data) => {
        return {
          url: `notification/delete-notification`,
          method: 'DELETE',
          body: data,
        };
      },
      invalidatesTags: ['notification'],
    }),
    sendResetPassNotify: builder.mutation({
      query: ({orderId}) => {
        return {
          url: `user-service/send-reset-password-notification/${orderId}`,
          method: 'POST',
        };
      },
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {
  useGetAllNotificationQuery,
  useDeleteNotificationMutation,
  useMarkAsReadAllNotificationMutation,
  useMarkAsReadSingleNotificationMutation,
  useSendResetPassNotifyMutation,
} = notificationApi;
