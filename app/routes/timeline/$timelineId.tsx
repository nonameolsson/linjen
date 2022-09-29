import { Menu, Text } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Link,
  Outlet,
  useCatch,
  useLoaderData,
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

import type { SubLink } from '~/components'
import { BottomNavigation, OverflowButton, Page, SubNavbar } from '~/components'
import type { Timeline } from '~/models/timeline.server'
import { deleteTimeline, getTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  timeline: Timeline
}

const SUBNAV_LINKS: SubLink[] = [
  {
    label: 'Events',
    to: 'events'
  },
  {
    label: 'Places',
    to: 'places'
  },
  {
    label: 'People',
    to: 'people'
  }
]

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
      onCancel: () => undefined,
      onConfirm: () =>
        submit(null, {
          method: 'post',
          action: `timeline/${data.timeline.id}`,
          replace: true
        })
    })
  }

  // const currentTab = pathname.split('/').pop()

  const overflowMenu: JSX.Element = (
    <Menu shadow='md' width={200} position='bottom-start'>
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
  )

  return (
    <Page
      padding={0}
      showBackButton
      goBackTo='/timelines'
      subNavigation={
        <SubNavbar
          buttons={overflowMenu}
          title={data.timeline.title}
          links={SUBNAV_LINKS}
        />
      }
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
      toolbarButtons={overflowMenu}
    >
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
