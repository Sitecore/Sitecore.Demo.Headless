import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { BuyerProduct, Me, Spec, Variant } from "ordercloud-javascript-sdk";
import { createOcAsyncThunk } from "../ocReduxHelpers";

interface OcProductDetailState {
  error?: SerializedError;
  product?: BuyerProduct;
  specs?: Spec[];
  variants?: Variant[];
}

const initialState: OcProductDetailState = {};

const getProductSpecs = createOcAsyncThunk<Spec[], string>(
  "ocProductDetail/getSpecs",
  async (productId) => {
    const response = await Me.ListSpecs(productId, { pageSize: 100 });
    return response.Items;
  }
);

const getProductVariants = createOcAsyncThunk<Variant[], string>(
  "ocProductDetail/getVariants",
  async (productId) => {
    const response = await Me.ListVariants(productId, { pageSize: 100 });
    return response.Items;
  }
);

export const setProductId = createOcAsyncThunk<BuyerProduct, string>(
  "ocProductDetail/setProductId",
  async (productId, ThunkAPI) => {
    const { ocProductList } = ThunkAPI.getState();

    let product = ocProductList.items
      ? ocProductList.items.find((p) => p.ID === productId)
      : undefined;

    if (!product) {
      product = await Me.GetProduct(productId);
    }

    if (product.SpecCount > 0) {
      ThunkAPI.dispatch(getProductSpecs(product.ID));
    }

    if (product.VariantCount > 0) {
      ThunkAPI.dispatch(getProductVariants(product.ID));
    }

    return product;
  }
);

const ocProductDetailSlice = createSlice({
  name: "ocProductDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setProductId.pending, (state) => {
      state.error = undefined;
      state.specs = undefined;
      state.variants = undefined;
      state.product = undefined;
    });
    builder.addCase(setProductId.fulfilled, (state, action) => {
      state.product = action.payload;
    });
    builder.addCase(setProductId.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(getProductSpecs.fulfilled, (state, action) => {
      state.specs = action.payload;
    });
    builder.addCase(getProductVariants.fulfilled, (state, action) => {
      state.variants = action.payload;
    });
  },
});

export default ocProductDetailSlice.reducer;
