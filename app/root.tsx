import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
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

import tailwindStylesheetUrl from './styles/tailwind.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Linje',
  viewport: 'width=device-width,initial-scale=1'
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
    <html lang='en' className='h-full bg-gray-100'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='h-full'>
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
  )
}
