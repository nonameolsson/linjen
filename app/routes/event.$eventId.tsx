import { ExclamationIcon } from '@heroicons/react/outline'
import type { Location, Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useCatch, useLoaderData } from '@remix-run/react'
import { title } from 'process'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { Modal, OverflowButton, Page } from '~/components'
import { Content } from '~/components/content'
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
      <Content title={title}>
        <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-4'>
          <div className='col-span-3'>
            <section aria-labelledby='applicant-information-title'>
              <div className='bg-white shadow sm:rounded-lg'>
                <div className='px-4 py-5 sm:px-6'>
                  <h2
                    id='applicant-information-title'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Applicant Information
                  </h2>
                </div>
                <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
                  <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Application for
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        Backend Developer
                      </dd>
                    </div>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Email address
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        ricardocooper@example.com
                      </dd>
                    </div>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Salary expectation
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>$120,000</dd>
                    </div>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Phone
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        +1 555-555-5555
                      </dd>
                    </div>
                    <div className='sm:col-span-2'>
                      <dt className='text-sm font-medium text-gray-500'>
                        About
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        Fugiat ipsum ipsum deserunt culpa aute sint do nostrud
                        anim incididunt cillum culpa consequat. Excepteur qui
                        ipsum aliquip consequat sint. Sit id mollit nulla mollit
                        nostrud in ea officia proident. Irure nostrud pariatur
                        mollit ad adipisicing reprehenderit deserunt qui eu.
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <a
                    href='#'
                    className='block bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 sm:rounded-b-lg'
                  >
                    Read full description
                  </a>
                </div>
              </div>
            </section>
          </div>
          <div className='col-span-1 space-y-8 h-full overflow-y-scroll'>
            <section className='overflow-hidden rounded-lg bg-white shadow'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium'>Locations</h3>
              </div>
              <div className='h-full bg-gray-50 px-4 py-5 sm:p-6'>
                <div className='overflow-hidden bg-white shadow sm:rounded-md'>
                  <ul className='divide-y divide-gray-200'>
                    {data.event.location.map(location => (
                      <li key={location.id} className='px-4 py-4 sm:px-6'>
                        {location.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
            <section className='overflow-hidden rounded-lg bg-white shadow'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium'>People</h3>
              </div>
              <div className='h-full bg-gray-50 px-4 py-5 sm:p-6'>
                To 765add....
              </div>
            </section>
            <section className='overflow-hidden rounded-lg bg-white shadow'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium'>Event details</h3>
              </div>
              <div className='h-full bg-gray-50 px-4 py-5 sm:p-6'>
                <p>{data.event.content}</p>
              </div>
            </section>
            <section className='overflow-hidden rounded-lg bg-white shadow'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium'>Related events</h3>
              </div>
              <div className='h-full bg-gray-50 px-4 py-5 sm:p-6'>
                <div className='overflow-hidden bg-white shadow sm:rounded-md'>
                  <ul className='divide-y divide-gray-200'>
                    {referencedEvents.map(event => (
                      <li key={event.id} className='px-4 py-4 sm:px-6'>
                        <Link to={`/event/${event.id}`}>{event.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className='overflow-hidden rounded-lg bg-white shadow'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium'>Exist in timeline</h3>
              </div>
              <div className='h-full bg-gray-50 px-4 py-5 sm:p-6'>
                <div className='overflow-hidden bg-white shadow sm:rounded-md'>
                  <ul className='divide-y divide-gray-200'>
                    {data.event.timelines.map(timeline => (
                      <li key={timeline.id} className='px-4 py-4 sm:px-6'>
                        <Link to={`/timeline/${timeline.id}/events`}>
                          {timeline.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>

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
                className='btn btn-outline'
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
      </Content>
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
