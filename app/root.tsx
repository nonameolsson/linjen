import type { LoaderFunction, MetaFunction } from '@remix-run/node'
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

import type { EnvironmentVariables } from './entry.server'
import { getUser } from './session.server'

import { MantineProvider } from '@mantine/core'
// import tailwindStylesheetUrl from './styles/tailwind.css'

// export const links: LinksFunction = () => {
//   return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
// }

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

export const loader: LoaderFunction = async ({ request }) => {
  const ENV: EnvironmentVariables = {
    LOG_ROCKET_APP_ID: process.env.LOG_ROCKET_APP_ID || ''
  }

  return json<LoaderData>({
    ENV,
    user: await getUser(request)
  })
}

export default function App() {
  const data = useLoaderData<LoaderData>()

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html
        lang='en'
        className='h-screen scroll-smooth bg-gray-50'
        data-theme='light'
      >
        <head>
          <Meta />
          <link rel='manifest' href='/resources/manifest.json' />
          <Links />
        </head>
        <body className='h-screen overflow-hidden'>
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
