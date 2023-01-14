import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type RelationshipPayloadType = {
  isOwn: boolean;
  isFriend: boolean;
  hasRequestTo: boolean;
  hasRequestFrom: boolean;
};

export const relationshipApi = createApi({
  reducerPath: 'relationshipApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/relationship' }),
  endpoints: (builder) => ({
    getRelationship: builder.query<RelationshipPayloadType, number>({
      query: (id) => `/${id}`,
    }),
  }),
});

export const { useGetRelationshipQuery } = relationshipApi;
