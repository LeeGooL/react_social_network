import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type CreatedUserPayloadType = {
  email: string;
  name: string;
  surname: string;
  password: string;
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserDataType[], void>({
      query: () => `/`,
    }),
    getUser: builder.query<UserDataType, number>({
      query: (id) => `/${id}`,
    }),
    createUser: builder.mutation<UserDataType, CreatedUserPayloadType>({
      query: (data) => ({ url: `/`, method: 'POST', body: data }),
    }),
    patchUser: builder.mutation<UserDataType, Partial<UserDataType>>({
      query: (data) => ({ url: `/`, method: 'PATCH', body: data }),
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery, useCreateUserMutation, usePatchUserMutation } = usersApi;
