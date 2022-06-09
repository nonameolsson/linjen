import { useState } from 'react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useCatch, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { ExclamationIcon } from '@heroicons/react/solid'

import EventCard from '~/components/event-card'
import { DeleteEventDialog } from '~/components/delete-event-dialog'
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

  return json<LoaderData>({ event })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.eventId, 'eventId not found')

  await deleteEvent({ userId, id: params.eventId })

  return redirect(`/timeline/${params.timelineId}/events`)
}

export default function EventDetailsPage() {
  const data = useLoaderData<LoaderData>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Form method='post' id='delete-event'>
      <DeleteEventDialog
        title='Delete event'
        description='Are you sure you want to delete this event?'
        isOpen={isOpen}
        icon={
          <ExclamationIcon
            className='h-6 w-6 text-red-600'
            aria-hidden='true'
          />
        }
        onCloseClick={() => setIsOpen(false)}
        leftButton={
          <button
            form='delete-event'
            type='submit'
            className='inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
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
        onDeleteClick={() => setIsOpen(true)}
        title={data.event.title}
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
