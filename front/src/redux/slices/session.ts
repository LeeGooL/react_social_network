import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

export type SessionState = {
  isLoadingSignIn: boolean;
  isLoadingSession: boolean;
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

export type SigninPayloadType = { email: string; password: string };

export const signin = createAsyncThunk<UserDataType, SigninPayloadType>(
  'session/signin',
  async (signinData, { rejectWithValue }) => {
    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinData),
    });

    if (response.status === 200) {
      return await response.json();
    }

    return rejectWithValue(await response.text());
  },
);

export const signout = createAsyncThunk<UserDataType, void>('session/signout', async (_, { rejectWithValue }) => {
  const response = await fetch('/api/signout', { method: 'POST' });

  if (response.status === 200) {
    return await response.json();
  }

  return rejectWithValue(await response.text());
});

const getInitialState: () => SessionState = () => ({
  isLoadingSession: false,
  isLoadingSignIn: false,
  isAuthenticated: false,
  user: null,
});

export const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    // session
    builder.addCase(session.pending, (state) => {
      state.isLoadingSession = true;
    });

    builder.addCase(session.fulfilled, (state, action) => {
      state.isLoadingSession = false;

      Object.assign(state, {
        isAuthenticated: true,
        user: action.payload,
      });
    });

    builder.addCase(session.rejected, (state) => {
      state.isLoadingSession = false;

      Object.assign(state, {
        isAuthenticated: false,
        user: null,
      });
    });

    // signin
    builder.addCase(signin.pending, (state) => {
      state.isLoadingSignIn = true;
    });

    builder.addCase(signin.fulfilled, (state, action) => {
      state.isLoadingSignIn = false;

      Object.assign(state, {
        isAuthenticated: true,
        user: action.payload,
      });

      window.location.reload();
    });

    builder.addCase(signin.rejected, (state) => {
      state.isLoadingSignIn = false;

      Object.assign(state, {
        isAuthenticated: false,
        user: null,
      });
    });

    // signout
    builder.addCase(signout.pending, (state) => {
      state.isLoadingSignIn = true;

      Object.assign(state, {
        isAuthenticated: true,
        user: null,
      });
    });

    builder.addCase(signout.fulfilled, (state, action) => {
      state.isLoadingSignIn = false;
      window.location.reload();
    });

    builder.addCase(signout.rejected, (state, action) => {
      state.isLoadingSignIn = false;
      window.location.reload();
    });
  },
});

export const selectSessionData = (state: RootState) => state.session;

export default sessionSlice.reducer;
