import { Alert, List, Table } from '@mantine/core'
import type { Event, Timeline } from '@prisma/client'
import { Link, useLoaderData, useLocation } from '@remix-run/react'
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

const pageTitle = 'Events'

export default function EventsPage() {
  const data = useLoaderData<LoaderData>()
  const location = useLocation()

  const rows = data.events.map(event => {
    const link = `/event/${event.id}?from=${location.pathname}`

    return (
      <tr className='hover:hover hover:cursor-pointer' key={event.id}>
        <td className='p-0'>
          <Link className='flex p-4' to={link}>
            {event.title}
          </Link>
        </td>
        <td className='p-0'>
          <Link className='flex p-4' to={link}>
            {new Intl.DateTimeFormat('sv-SE').format(new Date(event.startDate))}
          </Link>
        </td>
        <td className='p-0'>
          <Link key={event.id} className='flex flex-col p-4' to={link}>
            {event.timelines.map(timeline => (
              <span key={timeline.id} className='flex'>
                {timeline.title}
              </span>
            ))}
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <Page title={pageTitle}>
      <List>
        {data.events.map(event => (
          <List.Item key={event.id}>{event.title}</List.Item>
        ))}
      </List>

      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Date</th>
            <th>Timelines</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
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
            <Alert color='red'>{error.message}</Alert>
          </section>
        </main>
      </div>
    </Page>
  )
}
