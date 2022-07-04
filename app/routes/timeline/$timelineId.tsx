import { Menu, Transition } from '@headlessui/react'
import { CalendarIcon } from '@heroicons/react/outline'
import {
  DotsVerticalIcon,
  PencilAltIcon,
  TrashIcon
} from '@heroicons/react/solid'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useCatch,
  useLoaderData
} from '@remix-run/react'
import { Fragment } from 'react'
import invariant from 'tiny-invariant'
import { Page } from '~/components/page'
import type { Timeline } from '~/models/timeline.server'
import { deleteTimeline, getTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

function OverflowButton() {
  return (
    <Menu as='div' className='flex items-stretch'>
      <div className='dropdown-end dropdown'>
        <Menu.Button className='btn btn-ghost rounded-btn'>
          <span className='sr-only'>Open options</span>
          <DotsVerticalIcon className='h-5 w-5' aria-hidden='true' />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items
            as='ul'
            className='dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow'
          >
            <Menu.Item as='li'>
              <Link to='edit'>
                <PencilAltIcon
                  className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                  aria-hidden='true'
                />
                Edit
              </Link>
            </Menu.Item>
            <Menu.Item as='li'>
              <Form method='post' className="flex flex-col p-0">
                <button type='submit' className="btn-block flex gap-x-3 px-4 py-3">
                  <TrashIcon
                    className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                    aria-hidden='true'
                  />
                  Delete
                </button>
              </Form>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  )
}

type LoaderData = {
  timeline: Timeline
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const timeline = await getTimeline({
    userId,
    id: params.timelineId
  })
  if (!timeline) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ timeline })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  await deleteTimeline({ userId, id: params.timelineId })

  return redirect('/timelines')
}

export default function TimelineDetailsPage() {
  const data = useLoaderData<LoaderData>()

  return (
    <Page
      showBackButton
      goBackTo='/timelines'
      title={data.timeline.title}
      toolbarButtons={
        <OverflowButton />
        // <Link
        //   to={`/timeline/${data.timeline.id}/edit`}
        //   className='btn btn-ghost btn-circle'
        // >
        //   <PencilIcon className='h-5 w-5' />
        // </Link>
      }
    >
      <Outlet />

      <div className='btm-nav'>
        <NavLink to='events'>
          <CalendarIcon className='h-5 w-5' />
          <span className='btm-nav-label'>Events</span>
        </NavLink>
        <NavLink to='places'>
          <CalendarIcon className='h-5 w-5' />
          <span className='btm-nav-label'>Places</span>
        </NavLink>
        <NavLink to='people'>
          <CalendarIcon className='h-5 w-5' />
          <span className='btm-nav-label'>People</span>
        </NavLink>
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
    return <div>Timeline not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
