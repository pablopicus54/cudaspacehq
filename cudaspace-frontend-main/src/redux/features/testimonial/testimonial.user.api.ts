 
import { baseApi } from '../../api/baseApi';

const userTestimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestimonial: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `testimonial`,
          method: 'GET',
          params: params,
        };
      },
      providesTags: ['testimonial'],
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

export const { useGetAllTestimonialQuery } = userTestimonialApi;
