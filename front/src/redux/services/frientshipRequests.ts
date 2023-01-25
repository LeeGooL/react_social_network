import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const friendshipRequestsApi = createApi({
  reducerPath: 'friendshipRequests',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/friendshipRequests' }),
  endpoints: (builder) => ({
    getRequests: builder.query<{ toUsers: UserDataType[]; fromUsers: UserDataType[] }, void>({
      query: () => `/`,
    }),
    createRequest: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'POST',
      }),
    }),
    revokeRequest: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useCreateRequestMutation,
  useRevokeRequestMutation,
} = friendshipRequestsApi;
