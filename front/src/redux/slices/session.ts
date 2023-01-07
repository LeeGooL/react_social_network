import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

export type SessionState = {
  isLoading: boolean;
} & (
  | {
      isAuthenticated: false;
      user: null;
    }
  | {
      isAuthenticated: true;
      user: UserDataType;
    }
);

export const session = createAsyncThunk<UserDataType, void>('session/session', async (_, { rejectWithValue }) => {
  const response = await fetch('/api/session');

  if (response.status === 200) {
    return await response.json();
  }

  return rejectWithValue(await response.text());
});

const getInitialState = () => ({
  isLoading: false,
  isAuthenticated: false,
  user: null,
});

export const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(session.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(session.fulfilled, (state, action) => {
      state.isLoading = false;

      Object.assign(state, {
        isAuthenticated: true,
        user: action.payload,
      });
    });

    builder.addCase(session.rejected, (state) => {
      state.isLoading = false;

      Object.assign(state, {
        isAuthenticated: false,
        user: null,
      });
    });
  },
});

export const selectSessionData = (state: RootState) => state.session;

export default sessionSlice.reducer;