import { PlusIcon } from '@heroicons/react/solid'
import type { Event, Timeline } from '@prisma/client'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import { Page } from '~/components/page'
import { getAllEventsForUser } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  events: (Event & Timeline['title'])[]
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

  return (
    <Page title='Events'>
      <Link
        to='/event/new'
        className='fixed right-4 bottom-4 shadow-2xl drop-shadow-2xl btn btn-primary btn-circle btn-xl'
      >
        <PlusIcon className='w-5 h-5' aria-hidden='true' />
      </Link>
      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {data.events.map(event => (
              <tr className='hover:cursor-pointer hover:hover' key={event.id}>
                <td className='p-0'>
                  <Link className='flex p-4' to={`/event/${event.id}`}>
                    {event.title}
                  </Link>
                </td>
                <td className='p-0'>
                  <Link className='flex p-4' to={`/event/${event.id}`}>
                    {new Intl.DateTimeFormat('sv-SE').format(
                      new Date(event.startDate)
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </Page>
  )
}
