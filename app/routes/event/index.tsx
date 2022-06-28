import type { Location } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import type { Event } from '~/models/event.server'
import { deleteEvent, getEvent } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  event: Event & {
    referencedBy: Event[]
    referencing: Event[]
    location: Location[]
  }
}

// TODO: Add Zod valiation on params
export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  invariant(params.eventId, 'eventId not found')

  const event = await getEvent(params.eventId)

  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ event })
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireUserId(request)
  invariant(params.eventId, 'eventId not found')

  await deleteEvent(params.eventId)

  return redirect(`/timeline/${params.timelineId}/events`)
}

export default function EventDetailsPage() {
  const data = useLoaderData<LoaderData>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const referencedEvents: Event[] = [
    ...data.event.referencedBy,
    ...data.event.referencing
  ]

  return <div>hejsadfasdf</div>
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
