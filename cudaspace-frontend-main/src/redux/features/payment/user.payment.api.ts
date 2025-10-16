 
import { baseApi } from '../../api/baseApi';

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllPackage: builder.query({
    //   query: (data) => {
    //     const params = new URLSearchParams();
    //     if (data) {
    //       data?.forEach((item: any) => {
    //         params.append(item.name, item.value as string);
    //       });
    //     }
    //     return {
    //       url: `package/display-packages`,
    //       method: 'GET',
    //       params: params,
    //     };
    //   },
    //   providesTags: ['package'],
    // }),
    // getSingleExample: builder.query({
    //   query: (id) => ({
    //     url: `example/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["example"],
    // }),

    purchasePackage: builder.mutation({
      query: (data) => {
        return {
          url: 'package/purchase-package',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['package', 'users', 'order'],
    }),

    cryptoPayment: builder.mutation({
      query: (data) => {
        return {
          url: 'package/crypto-subscription',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['package', 'users', 'order'],
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

export const { usePurchasePackageMutation, useCryptoPaymentMutation } = paymentApi;
