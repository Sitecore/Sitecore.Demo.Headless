import { createSlice, SerializedError } from '@reduxjs/toolkit'
import { Me, MeUser, RequiredDeep } from 'ordercloud-javascript-sdk'
import { createOcAsyncThunk, OcThrottle } from '../ocReduxHelpers'

interface ocUserState {
  user?: MeUser
  loading: boolean
  error?: SerializedError
}

const initialState: ocUserState = {
  loading: false,
}

const userThrottle: OcThrottle = {
  location: 'ocUser',
  property: 'loading',
}

export const getUser = createOcAsyncThunk<RequiredDeep<MeUser>, undefined>(
  'ocUser/get',
  async () => {
    return Me.Get()
  },
  userThrottle
)

export const updateUser = createOcAsyncThunk<Partial<MeUser>, RequiredDeep<MeUser>>(
  'ocUser/update',
  async (data) => {
    return Me.Patch(data)
  }
)

const ocUserSlice = createSlice({
  name: 'ocUser',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
    })
    builder.addCase(getUser.rejected, (state, action) => {
      state.user = undefined
      state.error = action.error
      state.loading = false
    })
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error
      state.loading = false
    })
  },
})

export const { clearUser } = ocUserSlice.actions

export default ocUserSlice.reducer
