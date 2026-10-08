import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentUser } from "../api";
import { login, logout, sessionExpired } from "./authSlice";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  getCurrentUser,
  {
    condition: (_, { getState }) => getState().user.status !== "loading",
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearUser(state) {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.profile = action.payload.user || null;
        state.status = state.profile ? "succeeded" : "idle";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.profile = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(sessionExpired, (state) => {
        state.profile = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.profile = action.payload.user;
        state.status = "succeeded";
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.profile = null;
        state.status = "failed";
        state.error = action.error.message || "Unable to load user profile";
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
