import { AppShell, Navbar, useMantineTheme } from '@mantine/core'
import {
  IconCalendarEvent,
  IconFriends,
  IconMap,
  IconTimeline
} from '@tabler/icons'
import { useState } from 'react'
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
  const links = data.map(link => <NavbarLink {...link} key={link.label} />)
  return <div>{links}</div>
}

type PageProps = {
  aside?: JSX.Element
  children: React.ReactNode
  actions?: JSX.Element
  goBackTo?: string
  showBackButton?: boolean
  toolbarButtons?: JSX.Element
  fab?: {
    offset: boolean
    icon: JSX.Element
    to?: string
    onClick?: () => void
  }
  title: string
}

export function Page(props: PageProps): JSX.Element {
  const {
    aside,
    children,
    actions,
    toolbarButtons,
    showBackButton = false,
    goBackTo,
    fab,
    title
  } = props
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)

  return (
    <AppShell
      fixed={false}
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          height: '100vh',
          'overflow-y': 'scroll'
        },
        root: {
          height: '100vh'
        }
      }}
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      aside={aside}
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
        <Header
          mobileTitle={title}
          opened={opened}
          setOpened={setOpened}
          goBackTo={goBackTo}
          showBackButton={showBackButton}
          rightButtons={toolbarButtons}
        />
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
      {children}
    </AppShell>
  )
}
