import {
  ExclamationIcon,
  PaperClipIcon,
  PlusSmIcon
} from '@heroicons/react/outline'
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

const whoToFollow = [
  {
    name: 'Leonard Krasner',
    handle: 'leonardkrasner',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
  // More people...
]
const trendingPosts = [
  {
    id: 1,
    user: {
      name: 'Floyd Miles',
      imageUrl:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    body: 'What books do you have on your bookshelf just to look smarter than you actually are?',
    comments: 291
  }
  // More posts...
]

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
        <div className='py-10'>
          <div className='mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8'>
            <main className='lg:col-span-9 xl:col-span-6'>
              <section className='overflow-hidden bg-white shadow sm:rounded-lg'>
                <div className='px-4 py-5 sm:px-6'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    Event information
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    General information about event
                  </p>
                </div>
                <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
                  <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Name
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        {data.event.title}
                      </dd>
                    </div>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Start Date
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        {new Intl.DateTimeFormat('sv-SE').format(
                          new Date(data.event.startDate)
                        )}
                      </dd>
                    </div>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Some information
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        ADD NEW FIELD!
                      </dd>
                    </div>
                    <div className='sm:col-span-1'>
                      <dt className='text-sm font-medium text-gray-500'>
                        End Date
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>No date</dd>
                    </div>
                    <div className='sm:col-span-2'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Description
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        Fugiat ipsum ipsum deserunt culpa aute sint do nostrud
                        anim incididunt cillum culpa consequat. Excepteur qui
                        ipsum aliquip consequat sint. Sit id mollit nulla mollit
                        nostrud in ea officia proident. Irure nostrud pariatur
                        mollit ad adipisicing reprehenderit deserunt qui eu.
                      </dd>
                    </div>
                    <div className='sm:col-span-2'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Links
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900'>
                        <ul
                          role='list'
                          className='divide-y divide-gray-200 rounded-md border border-gray-200'
                        >
                          <li className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                            <div className='flex w-0 flex-1 items-center'>
                              <PaperClipIcon
                                className='h-5 w-5 flex-shrink-0 text-gray-400'
                                aria-hidden='true'
                              />
                              <span className='ml-2 w-0 flex-1 truncate'>
                                https://wol.jw.org/sv/wol/b/r14/lp-z/nwtsty/20/20#v=20:20:18
                              </span>
                            </div>
                          </li>
                          <li className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                            <div className='flex w-0 flex-1 items-center'>
                              <PaperClipIcon
                                className='h-5 w-5 flex-shrink-0 text-gray-400'
                                aria-hidden='true'
                              />
                              <span className='ml-2 w-0 flex-1 truncate'>
                                https://d34ji3l0qn3w2t.cloudfront.net/26a1b6ef-831f-4d6f-a761-fc1968956147/1/g_S_202207.pdf
                              </span>
                            </div>
                            <div className='ml-4 flex-shrink-0'>
                              <a
                                href='#'
                                className='font-medium text-indigo-600 hover:text-indigo-500'
                              >
                                Download
                              </a>
                            </div>
                          </li>
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>
            </main>
            <aside className='hidden xl:col-span-4 xl:block'>
              <div className='sticky top-4 space-y-4'>
                <section aria-labelledby='locations-heading'>
                  <div className='rounded-lg bg-white shadow'>
                    <div className='p-6'>
                      <h2
                        id='who-to-follow-heading'
                        className='text-base font-medium text-gray-900'
                      >
                        Locations
                      </h2>
                      <div className='mt-6 flow-root'>
                        <ul className='-my-4 divide-y divide-gray-200'>
                          {data.event.location.map(location => (
                            <li
                              key={location.id}
                              className='flex items-center py-4 space-x-3'
                            >
                              <Link to={`/location/${location.id}`}>
                                <div className='flex-shrink-0'>
                                  <img
                                    className='h-8 w-8 rounded-full'
                                    src='https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                    alt=''
                                  />
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <p className='text-sm font-medium text-gray-900'>
                                    <a href={location.title}>
                                      {location.title}
                                    </a>
                                  </p>
                                </div>
                                <div className='flex-shrink-0'>
                                  <button
                                    type='button'
                                    className='inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-sm font-medium text-rose-700 hover:bg-rose-100'
                                  >
                                    <PlusSmIcon
                                      className='-ml-1 mr-0.5 h-5 w-5 text-rose-400'
                                      aria-hidden='true'
                                    />
                                    <span>Follow</span>
                                  </button>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='mt-6'>
                        <a
                          href='#'
                          className='block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
                        >
                          Open all locations
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
                <section aria-labelledby='timelines-heading'>
                  <div className='rounded-lg bg-white shadow'>
                    <div className='p-6'>
                      <h2
                        id='timelines-heading'
                        className='text-base font-medium text-gray-900'
                      >
                        Timelines
                      </h2>
                      <div className='mt-6 flow-root'>
                        <ul className='-my-4 divide-y divide-gray-200'>
                          {data.event.timelines.map(timeline => (
                            <li
                              key={timeline.id}
                              className='flex items-center py-4 space-x-3'
                            >
                              <Link to={`/timeline/${timeline.id}`}>
                                <div className='flex-shrink-0'>
                                  <img
                                    className='h-8 w-8 rounded-full'
                                    src='https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                    alt=''
                                  />
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <p className='text-sm font-medium text-gray-900'>
                                    <a href={timeline.title}>
                                      {timeline.title}
                                    </a>
                                  </p>
                                </div>
                                <div className='flex-shrink-0'>
                                  <button
                                    type='button'
                                    className='inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-sm font-medium text-rose-700 hover:bg-rose-100'
                                  >
                                    <PlusSmIcon
                                      className='-ml-1 mr-0.5 h-5 w-5 text-rose-400'
                                      aria-hidden='true'
                                    />
                                    <span>Follow</span>
                                  </button>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='mt-6'>
                        <Link
                          to='/timelines'
                          className='block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
                        >
                          Open all timelines
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </aside>
          </div>
          <div className='grid grid-cols-1 gap-4 py-4 lg:grid-cols-4'>
            {/* <aside className='hidden xl:block xl:col-span-4'>
            <div className='sticky top-4 space-y-4'>
              <section aria-labelledby='who-to-follow-heading'>
                <div className='bg-white rounded-lg shadow'>
                  <div className='p-6'>
                    <h2
                      id='who-to-follow-heading'
                      className='text-base font-medium text-gray-900'
                    >
                      Who to follow
                    </h2>
                    <div className='mt-6 flow-root'>
                      <ul
                        role='list'
                        className='-my-4 divide-y divide-gray-200'
                      >
                        {whoToFollow.map(user => (
                          <li
                            key={user.handle}
                            className='flex items-center py-4 space-x-3'
                          >
                            <div className='flex-shrink-0'>
                              <img
                                className='h-8 w-8 rounded-full'
                                src={user.imageUrl}
                                alt=''
                              />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-sm font-medium text-gray-900'>
                                <a href={user.href}>{user.name}</a>
                              </p>
                              <p className='text-sm text-gray-500'>
                                <a href={user.href}>{'@' + user.handle}</a>
                              </p>
                            </div>
                            <div className='flex-shrink-0'>
                              <button
                                type='button'
                                className='inline-flex items-center px-3 py-0.5 rounded-full bg-rose-50 text-sm font-medium text-rose-700 hover:bg-rose-100'
                              >
                                <PlusSmIcon
                                  className='-ml-1 mr-0.5 h-5 w-5 text-rose-400'
                                  aria-hidden='true'
                                />
                                <span>Follow</span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='mt-6'>
                      <a
                        href='#'
                        className='w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                      >
                        View all
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              <section aria-labelledby='trending-heading'>
                <div className='bg-white rounded-lg shadow'>
                  <div className='p-6'>
                    <h2
                      id='trending-heading'
                      className='text-base font-medium text-gray-900'
                    >
                      Trending
                    </h2>
                    <div className='mt-6 flow-root'>
                      <ul
                        role='list'
                        className='-my-4 divide-y divide-gray-200'
                      >
                        {trendingPosts.map(post => (
                          <li key={post.id} className='flex py-4 space-x-3'>
                            <div className='flex-shrink-0'>
                              <img
                                className='h-8 w-8 rounded-full'
                                src={post.user.imageUrl}
                                alt={post.user.name}
                              />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-sm text-gray-800'>
                                {post.body}
                              </p>
                              <div className='mt-2 flex'>
                                <span className='inline-flex items-center text-sm'>
                                  <button
                                    type='button'
                                    className='inline-flex space-x-2 text-gray-400 hover:text-gray-500'
                                  >
                                    <ChatAltIcon
                                      className='h-5 w-5'
                                      aria-hidden='true'
                                    />
                                    <span className='font-medium text-gray-900'>
                                      {post.comments}
                                    </span>
                                  </button>
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='mt-6'>
                      <a
                        href='#'
                        className='w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                      >
                        View all
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </aside> */}

            {/* <div className='col-span-1 space-y-8 h-full overflow-y-scroll'>
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
          </div> */}
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
