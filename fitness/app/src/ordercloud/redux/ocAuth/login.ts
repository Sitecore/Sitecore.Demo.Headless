import { AccessToken, Auth, RequiredDeep, Tokens } from 'ordercloud-javascript-sdk'
import { createOcAsyncThunk } from '../ocReduxHelpers'
import { clearUser, getUser } from '../ocUser'

export interface LoginActionRequest {
  username: string
  password: string
  remember?: boolean
}

const login = createOcAsyncThunk<RequiredDeep<AccessToken>, LoginActionRequest>(
  'ocAuth/login',
  async (credentials, thunkAPI) => {
    const { ocConfig } = thunkAPI.getState()
    if (!ocConfig.value) {
      throw new Error('OrderCloud Provider was not properly configured')
    }

    thunkAPI.dispatch(clearUser())

    const response = await Auth.Login(
      credentials.username,
      credentials.password,
      ocConfig.value.clientId,
      ocConfig.value.scope
    )
    // thunkAPI.dispatch(cleanCatalogCache());
    Tokens.SetAccessToken(response.access_token)
    if (credentials.remember && response.refresh_token) {
      Tokens.SetRefreshToken(response.refresh_token)
    }
    thunkAPI.dispatch(getUser())
    return response
  }
)

export default login
