import { ChevronRightIcon, PlusIcon } from '@heroicons/react/outline'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import invariant from 'tiny-invariant'
import type { Event } from '~/models/event.server'
import { getEventListItems } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  events: (Event & { relatedEvents: Event[] } & {
    relatedEventsRelation: Event[]
  })[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const events = await getEventListItems({ timelineId: params.timelineId })

  return json<LoaderData>({
    events
  })
}

export default function EventsTab() {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <div className='flex overflow-hidden flex-1 items-stretch'>
        <main className='overflow-y-auto flex-1 p-4'>
          {/* Primary column */}
          <section className='flex flex-col flex-1 min-w-0 h-full lg:order-last'>
            <div className='flex justify-between'>
              <Link
                to='new'
                className='flex items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-sm'
              >
                <PlusIcon className='mr-3 -ml-1 w-5 h-5' aria-hidden='true' />
                Add Event
              </Link>
            </div>
            {data.events.length > 0 ? (
              <div className='overflow-hidden mt-4 bg-white shadow sm:rounded-md'>
                <ul role='list' className='divide-y divide-gray-200'>
                  {data.events.map(event => (
                    <li key={event.title}>
                      <Link to={event.id} className='block hover:bg-gray-50'>
                        <div className='flex items-center p-4 sm:px-6'>
                          <div className='flex flex-1 items-center min-w-0'>
                            <div className='flex-1 px-4 min-w-0 md:grid md:grid-cols-2 md:gap-4'>
                              <div>
                                <p className='text-sm font-medium text-indigo-600 truncate'>
                                  {event.title}
                                </p>
                                <p className='text-sm font-medium text-indigo-600 truncate'>
                                  Relates to: {event.relatedEvents.length}
                                </p>
                                <p className='text-sm font-medium text-indigo-600 truncate'>
                                  Relates from:{' '}
                                  {event.relatedEventsRelation.length}
                                </p>
                                <p className='flex items-center mt-2 text-sm text-gray-500'>
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
                              className='w-5 h-5 text-gray-400'
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
        <aside className='hidden overflow-y-auto p-4 w-96 border-l border-gray-200 lg:block'>
          <Outlet />
        </aside>
      </div>
    </>
  )
}
