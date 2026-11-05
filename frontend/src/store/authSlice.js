import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../api";

try {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
} catch (error) {
  console.error("Unable to clear legacy authentication tokens:", error);
}

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  getCurrentUser,
  {
    condition: (_, { getState }) => getState().auth.status !== "checking",
  },
);

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const { rememberMe, ...loginCredentials } = credentials;
  return loginUser({ ...loginCredentials, rememberMe });
});
export const register = createAsyncThunk("auth/register", registerUser);
export const requestReset = createAsyncThunk("auth/requestReset", requestPasswordReset);
export const reset = createAsyncThunk(
  "auth/resetPassword",
  ({ token, password }) => resetPassword(token, password),
);
export const logout = createAsyncThunk("auth/logout", logoutUser);

const initialState = {
  isAuthenticated: false,
  status: "idle",
  error: null,
  resetUrl: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) {
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = "Your session expired. Please log in again.";
    },
    clearAuthFeedback(state) {
      state.error = null;
      state.message = null;
      state.resetUrl = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.error = action.error.message || "Unable to log in";
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = "checking";
      })
      .addCase(restoreSession.fulfilled, (state) => {
        state.status = "idle";
        state.isAuthenticated = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to create your account";
      })
      .addCase(requestReset.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
        state.resetUrl = null;
      })
      .addCase(requestReset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.resetUrl = action.payload.resetUrl || null;
      })
      .addCase(requestReset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to request a password reset";
      })
      .addCase(reset.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(reset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(reset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to reset your password";
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to log out";
      });
  },
});

export const { clearAuthFeedback, sessionExpired } = authSlice.actions;
export default authSlice.reducer;
