import { CalendarIcon } from '@heroicons/react/outline'

import { ExclamationIcon } from '@heroicons/react/solid'

import { GlobeIcon, UsersIcon } from '@heroicons/react/solid'

import { Container, Menu } from '@mantine/core'

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
import { IconEdit, IconTrash } from '@tabler/icons'
import { useState } from 'react'
import invariant from 'tiny-invariant'

import { Modal, OverflowButton } from '~/components'
import { Page } from '~/components/page'
import type { Timeline } from '~/models/timeline.server'
import { deleteTimeline, getTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

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
  // const navigate = useNavigate()
  // const { tabValue } = useParams()

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
      toolbarButtons={
        <Menu shadow='md' width={200} position='bottom-end'>
          <Menu.Target>
            <OverflowButton />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconEdit size={14} />} component={Link} to='edit'>
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={openDeleteModal}
              color='red'
              icon={<IconTrash size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        //<OverflowButton onDeleteClick={openDeleteModal} />
      }
    >
      {/* <DesktopTabs
          tabs={[
            { name: 'Events', linkTo: 'events' },
            { name: 'Places', linkTo: 'places' },
            { name: 'People', linkTo: 'people' }
          ]}
        /> */}
      <Container>
        {/* <Tabs value={tabValue} onTabChange={value => navigate(value)}>
          <Tabs.List>
            <Tabs.Tab value='events'>Events</Tabs.Tab>
            <Tabs.Tab value='places'>Places</Tabs.Tab>
            <Tabs.Tab value='people'>People</Tabs.Tab>
          </Tabs.List>
        </Tabs> */}

        <Outlet />

        <div>
          <NavLink to='events'>
            <CalendarIcon className='h-5 w-5' />
            <span className='btm-nav-label'>Events</span>
          </NavLink>
          <NavLink to='places'>
            <GlobeIcon className='h-5 w-5' />
            <span className='btm-nav-label'>Places</span>
          </NavLink>
          <NavLink to='people'>
            <UsersIcon className='h-5 w-5' />
            <span className='btm-nav-label'>People</span>
          </NavLink>

          <Modal
            icon={
              <ExclamationIcon
                className='h-6 w-6 text-red-600'
                aria-hidden='true'
              />
            }
            isOpen={isOpen}
            closeModal={closeDeleteModal}
            title='Delete timeline'
            description='The events, places and people will not be deleted.'
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
                  <button type='submit' className='btn btn-error'>
                    Delete
                  </button>
                </Form>
              </>
            }
          />
        </div>
      </Container>
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
