import { ExclamationIcon } from '@heroicons/react/outline'
import type { Location, Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useCatch, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import {
  ContentModule,
  LinkList,
  List,
  Modal,
  OverflowButton,
  Page,
  PageHeader
} from '~/components'
import { Content } from '~/components/content'
import { SidebarWidget } from '~/components/sidebar-widget'
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
      <Content
        aside={
          <div className='sticky top-4 space-y-4'>
            <SidebarWidget>
              <List
                title='Timelines'
                items={data.event.timelines.map(timeline => {
                  return {
                    linkTo: timeline.id,
                    title: timeline.title,
                    id: timeline.id
                  }
                })}
              />
            </SidebarWidget>

            <SidebarWidget>
              <List
                title='Events'
                items={referencedEvents.map(event => {
                  return {
                    title: event.title,
                    linkTo: event.id,
                    description: event.content || undefined,
                    id: event.id
                  }
                })}
              />
            </SidebarWidget>

            <SidebarWidget>
              <List
                title='Locations'
                items={data.event.location.map(location => {
                  return {
                    linkTo: `location/${location.id}`,
                    title: location.title,
                    id: location.id
                  }
                })}
              />
            </SidebarWidget>
          </div>
        }
        desktopNavbar={
          <PageHeader
            title={data.event.title}
            description='Last updated'
            descriptionExtra={new Intl.DateTimeFormat('sv-SE').format(
              new Date()
            )}
            actions={
              <>
                <button
                  onClick={openDeleteModal}
                  className='btn btn-error btn-outline'
                >
                  Delete
                </button>
                <Link to='edit' className='btn btn-primary'>
                  Edit
                </Link>
              </>
            }
          />
        }
      >
        <ContentModule title='Event Information'>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Start Date</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {new Intl.DateTimeFormat('sv-SE').format(
                  new Date(data.event.startDate)
                )}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>End Date</dt>
              <dd className='mt-1 text-sm text-gray-900'>END DATE HERE</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                Salary expectation
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>$120,000</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>End Date</dt>
              <dd className='mt-1 text-sm text-gray-900'>END DATE HERE</dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>Description</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {data.event.content}
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <LinkList
                title='Links'
                items={[
                  {
                    downloadable: false,
                    id: '1',
                    name: 'Jehovah',
                    href: 'https://wol.jw.org'
                  },
                  {
                    downloadable: true,
                    id: '1',
                    name: 'Jesus',
                    href: 'https://wol.jw.org'
                  }
                ]}
              />
            </div>
          </dl>
        </ContentModule>

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
