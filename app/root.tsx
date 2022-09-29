import { MantineProvider } from '@mantine/core'
import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react'
import { NotFound } from './components'

import type { EnvironmentVariables } from './entry.server'
import { getUser } from './session.server'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Linjen',
  viewport:
    'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
})

type LoaderData = {
  ENV: EnvironmentVariables
  user: Awaited<ReturnType<typeof getUser>>
}

export async function loader({ request }: LoaderArgs) {
  const ENV: EnvironmentVariables = {
    LOG_ROCKET_APP_ID: process.env.LOG_ROCKET_APP_ID || ''
  }

  return json({
    ENV,
    user: await getUser(request)
  })
}

export default function App() {
  const data = useLoaderData<LoaderData>()

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang='en' style={{ height: '100vh' }}>
        <head>
          <Meta />
          <link rel='manifest' href='/resources/manifest.json' />
          <Links />
        </head>
        <body style={{ height: '100vh', overflow: 'hidden' }}>
          <Outlet />
          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`
            }}
          />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  )
}

export function CatchBoundary() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html>
        <head>
          <title>Oops!</title>
          <Meta />
          <link rel='manifest' href='/resources/manifest.json' />
          <Links />
        </head>
        <body>
          <NotFound />
          <Scripts />
        </body>
      </html>
    </MantineProvider>
  )
}
