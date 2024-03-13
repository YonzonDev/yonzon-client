import { createSlice } from "@reduxjs/toolkit";
import { changePassword } from "../actions/userAction";

const changePasswordSlice = createSlice({
  name: "password",
  initialState: {
    user: null,
    status: "idle",
  },
  reducers: {
    storePassword: (state, action) => {
      state.user = action.payload;
    },
    updatePasswordFields: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    signout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "fulfilled";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export default changePasswordSlice.reducer;
