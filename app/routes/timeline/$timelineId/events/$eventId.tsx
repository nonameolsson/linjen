import { ExclamationIcon } from '@heroicons/react/solid'
import type { Location } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useCatch, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { DeleteEventDialog } from '~/components/delete-event-dialog'
import EventCard from '~/components/event-card'
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

  return (
    <Form method='post' id='delete-event'>
      <DeleteEventDialog
        title='Delete event'
        description='Are you sure you want to delete this event?'
        isOpen={isOpen}
        icon={
          <ExclamationIcon
            className='w-6 h-6 text-red-600'
            aria-hidden='true'
          />
        }
        onCloseClick={() => setIsOpen(false)}
        leftButton={
          <button
            form='delete-event'
            type='submit'
            className='inline-flex justify-center py-2 px-4 w-full text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm sm:ml-3 sm:w-auto sm:text-sm'
          >
            Delete
          </button>
        }
        rightButton={
          <button form='delete-event' type='submit'>
            delete
          </button>
        }
      />

      <EventCard
        locations={data.event.location}
        onDeleteClick={() => setIsOpen(true)}
        title={data.event.title}
        events={referencedEvents}
        content={data.event.content}
        startDate={data.event.startDate}
      />
    </Form>
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
