import { Dialog, Menu, Transition } from '@headlessui/react'
import { CalendarIcon } from '@heroicons/react/outline'
import {
  DotsVerticalIcon,
  ExclamationIcon,
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
import { Fragment, useState } from 'react'
import invariant from 'tiny-invariant'
import { Page } from '~/components/page'
import type { Timeline } from '~/models/timeline.server'
import { deleteTimeline, getTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

function DeleteModal({
  isOpen,
  closeModal
}: {
  isOpen: boolean
  closeModal: () => void
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={closeModal}
      >
        <div className='modal-open modal modal-bottom sm:modal-middle'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel>
              <div className='modal-box'>
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                    <ExclamationIcon
                      className='h-6 w-6 text-red-600'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <Dialog.Title
                      as='h3'
                      className="text-lg font-bold"
                    >
                      Delete timeline
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p>The events, places and people will not be deleted.</p>
                    </div>
                  </div>
                </div>

                <div className='modal-action'>
                  <button
                    type='button'
                    className='btn-outline btn'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <Form replace method='post'>
                    <button
                      type='submit'
                      className='btn btn-error'
                      onClick={closeModal}
                    >
                      Delete
                    </button>
                  </Form>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

function OverflowButton({ onDeleteClick }: { onDeleteClick: () => void }) {
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
            <Menu.Item as='li' onClick={onDeleteClick}>
              <a>
                <TrashIcon
                  className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                  aria-hidden='true'
                />
                Delete
              </a>
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
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function closeDeleteModal() {
    setIsOpen(false)
  }

  function openDeleteModal() {
    setIsOpen(true)
  }

  return (
    <Page
      showBackButton
      goBackTo='/timelines'
      title={data.timeline.title}
      toolbarButtons={<OverflowButton onDeleteClick={openDeleteModal} />}
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
        <DeleteModal isOpen={isOpen} closeModal={closeDeleteModal} />
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
