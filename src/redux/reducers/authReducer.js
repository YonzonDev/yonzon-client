import { createSlice } from "@reduxjs/toolkit";
import { signin } from "../actions/authAction";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    isAuthenticated: false,
  },
  reducers: {
    storeAuth: (state, action) => {
      state.user = action.payload;
    },
    updateAuthFields: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    signout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.isAuthenticated = false;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "fulfilled";
        state.isAuthenticated = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = "rejected";
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { storeAuth, updateAuthFields, signout } = authSlice.actions;

export default authSlice.reducer;