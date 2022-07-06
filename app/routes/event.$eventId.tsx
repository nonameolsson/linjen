import { ExclamationIcon } from '@heroicons/react/outline'
import type { Location, Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useCatch, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { Modal, OverflowButton, Page } from '~/components'
import EventCard from '~/components/event-card'
import type { Event } from '~/models/event.server'
import { deleteEvent, getEvent } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  redirectTo?: string
  event: Event & {
    referencedBy: Event[]
    referencing: Event[]
    location: Location[]
    timelines: {
      id: Timeline['id']
      title: Timeline['title']
    }[]
  }
}

const DEFAULT_REDIRECT = 'timelines'

// TODO: Add Zod valiation on params
export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)

  invariant(params.eventId, 'eventId not found')

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('from') || undefined

  const event = await getEvent(params.eventId)
  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ event, redirectTo })
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, 'eventId not found')
  await requireUserId(request)

  deleteEvent(params.eventId)

  const formData = await request.formData()
  let redirectTo: string | undefined = DEFAULT_REDIRECT
  const optionalRedirect: string | undefined = formData
    .get('redirectTo')
    ?.toString()

  if (typeof optionalRedirect === 'string' && optionalRedirect.length > 0) {
    redirectTo = optionalRedirect
  }

  return redirect(redirectTo)
}

export default function EventDetailsPage() {
  const data = useLoaderData<LoaderData>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function closeDeleteModal() {
    setIsOpen(false)
  }

  function openDeleteModal() {
    setIsOpen(true)
  }

  const referencedEvents: Event[] = [
    ...data.event.referencedBy,
    ...data.event.referencing
  ]

  return (
    <Page
      title={data.event.title}
      showBackButton
      toolbarButtons={<OverflowButton onDeleteClick={openDeleteModal} />}
    >
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <EventCard
              id={data.event.id}
              locations={data.event.location}
              title={data.event.title}
              events={referencedEvents}
              timelines={data.event.timelines}
              content={data.event.content}
              startDate={data.event.startDate}
            />

            <Modal
              icon={
                <ExclamationIcon
                  className='h-6 w-6 text-red-600'
                  aria-hidden='true'
                />
              }
              isOpen={isOpen}
              description='Do you really want to delete this event?'
              closeModal={closeDeleteModal}
              title='Delete event'
              buttons={
                <>
                  <button
                    type='button'
                    className='btn-outline btn'
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>
                  <Form replace method='post'>
                    <input
                      type='hidden'
                      defaultValue={data.redirectTo}
                      name='redirectTo'
                    />
                    <button type='submit' className='btn btn-error'>
                      Delete
                    </button>
                  </Form>
                </>
              }
            />
          </section>
        </main>
      </div>
    </Page>
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
