import { RemixBrowser } from '@remix-run/react'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { hydrate } from 'react-dom'

import type { EnvironmentVariables } from './entry.server'

declare global {
  var ENV: EnvironmentVariables
}

const appId: string = window.ENV.LOG_ROCKET_APP_ID

LogRocket.init(appId)
setupLogRocketReact(LogRocket)

hydrate(<RemixBrowser />, document)
