import {
  createStyles,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
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
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconEdit,
  IconFingerprint,
  IconFriends,
  IconGauge,
  IconHome2,
  IconMap,
  IconSettings,
  IconTrash,
  IconUser
} from '@tabler/icons'
import { useState } from 'react'
import invariant from 'tiny-invariant'

import { BottomNavigation, OverflowButton, Page } from '~/components'
import type { Timeline } from '~/models/timeline.server'
import { deleteTimeline, getTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

const useStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex'
  },

  aside: {
    flex: '0 0 60px',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`
  },

  main: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
  },

  mainLink: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0]
    }
  },

  mainLinkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color
    }
  },

  title: {
    boxSizing: 'border-box',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.md,
    paddingTop: 18,
    height: 60,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`
  },

  logo: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    paddingTop: theme.spacing.md,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    marginBottom: theme.spacing.xl
  },

  link: {
    boxSizing: 'border-box',
    display: 'block',
    textDecoration: 'none',
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}px`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: 44,
    lineHeight: '44px',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  linkActive: {
    '&, &:hover': {
      borderLeftColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor
      }).background,
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor
      }).background,
      color: theme.white
    }
  }
}))

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
const mainLinksMockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' }
]
const linksMockdata = [
  'Security',
  'Settings',
  'Dashboard',
  'Releases',
  'Account',
  'Orders',
  'Clients',
  'Databases',
  'Pull Requests',
  'Open Issues',
  'Wiki pages'
]

export default function TimelineDetailsPage() {
  const data = useLoaderData<LoaderData>()
  const submit = useSubmit()
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { pathname } = useLocation()

  const { classes, cx } = useStyles()
  const [active, setActive] = useState('Releases')
  const [activeLink, setActiveLink] = useState('Settings')

  const mainLinks = mainLinksMockdata.map(link => (
    <Tooltip
      label={link.label}
      position='right'
      withArrow
      transitionDuration={0}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={cx(classes.mainLink, {
          [classes.mainLinkActive]: link.label === active
        })}
      >
        <link.icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ))

  const links = linksMockdata.map(link => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: activeLink === link
      })}
      href='/'
      onClick={event => {
        event.preventDefault()
        setActiveLink(link)
      }}
      key={link}
    >
      {link}
    </a>
  ))

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
