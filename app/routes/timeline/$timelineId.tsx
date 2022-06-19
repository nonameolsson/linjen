import { PencilIcon, TrashIcon, XIcon } from '@heroicons/react/outline'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useCatch,
  useLoaderData
} from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Page } from '~/components/page'
import type { Timeline } from '~/models/timeline.server'
import { deleteTimeline, getTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  timeline: Timeline
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const timeline = await getTimeline({ createdById: userId, id: params.timelineId })
  if (!timeline) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ timeline })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  await deleteTimeline({ userId, id: params.timelineId })

  return redirect('/timelines')
}

export default function TimelineDetailsPage() {
  const data = useLoaderData() as LoaderData

  return (
    <Page
      description={data.timeline.description}
      title={data.timeline.title}
      actions={
        <>
          <Link
            to='/timelines'
            className='inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-sm'
          >
            <XIcon className='mr-2 -ml-0.5 w-4 h-4' aria-hidden='true' />
            Close
          </Link>
          <Form method='post'>
            <button
              type='submit'
              className='inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-white bg-red-600 hover:bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-sm'
            >
              <TrashIcon className='mr-2 -ml-0.5 w-4 h-4' aria-hidden='true' />
              Delete
            </button>
          </Form>
          <Link
            to='edit'
            className='inline-flex items-center py-2 px-4 ml-3 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-orange-800 shadow-sm'
          >
            <PencilIcon className='mr-2 -ml-0.5 w-4 h-4' aria-hidden='true' />
            Edit
          </Link>
        </>
      }
    >
      <div>
        <div className='sm:hidden'>
          <label htmlFor='tabs' className='sr-only'>
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id='tabs'
            name='tabs'
            className='block py-2 pr-10 pl-3 w-full text-base rounded-md border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            defaultValue='events'
          >
            <option>Events</option>
            <option>People</option>
            <option>Places</option>
          </select>
        </div>
        <div className='hidden sm:block'>
          <div className='border-b border-gray-200'>
            <nav className='flex -mb-px space-x-8' aria-label='Tabs'>
              <NavLink
                to='events'
                className={({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                  }`
                }
              >
                Events
              </NavLink>
              <NavLink
                to='places'
                className={({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                  }`
                }
              >
                Places
              </NavLink>
              <NavLink
                to='people'
                className={({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
                  }`
                }
              >
                People
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      <Outlet />
    </Page>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Timeline not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
