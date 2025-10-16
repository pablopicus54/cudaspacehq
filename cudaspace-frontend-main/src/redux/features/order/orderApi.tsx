 
import { baseApi } from '../../api/baseApi';

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => {
        return {
          url: `order`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['order'],
    }),
    getAllOrders: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `order`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['order'],
    }),
    // Admin: get order details by ID (rename to avoid collision with user-dashboard slice)
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `order/details-order/${id}`,
        method: 'GET',
      }),
      providesTags: ['order'],
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

    confirmOrder: builder.mutation({
      query: (data) => {
        return {
          url: `order/confirm-order/${data?.id}`,
          method: 'POST',
          body: data?.formData,
        };
      },
      invalidatesTags: ['order'],
    }),
    updateStatus: builder.mutation({
      query: (id) => {
        return {
          url: `order/update-order-status/${id}`,
          method: 'PATCH',
          body: {
            'status': 'Pending',
        },
        };
      },
      invalidatesTags: ['order'],
    }),
    extendPeriodEnd: builder.mutation({
      query: ({ id, payload }: { id: string; payload: { extendDays?: number; newEndDate?: string; reason?: string } }) => ({
        url: `order/extend-period-end/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['order'],
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
    useCreateOrderMutation,
    useGetAllOrdersQuery,
    useGetOrderDetailsQuery,
    useConfirmOrderMutation,
    useUpdateStatusMutation,
    useExtendPeriodEndMutation,
 } = orderApi;
