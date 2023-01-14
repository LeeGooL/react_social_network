import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { relationshipApi } from './services/relationship';

import { usersApi } from './services/users';
import sessionReducer, { session } from './slices/session';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [relationshipApi.reducerPath]: relationshipApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware).concat(relationshipApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

store.dispatch(session());
