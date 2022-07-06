import { PlusIcon } from '@heroicons/react/solid'
import type { Event, Timeline } from '@prisma/client'
import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import { Page } from '~/components/page'
import { getAllEventsForUser } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  events: (Event & {
    timelines: { title: Timeline['title']; id: Timeline['id'] }[]
  })[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  const events = await getAllEventsForUser(userId)

  return json({
    events
  })
}

export default function EventsPage() {
  const data = useLoaderData<LoaderData>()
  const location = useLocation()
  console.log(data.events[0].timelines)
  return (
    <Page title='Events'>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <Link
              to='/event/new'
              className='btn-xl btn btn-primary btn-circle fixed right-4 bottom-4 shadow-2xl drop-shadow-2xl'
            >
              <PlusIcon className='h-5 w-5' aria-hidden='true' />
            </Link>
            <div className='overflow-x-auto'>
              <table className='table w-full'>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Start Date</th>
                    <th>Timelines</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map(event => {
                    const link = `/event/${event.id}?from=${location.pathname}`
                    return (
                      <tr
                        className='hover:hover hover:cursor-pointer'
                        key={event.id}
                      >
                        <td className='p-0'>
                          <Link className='flex p-4' to={link}>
                            {event.title}
                          </Link>
                        </td>
                        <td className='p-0'>
                          <Link className='flex p-4' to={link}>
                            {new Intl.DateTimeFormat('sv-SE').format(
                              new Date(event.startDate)
                            )}
                          </Link>
                        </td>
                        <td className='p-0'>
                          <Link
                            key={event.id}
                            className='flex flex-col p-4'
                            to={link}
                          >
                            {event.timelines.map(timeline => (
                              <span key={timeline.id} className='flex'>
                                {timeline.title}
                              </span>
                            ))}
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Outlet />
          </section>
        </main>
      </div>
    </Page>
  )
}
