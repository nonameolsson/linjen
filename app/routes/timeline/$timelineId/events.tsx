import { ChevronRightIcon } from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import { Link, useLoaderData, useLocation, useParams } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { title } from 'process'
import invariant from 'tiny-invariant'
import { Fab } from '~/components'
import { Content } from '~/components/content'

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
    <Content title={title}>
      <Fab
        icon={<PlusIcon className='h-5 w-5' aria-hidden='true' />}
        offset={true}
        link={`/event/new?timelineId=${params.timelineId}`}
      />
      <main className='overflow-hidden col-span-12 lg:col-span-6 lg:col-start-4 lg:order-last'>
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
      </main>
    </Content>
  )
}
