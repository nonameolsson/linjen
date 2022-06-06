import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import EventCard from '~/components/event-card'

import type { Event } from '~/models/event.server'
import { deleteEvent, getEvent } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  event: Event
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  invariant(params.eventId, 'eventId not found')

  const event = await getEvent({ id: params.eventId })
  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }
  console.log(event)
  return json<LoaderData>({ event })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.eventId, 'eventId not found')

  await deleteEvent({ userId, id: params.eventId })

  return redirect(`/timeline/${params.timelineId}/events`)
}

export default function EventDetailsPage() {
  const data = useLoaderData() as LoaderData

  return (
    <EventCard
      title={data.event.title}
      content={data.event.content}
      startDate={data.event.startDate}
    />
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Event not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
