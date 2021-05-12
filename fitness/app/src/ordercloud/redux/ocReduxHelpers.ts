import {
  AsyncThunk,
  AsyncThunkPayloadCreator,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import logout from "./ocAuth/logout";
import { OcRootState, OcThunkApi } from "./ocStore";

function getDescendantProp(obj, desc: string) {
  const arr = desc.split(".");
  let result = obj;
  while (arr.length) {
    result = result[arr.shift()];
  }
  return result;
}

export interface OcThrottle {
  location: keyof OcRootState;
  property: string;
}

export function createOcAsyncThunk<Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, OcThunkApi>,
  throttle?: OcThrottle
): AsyncThunk<Returned, ThunkArg, OcThunkApi> {
  return createAsyncThunk<Returned, ThunkArg, OcThunkApi>(
    typePrefix,
    async (args, thunkAPI) => {
      try {
        return await payloadCreator(args, thunkAPI);
      } catch (err) {
        if (err.isOrderCloudError) {
          switch (err.status) {
            case 401:
              thunkAPI.dispatch(logout());
              break;
            default:
              break;
          }
        }
        throw err;
      }
    },
    {
      condition: (arg, api) => {
        console.log("throttler condition hit");
        if (throttle) {
          const state = api.getState()[throttle.location];
          const isThrottled = getDescendantProp(state, throttle.property);
          if (typeof isThrottled === "boolean" && isThrottled) {
            return false;
          }
        }
        return true;
      },
    }
  );
}
