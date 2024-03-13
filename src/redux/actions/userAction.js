import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL, headers } from "../constants/url";

import axios from "axios";

export const changePassword = createAsyncThunk(
  "password/change-password",
  async ({ username, password, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}/change-password`,
        `username=${username}&password=${password}&new_password=${newPassword}`,
        headers
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized");
      }
      return rejectWithValue(error.message);
    }
  }
);
