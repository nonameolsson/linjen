import type { MantineTransition } from '@mantine/core'
import {
  AppShell,
  Aside,
  Box,
  MediaQuery,
  Navbar,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
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
  showBackButton?: boolean
  transition?: MantineTransition
  title: string
  toolbarButtons?: JSX.Element
}

export function Page(props: PageProps): JSX.Element {
  const {
    aside,
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bottomNavigation,
    header,
    toolbarButtons,
    showBackButton = false,
    goBackTo,
    fab,
    transition = 'fade',
    title
  } = props
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const [opened, setOpened] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AppShell
      padding={0}
      footer={mobile ? bottomNavigation : undefined}
      // styles={{
      //   body: {
      //     height: '100%'
      //   },
      //   main: {
      //     background:
      //       theme.colorScheme === 'dark'
      //         ? theme.colors.dark[8]
      //         : theme.colors.gray[0],
      //     display: 'flex',
      //     flexDirection: 'column',
      //     height: '100%',
      //     overflowY: 'scroll'
      //   },
      //   root: {
      //     height: '100%',
      //     overflow: 'hidden'
      //   }
      // }}
      navbarOffsetBreakpoint='sm'
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
