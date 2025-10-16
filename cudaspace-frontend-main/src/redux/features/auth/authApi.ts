import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'auth/login-with-email',
          method: 'POST',
          body: userInfo,
        };
      },
      invalidatesTags: ['user'],
    }),
    logout: builder.mutation({
      query: () => {
        return {
          url: 'auth/logout',
          method: 'POST',
          // body: userInfo,
        };
      },
      invalidatesTags: ['user'],
    }),
    loginWithGoogle: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'google-login',
          method: 'POST',
          body: userInfo,
        };
      },
      invalidatesTags: ['user'],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'auth/forgot-password',
          method: 'POST',
          body: userInfo,
        };
      },
      invalidatesTags: ['user'],
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'auth/reset-password',
          method: 'POST',
          body: userInfo,
        };
      },
      invalidatesTags: ['user'],
    }),
    changePassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'auth/change-password',
          method: 'PUT',
          body: userInfo,
        };
      },
      invalidatesTags: ['user'],
    }),
    updateUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'auth/update-profile',
          method: 'PATCH',
          body: userInfo,
        };
      },
      invalidatesTags: ['user'],
    }),
    register: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'auth/create-customer',
          method: 'POST',
          body: userInfo,
        };
      },
    }),
    subscribeNewsLetter: builder.mutation({
      query: (data) => {
        return {
          url: 'newsletter',
          method: 'POST',
          body: data,
        };
      },
    }),

    otp: builder.mutation({
      query: (userInfo) => {
        return {
          url: 'auth/otp-enter',
          method: 'POST',
          body: userInfo,
        };
      },
    }),
    getMe: builder.query({
      query: () => ({
        url: 'auth/get-my-profile',
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    googleLogin: builder.mutation({
      query: (body) => ({
        url: 'auth/login-with-google',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['user'],
    }),
    // googleLogin: builder.mutation({
    //   query: () => {
    //     return {
    //       url: "auth/login-with-google",
    //       method: "POST",
    //     };
    //   },
    // }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useLoginWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useOtpMutation,
  useGetMeQuery,
  useGoogleLoginMutation,
  useChangePasswordMutation,
  useSubscribeNewsLetterMutation,
} = authApi;
