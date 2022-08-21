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
  { icon: <IconTimeline size={16} />, color: 'blue', label: 'Timelines' },
  { icon: <IconCalendarEvent size={16} />, color: 'teal', label: 'Events' },
  { icon: <IconFriends size={16} />, color: 'violet', label: 'People' },
  { icon: <IconMap size={16} />, color: 'grape', label: 'Locations' }
]

export function MainLinks() {
  const links = data.map(link => <NavbarLink {...link} key={link.label} />)
  return <div>{links}</div>
}

export function Page({
  aside,
  children,
  actions,
  toolbarButtons,
  showBackButton = false,
  goBackTo,
  fab,
  title
}: {
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
}): JSX.Element {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
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
          <Navbar.Section>LINJEN</Navbar.Section>
          <Navbar.Section grow mt='md'>
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <NavbarUser />
          </Navbar.Section>
        </Navbar>
      }
      header={<Header title={title} opened={opened} setOpened={setOpened} />}
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
    // <div className='drawer-mobile drawer min-h-full'>
    //   <input id='my-drawer' type='checkbox' className='drawer-toggle' />
    //   <div className='drawer-content flex flex-col'>
    //     <Navbar
    //       className='lg:hidden'
    //       title={title}
    //       goBackTo={goBackTo}
    //       rightButtons={toolbarButtons}
    //       showBackButton={showBackButton}
    //     />
  )
}
