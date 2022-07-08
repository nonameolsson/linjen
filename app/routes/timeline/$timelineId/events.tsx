import { ChevronRightIcon } from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import {
  Link,
  useCatch,
  useLoaderData,
  useLocation,
  useParams
} from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import invariant from 'tiny-invariant'
import { Page } from '~/components'
import { Alert } from '~/components/alert'

import type { Event } from '~/models/event.server'
import { getEventListItemsForTimeline } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  events: Event[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const events = await getEventListItemsForTimeline({
    timelineId: params.timelineId
  })

  return json<LoaderData>({
    events
  })
}

export default function EventsTab() {
  const params = useParams()
  const location = useLocation()
  const data = useLoaderData<LoaderData>()

  return (
    <div className='flex flex-1 items-stretch overflow-hidden'>
      <main className='flex-1 overflow-y-auto p-4'>
        <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
          <Link
            to={`/event/new?timelineId=${params.timelineId}`}
            className='btn-xl btn btn-primary btn-circle fixed right-4 bottom-4 shadow-2xl drop-shadow-2xl'
          >
            <PlusIcon className='h-5 w-5' aria-hidden='true' />
          </Link>
          {data.events.length > 0 ? (
            <div className='overflow-hidden bg-white shadow sm:rounded-md'>
              <ul className='divide-y divide-gray-200'>
                {data.events.map(event => (
                  <li key={event.title}>
                    <Link
                      to={`/event/${event.id}?from=${location.pathname}`}
                      className='block hover:bg-gray-50'
                    >
                      <div className='flex items-center p-4 sm:px-6'>
                        <div className='flex min-w-0 flex-1 items-center'>
                          <div className='min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4'>
                            <div>
                              <p className='truncate text-sm font-medium text-indigo-600'>
                                {event.title}
                              </p>
                              <p className='mt-2 flex items-center text-sm text-gray-500'>
                                <span className='truncate'>
                                  {new Intl.DateTimeFormat('sv-SE').format(
                                    new Date(event.startDate)
                                  )}
                                </span>
                              </p>
                            </div>
                            <div className='hidden md:block'>
                              <div>
                                <p className='text-sm text-gray-900'>
                                  {event.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <ChevronRightIcon
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No events</p>
          )}
        </section>
      </main>

      {/* Secondary column (hidden on smaller screens) */}
      {/* <aside className='hidden overflow-y-auto p-4 w-96 border-l border-gray-200 lg:block'>
          <Outlet />
        </aside> */}
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <Page title={`${caught.status} ${caught.statusText}`}>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <h1>App Error</h1>
            <Alert text={`${caught.status} ${caught.statusText}`} />
          </section>
        </main>
      </div>
    </Page>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Page title='Uh-oh!'>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <h1>App Error</h1>
            <Alert text={error.message} />
          </section>
        </main>
      </div>
    </Page>
  )
}
