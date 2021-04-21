import { FunctionComponent, useEffect } from 'react'
import { Provider } from 'react-redux'
import logout from './ocAuth/logout'
import { setConfig, OcConfig } from './ocConfig'
import ocStore from './ocStore'
import { getUser } from './ocUser'

interface OcProviderProps {
  config: OcConfig
}

const OcProvider: FunctionComponent<OcProviderProps> = ({ children, config }) => {
  useEffect(() => {
    const { ocConfig, ocAuth, ocUser } = ocStore.getState()
    if (!ocConfig.value) {
      ocStore.dispatch(setConfig(config))
    }
    if (ocAuth.isAnonymous && !ocAuth.isAuthenticated) {
      ocStore.dispatch(logout())
    } else if (ocAuth.isAuthenticated && !ocUser.user) {
      ocStore.dispatch(getUser())
    }
  }, [config])

  return <Provider store={ocStore}>{children}</Provider>
}

export default OcProvider
