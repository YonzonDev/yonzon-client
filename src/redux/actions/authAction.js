import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL, headers } from "../constants/url";

import axios from "axios";

export const signin = createAsyncThunk(
  "auth/signin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}/signin`,
        `username=${username}&password=${password}`,
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
