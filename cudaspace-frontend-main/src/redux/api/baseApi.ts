import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout, setUser } from '../features/auth/authSlice';
// Handle refresh silently; remove disruptive modal prompts

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState).auth.access_token;
    headers.set('accept', 'application/json');
    if (access_token) {
      headers.set('authorization', `${access_token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result: any = await baseQuery(args, api, extraOptions);
  // Attempt token refresh on unauthorized or expired access token
  if (
    result?.error?.status === 401 ||
    result?.error?.data?.message === 'jwt expired'
  ) {
    try {
      const refreshToken = (api.getState() as RootState).auth.refresh_token;

      // if (!refreshToken) {
      //   api.dispatch(logout());
      //   Swal.fire({
      //     icon: "error",
      //     title: "Session Expired",
      //     text: "Please login again to continue",
      //   });
      //   return result;
      // }

      // Make a request to refresh the token
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${refreshToken}`,
          },
        },
      );

      const data = await res.json();
      if (data?.success) {
        const user = (api.getState() as RootState).auth.user;
        api.dispatch(
          setUser({ user, access_token: data.data.token, refresh_token: refreshToken }),
        );

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    'user',
    'users',
    'services',
    'example',
    'dashboard',
    'order',
    'blog',
    'contact',
    'testimonial',
    'package',
    'notification',
  ],
  endpoints: () => ({}),
});
