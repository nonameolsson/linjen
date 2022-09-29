import { Menu, Tabs, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { openConfirmModal } from '@mantine/modals'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Link,
  Outlet,
  useCatch,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit
} from '@remix-run/react'
import {
  IconCalendarEvent,
  IconEdit,
  IconFriends,
  IconMap,
  IconTrash
} from '@tabler/icons'
import invariant from 'tiny-invariant'

import { BottomNavigation, OverflowButton, Page } from '~/components'
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
  const submit = useSubmit()
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { pathname } = useLocation()

  function openDeleteModal() {
    openConfirmModal({
      title: 'Delete timeline',
      children: (
        <Text size='sm'>
          Do you really want to delete this timeline? Events, places and people
          will not be deleted.
        </Text>
      ),

      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () =>
        submit(null, {
          method: 'post',
          action: `timeline/${data.timeline.id}`,
          replace: true
        })
    })
  }

  const currentTab = pathname.split('/').pop()

  return (
    <Page
      padding={0}
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

      <Outlet />
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
