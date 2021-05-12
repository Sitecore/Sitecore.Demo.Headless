import {
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import { Category, Me } from "ordercloud-javascript-sdk";
import { createOcAsyncThunk } from "../ocReduxHelpers";

interface OcCategoryDetailState {
  error?: SerializedError;
  category?: Category;
}

const initialState: OcCategoryDetailState = {};

export const setCategoryId = createOcAsyncThunk<Category, string>(
  "ocProductDetail/setCategoryId",
  async (categoryId, ThunkAPI) => {
    const { ocCategoryList } = ThunkAPI.getState();

    let category = ocCategoryList.items
      ? ocCategoryList.items.find((c) => c.ID === categoryId)
      : undefined;

    if (!category) {
      category = await Me.GetCategory(categoryId, {
        catalogID: "OGifSGHohU6K7CzHXZnlNQ",
      });
    }

    return category;
  }
);

const ocCategoryDetailSlice = createSlice({
  name: "ocProductDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCategoryId.pending, (state) => {
      state.error = undefined;
      state.category = undefined;
    });
    builder.addCase(setCategoryId.fulfilled, (state, action) => {
      state.category = action.payload;
    });
    builder.addCase(setCategoryId.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export default ocCategoryDetailSlice.reducer;
