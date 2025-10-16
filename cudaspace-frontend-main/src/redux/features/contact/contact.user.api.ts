 
import { baseApi } from '../../api/baseApi';

const contactUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContactTicket: builder.mutation({
      query: (data) => {
        return {
          url: 'contact',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['contact'],
    }),
  }),
});

export const { useCreateContactTicketMutation } = contactUserApi;
