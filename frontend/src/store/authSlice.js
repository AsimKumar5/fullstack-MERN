import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../api";

const loadToken = () => {
  try {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  } catch {
    return null;
  }
};

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const { rememberMe, ...loginCredentials } = credentials;
  const data = await loginUser({ ...loginCredentials, rememberMe });
  try {
    if (data.token) {
      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
        sessionStorage.removeItem("authToken");
      } else {
        sessionStorage.setItem("authToken", data.token);
        localStorage.removeItem("authToken");
      }
    }
  } catch (error) {
    console.error("Unable to persist the authentication token:", error);
  }
  return data;
});
export const register = createAsyncThunk("auth/register", registerUser);
export const requestReset = createAsyncThunk("auth/requestReset", requestPasswordReset);
export const reset = createAsyncThunk(
  "auth/resetPassword",
  ({ token, password }) => resetPassword(token, password),
);
export const logout = createAsyncThunk("auth/logout", async () => {
  const data = await logoutUser();
  try {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
  } catch (error) {
    console.error("Unable to remove the stored authentication token:", error);
  }
  return data;
});

const initialState = {
  token: loadToken(),
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
      state.token = null;
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
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to log in";
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
        state.token = null;
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
