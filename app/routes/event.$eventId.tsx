import {
  ExclamationIcon,
  PaperClipIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/outline'
import { CheckIcon, ThumbUpIcon, UserIcon } from '@heroicons/react/solid'
import type { Location, Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useCatch, useLoaderData } from '@remix-run/react'
import classNames from 'classnames'
import { title } from 'process'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import { Modal, OverflowButton, Page } from '~/components'
import { Content } from '~/components/content'
import type { Event } from '~/models/event.server'
import { deleteEvent, getEvent } from '~/models/event.server'
import { requireUserId } from '~/session.server'
const user = {
  name: 'Whitney Francis',
  email: 'whitney@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80'
}
const navigation = [
  { name: 'Dashboard', href: '#' },
  { name: 'Jobs', href: '#' },
  { name: 'Applicants', href: '#' },
  { name: 'Company', href: '#' }
]
const breadcrumbs = [
  { name: 'Jobs', href: '#', current: false },
  { name: 'Front End Developer', href: '#', current: false },
  { name: 'Applicants', href: '#', current: true }
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
]
const attachments = [
  { name: 'resume_front_end_developer.pdf', href: '#' },
  { name: 'coverletter_front_end_developer.pdf', href: '#' }
]
const eventTypes = {
  applied: { icon: UserIcon, bgColorClass: 'bg-gray-400' },
  advanced: { icon: ThumbUpIcon, bgColorClass: 'bg-blue-500' },
  completed: { icon: CheckIcon, bgColorClass: 'bg-green-500' }
}
const timeline = [
  {
    id: 1,
    type: eventTypes.applied,
    content: 'Applied to',
    target: 'Front End Developer',
    date: 'Sep 20',
    datetime: '2020-09-20'
  },
  {
    id: 2,
    type: eventTypes.advanced,
    content: 'Advanced to phone screening by',
    target: 'Bethany Blake',
    date: 'Sep 22',
    datetime: '2020-09-22'
  },
  {
    id: 3,
    type: eventTypes.completed,
    content: 'Completed phone screening with',
    target: 'Martha Gardner',
    date: 'Sep 28',
    datetime: '2020-09-28'
  },
  {
    id: 4,
    type: eventTypes.advanced,
    content: 'Advanced to interview by',
    target: 'Bethany Blake',
    date: 'Sep 30',
    datetime: '2020-09-30'
  },
  {
    id: 5,
    type: eventTypes.completed,
    content: 'Completed interview with',
    target: 'Katherine Snyder',
    date: 'Oct 4',
    datetime: '2020-10-04'
  }
]
const comments = [
  {
    id: 1,
    name: 'Leslie Alexander',
    date: '4d ago',
    imageId: '1494790108377-be9c29b29330',
    body: 'Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.'
  },
  {
    id: 2,
    name: 'Michael Foster',
    date: '4d ago',
    imageId: '1519244703995-f4e0f30006d5',
    body: 'Et ut autem. Voluptatem eum dolores sint necessitatibus quos. Quis eum qui dolorem accusantium voluptas voluptatem ipsum. Quo facere iusto quia accusamus veniam id explicabo et aut.'
  },
  {
    id: 3,
    name: 'Dries Vincent',
    date: '4d ago',
    imageId: '1506794778202-cad84cf45f1d',
    body: 'Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.'
  }
]
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
        <main className='col-span-12'>
          {/* Page header */}
          <div className='mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8'>
            <div className='flex items-center space-x-5'>
              <div className='flex-shrink-0'>
                <div className='relative'>
                  <img
                    className='h-16 w-16 rounded-full'
                    src='https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
                    alt=''
                  />
                  <span
                    className='absolute inset-0 rounded-full shadow-inner'
                    aria-hidden='true'
                  />
                </div>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Ricardo Cooper
                </h1>
                <p className='text-sm font-medium text-gray-500'>
                  Applied for{' '}
                  <a href='#' className='text-gray-900'>
                    Front End Developer
                  </a>{' '}
                  on <time dateTime='2020-08-25'>August 25, 2020</time>
                </p>
              </div>
            </div>
            <div className='justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3'>
              <button
                type='button'
                className='inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100'
              >
                Disqualify
              </button>
              <button
                type='button'
                className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100'
              >
                Advance to offer
              </button>
            </div>
          </div>

          <div className='mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2 lg:col-start-1'>
              {/* Description list*/}
              <section aria-labelledby='applicant-information-title'>
                <div className='bg-white shadow sm:rounded-lg'>
                  <div className='px-4 py-5 sm:px-6'>
                    <h2
                      id='applicant-information-title'
                      className='text-lg font-medium leading-6 text-gray-900'
                    >
                      Applicant Information
                    </h2>
                    <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                      Personal details and application.
                    </p>
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
                          ipsum aliquip consequat sint. Sit id mollit nulla
                          mollit nostrud in ea officia proident. Irure nostrud
                          pariatur mollit ad adipisicing reprehenderit deserunt
                          qui eu.
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Attachments
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          <ul
                            role='list'
                            className='divide-y divide-gray-200 rounded-md border border-gray-200'
                          >
                            {attachments.map(attachment => (
                              <li
                                key={attachment.name}
                                className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'
                              >
                                <div className='flex w-0 flex-1 items-center'>
                                  <PaperClipIcon
                                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                                    aria-hidden='true'
                                  />
                                  <span className='ml-2 w-0 flex-1 truncate'>
                                    {attachment.name}
                                  </span>
                                </div>
                                <div className='ml-4 flex-shrink-0'>
                                  <a
                                    href={attachment.href}
                                    className='font-medium text-blue-600 hover:text-blue-500'
                                  >
                                    Download
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <a
                      href='#'
                      className='block bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 sm:rounded-b-lg'
                    >
                      Read full application
                    </a>
                  </div>
                </div>
              </section>

              {/* Comments*/}
              <section aria-labelledby='notes-title'>
                <div className='bg-white shadow sm:overflow-hidden sm:rounded-lg'>
                  <div className='divide-y divide-gray-200'>
                    <div className='px-4 py-5 sm:px-6'>
                      <h2
                        id='notes-title'
                        className='text-lg font-medium text-gray-900'
                      >
                        Notes
                      </h2>
                    </div>
                    <div className='px-4 py-6 sm:px-6'>
                      <ul role='list' className='space-y-8'>
                        {comments.map(comment => (
                          <li key={comment.id}>
                            <div className='flex space-x-3'>
                              <div className='flex-shrink-0'>
                                <img
                                  className='h-10 w-10 rounded-full'
                                  src={`https://images.unsplash.com/photo-${comment.imageId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                  alt=''
                                />
                              </div>
                              <div>
                                <div className='text-sm'>
                                  <a
                                    href='#'
                                    className='font-medium text-gray-900'
                                  >
                                    {comment.name}
                                  </a>
                                </div>
                                <div className='mt-1 text-sm text-gray-700'>
                                  <p>{comment.body}</p>
                                </div>
                                <div className='mt-2 space-x-2 text-sm'>
                                  <span className='font-medium text-gray-500'>
                                    {comment.date}
                                  </span>{' '}
                                  <span className='font-medium text-gray-500'>
                                    &middot;
                                  </span>{' '}
                                  <button
                                    type='button'
                                    className='font-medium text-gray-900'
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className='bg-gray-50 px-4 py-6 sm:px-6'>
                    <div className='flex space-x-3'>
                      <div className='flex-shrink-0'>
                        <img
                          className='h-10 w-10 rounded-full'
                          src={user.imageUrl}
                          alt=''
                        />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <form action='#'>
                          <div>
                            <label htmlFor='comment' className='sr-only'>
                              About
                            </label>
                            <textarea
                              id='comment'
                              name='comment'
                              rows={3}
                              className='block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                              placeholder='Add a note'
                              defaultValue={''}
                            />
                          </div>
                          <div className='mt-3 flex items-center justify-between'>
                            <a
                              href='#'
                              className='group inline-flex items-start space-x-2 text-sm text-gray-500 hover:text-gray-900'
                            >
                              <QuestionMarkCircleIcon
                                className='h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                                aria-hidden='true'
                              />
                              <span>Some HTML is okay.</span>
                            </a>
                            <button
                              type='submit'
                              className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            >
                              Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section
              aria-labelledby='timeline-title'
              className='lg:col-span-1 lg:col-start-3'
            >
              <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
                <h2
                  id='timeline-title'
                  className='text-lg font-medium text-gray-900'
                >
                  Timeline
                </h2>

                {/* Activity Feed */}
                <div className='mt-6 flow-root'>
                  <ul role='list' className='-mb-8'>
                    {timeline.map((item, itemIdx) => (
                      <li key={item.id}>
                        <div className='relative pb-8'>
                          {itemIdx !== timeline.length - 1 ? (
                            <span
                              className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200'
                              aria-hidden='true'
                            />
                          ) : null}
                          <div className='relative flex space-x-3'>
                            <div>
                              <span
                                className={classNames(
                                  item.type.bgColorClass,
                                  'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
                                )}
                              >
                                <item.type.icon
                                  className='h-5 w-5 text-white'
                                  aria-hidden='true'
                                />
                              </span>
                            </div>
                            <div className='flex min-w-0 flex-1 justify-between space-x-4 pt-1.5'>
                              <div>
                                <p className='text-sm text-gray-500'>
                                  {item.content}{' '}
                                  <a
                                    href='#'
                                    className='font-medium text-gray-900'
                                  >
                                    {item.target}
                                  </a>
                                </p>
                              </div>
                              <div className='whitespace-nowrap text-right text-sm text-gray-500'>
                                <time dateTime={item.datetime}>
                                  {item.date}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='justify-stretch mt-6 flex flex-col'>
                  <button
                    type='button'
                    className='inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  >
                    Advance to offer
                  </button>
                </div>
              </div>
            </section>
          </div>

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
                  <dt className='text-sm font-medium text-gray-500'>Name</dt>
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
                  <dd className='mt-1 text-sm text-gray-900'>ADD NEW FIELD!</dd>
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
                    Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                    incididunt cillum culpa consequat. Excepteur qui ipsum
                    aliquip consequat sint. Sit id mollit nulla mollit nostrud
                    in ea officia proident. Irure nostrud pariatur mollit ad
                    adipisicing reprehenderit deserunt qui eu.
                  </dd>
                </div>
                <div className='sm:col-span-2'>
                  <dt className='text-sm font-medium text-gray-500'>Links</dt>
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

        {/* <aside className='hidden xl:col-span-4 xl:block'>
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
                          className='flex items-center space-x-3 py-4'
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
                                <a href={location.title}>{location.title}</a>
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
                          className='flex items-center space-x-3 py-4'
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
                                <a href={timeline.title}>{timeline.title}</a>
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
        </aside> */}
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
