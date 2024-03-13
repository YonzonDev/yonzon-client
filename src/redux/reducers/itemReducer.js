import { combineReducers } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import {
  getItem,
  getItems,
  addItem,
  updateItem,
  deleteItem,
  addTransaction,
  getTransactions,
  getCSV,
} from "../actions/itemAction";

const getItemSlice = createSlice({
  name: "getItem",
  initialState: {
    item: null,
    status: "idle",
    error: null,
  },
  reducers: {
    storeItems: (state, action) => {
      state.item = action.payload;
    },
    updateItemFields: (state, action) => {
      state.item = { ...state.item, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.item = action.payload;
        state.status = "fulfilled";
      })
      .addCase(getItem.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "rejected";
      });
  },
});

const getItemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    storeItems: (state, action) => {
      state.items = action.payload;
    },
    updateItemFields: (state, action) => {
      state.items = { ...state.items, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(getItems.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "rejected";
      });
  },
});

const addItemSlice = createSlice({
  name: "addItem",
  initialState: {
    item: null,
    status: "idle",
    error: null,
  },
  reducers: {
    addItem: (state, action) => {
      state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.item = action.payload;
        state.status = "fulfilled";
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "rejected";
      });
  },
});

const updateItemSlice = createSlice({
  name: "updateItem",
  initialState: {
    item: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateItem: (state, action) => {
      state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.item = action.payload;
        state.status = "fulfilled";
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "rejected";
      });
  },
});

const deleteItemSlice = createSlice({
  name: "deleteItem",
  initialState: {
    item: null,
    status: "idle",
    error: null,
  },
  reducers: {
    deleteItem: (state, action) => {
      state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.item = action.payload;
        state.status = "fulfilled";
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "rejected";
      });
  },
});

const addTransactionSlice = createSlice({
  name: "addTransaction",
  initialState: {
    item: null,
    status: "idle",
    error: null,
  },
  reducers: {
    addTransaction: (state, action) => {
      state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTransaction.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.item = action.payload;
        state.status = "fulfilled";
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "rejected";
      });
  },
});

const getTransactionsSlice = createSlice({
  name: "getTransactions",
  initialState: {
    transactions: [],
    status: "idle",
    error: null,
  },
  reducers: {
    storeTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    updateTransactionFields: (state, action) => {
      state.transactions = { ...state.transactions, ...action.transactions };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.data;
        state.status = "fulfilled";
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "rejected";
      });
  },
});

const getCSVSlice = createSlice({
  name: "getCSV",
  initialState: {
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCSV.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getCSV.fulfilled, (state) => {
        state.status = "fulfilled";
      })
      .addCase(getCSV.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "rejected";
      });
  },
});

const itemReducer = combineReducers({
  getItem: getItemSlice.reducer,
  getItems: getItemsSlice.reducer,
  addItem: addItemSlice.reducer,
  updateItem: updateItemSlice.reducer,
  deleteItem: deleteItemSlice.reducer,
  addTransaction: addTransactionSlice.reducer,
  getTransactions: getTransactionsSlice.reducer,
  getCSV: getCSVSlice.reducer,
});

export default itemReducer;
