import { createSlice, SerializedError } from "@reduxjs/toolkit";
import {
  BuyerProduct,
  Filters,
  ListPageWithFacets,
  Me,
  MetaWithFacets,
} from "ordercloud-javascript-sdk";
import { createOcAsyncThunk } from "../ocReduxHelpers";

export interface OcProductListOptions {
  catalogID?: string;
  categoryID?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  depth?: string;
  searchOn?: string[];
  sortBy?: string[];
  filters?: Filters;
}

interface OcProductListState {
  loading: boolean;
  error?: SerializedError;
  options?: OcProductListOptions;
  items?: BuyerProduct[];
  meta?: MetaWithFacets;
}

const initialState: OcProductListState = {
  loading: false,
};

interface SetListOptionsResult {
  response: ListPageWithFacets<BuyerProduct>;
  options: OcProductListOptions;
}

export const setListOptions = createOcAsyncThunk<
  SetListOptionsResult,
  OcProductListOptions
>("ocProducts/setOptions", async (options) => {
  const response = await Me.ListProducts(options);
  return {
    response,
    options,
  };
});

const ocProductListSlice = createSlice({
  name: "ocProductList",
  initialState,
  reducers: {
    clearProducts: (state) => {
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
      state.loading = false;
    });
    builder.addCase(setListOptions.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export const { clearProducts } = ocProductListSlice.actions;

export default ocProductListSlice.reducer;
