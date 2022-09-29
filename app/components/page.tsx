import type { MantineNumberSize, MantineTransition } from '@mantine/core'
import {
  AppShell,
  Aside,
  Box,
  MediaQuery,
  Navbar,
  Text,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { openConfirmModal } from '@mantine/modals'
import {
  IconCalendarEvent,
  IconFriends,
  IconMap,
  IconTimeline
} from '@tabler/icons'
import { useEffect, useState } from 'react'
import { Fab } from './fab'
import { Header } from './header'
import type { NavbarLinkProps } from './navbar-link'
import { NavbarLink } from './navbar-link'
import { NavbarUser } from './navbar-user'

const data: NavbarLinkProps[] = [
  {
    icon: <IconTimeline size={16} />,
    color: 'blue',
    label: 'Timelines',
    href: '/timelines'
  },
  {
    icon: <IconCalendarEvent size={16} />,
    color: 'teal',
    label: 'Events',
    href: '/events'
  },
  {
    icon: <IconFriends size={16} />,
    color: 'violet',
    label: 'People',
    href: '/people'
  },
  {
    icon: <IconMap size={16} />,
    color: 'grape',
    label: 'Locations',
    href: '/locations'
  }
]

export function MainLinks() {
  const links = data.map(link => <NavbarLink key={link.label} {...link} />)
  return <div>{links}</div>
}

type PageProps = {
  actions?: JSX.Element
  aside?: JSX.Element
  children: React.ReactNode
  fab?: {
    offset: boolean
    icon: JSX.Element
    to?: string
    onClick?: () => void
  }
  bottomNavigation?: JSX.Element
  goBackTo?: string
  header?: React.ReactNode
  padding?: MantineNumberSize
  showBackButton?: boolean
  transition?: MantineTransition
  title: string
  toolbarButtons?: JSX.Element
}

export function Page(props: PageProps): JSX.Element {
  const {
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions,
    aside,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bottomNavigation,
    fab,
    goBackTo,
    header,
    padding,
    showBackButton = false,
    title,
    toolbarButtons,
    transition = 'fade'
  } = props
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const [opened, setOpened] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openModal = () =>
    openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size='sm'>
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed')
    })

  return (
    <AppShell
      padding={padding}
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
        }
      }}
      asideOffsetBreakpoint='sm'
      aside={
        aside && (
          <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
            <Aside p='md' hiddenBreakpoint='sm' width={{ sm: 200, lg: 300 }}>
              {aside}
            </Aside>
          </MediaQuery>
        )
      }
      footer={mobile ? bottomNavigation : undefined}
      header={
        <div>
          <Header
            mobileTitle={title}
            opened={opened}
            setOpened={setOpened}
            goBackTo={goBackTo}
            showBackButton={showBackButton}
            rightButtons={toolbarButtons}
          />
          {header}
        </div>
      }
      navbarOffsetBreakpoint='sm'
      navbar={
        <Navbar
          p='md'
          hiddenBreakpoint='sm'
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow mt='md'>
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <NavbarUser />
          </Navbar.Section>
        </Navbar>
      }
    >
      {fab && (
        <Fab
          onClick={fab.onClick}
          offset={fab.offset}
          link={fab.to}
          icon={fab.icon}
        />
      )}
      <Transition
        mounted={mounted}
        transition={transition || 'fade'}
        duration={400}
        timingFunction='ease'
      >
        {styles => <Box style={styles}>{children}</Box>}
      </Transition>
    </AppShell>
  )
}
