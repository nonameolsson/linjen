import { RemixBrowser } from '@remix-run/react'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { hydrate } from 'react-dom'

const appId: string = (process.env.LOG_ROCKET_APP_ID = 'cvy8on/linje')

LogRocket.init(appId)
setupLogRocketReact(LogRocket)

hydrate(<RemixBrowser />, document)
