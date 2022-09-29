import type { ColorScheme } from '@mantine/core'
import { ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
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
import { useState } from 'react'

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
  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme)
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
      >
        <html lang='en' style={{ height: '100%' }}>
          <head>
            <Meta />
            <link rel='manifest' href='/resources/manifest.json' />
            <Links />
          </head>
          <body style={{ height: '100%', overflow: 'hidden' }}>
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
    </ColorSchemeProvider>
  )
}

export function CatchBoundary() {
  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme)
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
        theme={{ activeStyles: { transform: 'scale(0.95)' } }}
      >
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
    </ColorSchemeProvider>
  )
}
