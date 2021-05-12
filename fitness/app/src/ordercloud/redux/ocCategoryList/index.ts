import { createSlice, SerializedError } from "@reduxjs/toolkit";
import {
  Category,
  Filters,
  ListPage,
  Me,
  Meta,
} from "ordercloud-javascript-sdk";
import { createOcAsyncThunk } from "../ocReduxHelpers";

export interface OcCategoryListOptions {
  catalogID?: string;
  productID?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  depth?: string;
  filters?: Filters;
}

interface OcProductListState {
  loading: boolean;
  error?: SerializedError;
  options?: OcCategoryListOptions;
  items?: Category[];
  meta?: Meta;
}

const initialState: OcProductListState = {
  loading: false,
};

interface SetListOptionsResult {
  response: ListPage<Category>;
  options: OcCategoryListOptions;
}

export const setListOptions = createOcAsyncThunk<
  SetListOptionsResult,
  OcCategoryListOptions
>("ocCategoryList/setOptions", async (options) => {
  const response = await Me.ListCategories(options);
  return {
    response,
    options,
  };
});

const ocCategoryListSlice = createSlice({
  name: "ocCategoryList",
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.loading = false;
      state.error = undefined;
      state.items = undefined;
      state.meta = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setListOptions.pending, (state, action) => {
      state.loading = true;
      state.error = undefined;
      state.options = action.meta.arg;
    });
    builder.addCase(setListOptions.fulfilled, (state, action) => {
      state.items = action.payload.response.Items;
      state.meta = action.payload.response.Meta;
      state.options = action.payload.options;
      state.loading = false;
    });
    builder.addCase(setListOptions.rejected, (state, action) => {
      state.error = action.error;
      console.log("test");
      state.loading = false;
    });
  },
});

export const { clearCategories } = ocCategoryListSlice.actions;

export default ocCategoryListSlice.reducer;
