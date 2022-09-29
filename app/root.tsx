import type { ColorScheme } from '@mantine/core'
import {
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider
} from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { StylesPlaceholder } from '@mantine/remix'
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

import { NewLinkDialog } from '~/components'
import type { EnvironmentVariables } from './entry.server'
import { getUser } from './session.server'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Linjen',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
})

type LoaderData = {
  ENV: EnvironmentVariables
  user: Awaited<ReturnType<typeof getUser>>
}

export async function loader({ request }: LoaderArgs) {
  // Environment Variables
  const ENV: EnvironmentVariables = {
    LOG_ROCKET_APP_ID: process.env.LOG_ROCKET_APP_ID || ''
  }

  return json({
    ENV,
    user: await getUser(request)
  })
}

createEmotionCache({ key: 'mantine' })

export default function App() {
  const data = useLoaderData<LoaderData>()

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

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
        <html lang='en'>
          <head>
            <StylesPlaceholder />
            <Meta />
            <link rel='manifest' href='/resources/manifest.json' />
            <Links />
          </head>
          <body>
            <ModalsProvider modals={{ newLink: NewLinkDialog }}>
              <Outlet />
              <ScrollRestoration />
            </ModalsProvider>
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
