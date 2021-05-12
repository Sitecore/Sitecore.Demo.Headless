import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiRole, Configuration } from 'ordercloud-javascript-sdk'

export interface OcConfig {
  clientId: string
  scope: ApiRole[]
  baseApiUrl?: string
  allowAnonymous?: boolean
}

interface OcConfigState {
  value?: OcConfig
}

const initialState: OcConfigState = {}

const ocConfigSlice = createSlice({
  name: 'ocConfig',
  initialState,
  reducers: {
    setConfig: (state: OcConfigState, action: PayloadAction<OcConfig>) => {
      Configuration.Set({
        clientID: action.payload.clientId,
        baseApiUrl: action.payload.baseApiUrl,
      })
      state.value = action.payload
    },
  },
})

export const { setConfig } = ocConfigSlice.actions

export default ocConfigSlice.reducer
