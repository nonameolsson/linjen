import { ExclamationIcon } from '@heroicons/react/solid'

import { Menu, Tabs, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  Outlet,
  useCatch,
  useLoaderData,
  useLocation,
  useNavigate
} from '@remix-run/react'
import {
  IconCalendarEvent,
  IconEdit,
  IconFriends,
  IconMap,
  IconTrash
} from '@tabler/icons'
import { useState } from 'react'
import invariant from 'tiny-invariant'

import { BottomNavigation, Modal, OverflowButton } from '~/components'
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
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { pathname } = useLocation()

  function closeDeleteModal() {
    setIsOpen(false)
  }

  function openDeleteModal() {
    setIsOpen(true)
  }

  const currentTab = pathname.split('/').pop()

  return (
    <Page
      showBackButton
      goBackTo='/timelines'
      bottomNavigation={
        <BottomNavigation>
          <BottomNavigation.Button
            icon={<IconCalendarEvent />}
            to='events'
            title='Events'
          />
          <BottomNavigation.Button
            icon={<IconMap />}
            to='places'
            title='Places'
          />
          <BottomNavigation.Button
            icon={<IconFriends />}
            to='people'
            title='People'
          />
        </BottomNavigation>
      }
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
      }
    >
      {!isMobile && (
        <Tabs
          value={currentTab}
          onTabChange={(value: string) => navigate(value)}
        >
          <Tabs.List>
            <Tabs.Tab value='events'>Events</Tabs.Tab>
            <Tabs.Tab value='places'>Places</Tabs.Tab>
            <Tabs.Tab value='people'>People</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      )}

      {/* <Container fluid={true}> */}
      <Outlet />

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
      {/* </Container> */}
    </Page>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Timeline not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
