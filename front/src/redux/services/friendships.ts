import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const friendshipApi = createApi({
  reducerPath: 'friendship',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/friendships' }),
  endpoints: (builder) => ({
    getFriends: builder.query<UserDataType[], void>({
      query: () => `/`,
    }),
    removeFriend: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetFriendsQuery, useRemoveFriendMutation } = friendshipApi;
