import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL, headers } from "../constants/url";

import axios from "axios";

export const getItem = createAsyncThunk("item/get-item", async ({ id }) => {
  const response = await axios.get(`${baseURL}/get-item/${id}`, headers);
  return response.data;
});

export const getItems = createAsyncThunk("items/get-items", async () => {
  const response = await axios.get(`${baseURL}/get-items`);
  return response.data;
});

export const addItem = createAsyncThunk("add/add-item", async (items) => {
  const { model, product, price, quantity } = items;
  const response = await axios.post(
    `${baseURL}/add-item`,
    `model=${model}&product=${product}&price=${price}&quantity=${quantity}`,
    headers
  );
  return response.data;
});

export const updateItem = createAsyncThunk(
  "update/update-item",
  async (items) => {
    const { id, price, quantity } = items;
    const response = await axios.put(
      `${baseURL}/update-item`,
      `item_id=${id}&price=${price}&quantity=${quantity}`,
      headers
    );
    return response.data;
  }
);

export const deleteItem = createAsyncThunk("delete/delete-item", async (id) => {
  const response = await axios.delete(`${baseURL}/delete-item/${id}`, headers);
  return response.data;
});

export const addTransaction = createAsyncThunk(
  "transaction/add-transaction",
  async (items) => {
    const { id, model, product, orders, price, date } = items;
    const response = await axios.post(
      `${baseURL}/add-transaction`,
      `item_id=${id}&model=${model}&product=${product}&orders=${orders}&price=${price}&date=${date}`,
      headers
    );
    return response.data;
  }
);

export const getTransactions = createAsyncThunk(
  "transactions/get-transactions",
  async () => {
    const response = await axios.get(`${baseURL}/get-transactions`);
    return response.data;
  }
);

export const getCSV = createAsyncThunk("csv/get-csv", async () => {
  try {
    const response = await axios.get(`${baseURL}/get-csv`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw error;
  }
});
