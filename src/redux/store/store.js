import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import itemReducer from "../reducers/itemReducer";
import userReducer from "../reducers/userReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    item: itemReducer,
    user: userReducer,
  },
});

export default store;
