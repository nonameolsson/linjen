import type { Event, Timeline } from '@prisma/client'
import { Outlet, useLoaderData } from '@remix-run/react'
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
  console.log(data)
  return (
    <Page title='Events'>
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
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>
                  {new Intl.DateTimeFormat('sv-SE').format(
                    new Date(event.startDate)
                  )}
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
